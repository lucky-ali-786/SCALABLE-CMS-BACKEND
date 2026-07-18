import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/apierror.js";
import { Apiresponse } from '../utils/Apiresponse.js';
import jwt from "jsonwebtoken";
import { emailqueue } from "../bullmq/producer.js";
import { OAuth2Client } from "../utils/googleauth.js";
import axios from "axios";
import nodemailer from "nodemailer";
import { connection } from "../db/redis.js";
import crypto from "crypto";
import { htmlTemplate } from "./template.js";
import { verifyTurnstileToken } from "../utils/turnstile.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        return { accessToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const register = asynchandler(async (req, res) => {
    const { otp, verificationToken } = req.body;
    
    if (!otp || !verificationToken) {
        throw new ApiError(400, "FIELDS MISSING");
    }
    const data = await connection.get(`otp:register:${verificationToken}`);
    if (!data) {
        throw new ApiError(400, "SESSION EXPIRED REGISTER AGAIN");
    }
    const parsed = JSON.parse(data);
    if (parsed.otp !== otp) {
        throw new ApiError(400, "INVALID OTP");
    }
    const { name, email, password } = parsed;
    const exists = await User.findOne({ email: email });
    if (exists) {
        await connection.del(`otp:register:${verificationToken}`)
        throw new ApiError(400, "USER ALREADY EXISTS PLEASE LOGIN");
    }
    let role = 'user';
    if (email === process.env.ADMIN_EMAIL) role = 'admin'
    const user = new User({
        name: name,
        email: email,
        password: password,
        role: role
    })
    await user.save();
    if (!user) {
        throw new ApiError(500, "USER REGISTRATION FAILED");
    }
    await connection.del(`otp:register:${verificationToken}`)
    const user1 = await User.findById(user._id).select("-password");
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user1._id);
    
    // --- UPDATED COOKIE OPTIONS ---
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                { user1 },
                "User registered Successfully")
        )
})

const login = asynchandler(async (req, res, next) => {
    const { email, password, captchaToken } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "FIELDS REQUIRED");
    }

    if (captchaToken) {
        await verifyTurnstileToken(captchaToken);
    } else {
        throw new ApiError(400, "CAPTCHA verification is required");
    }

    const exists = await User.findOne({ email: email }).select("+password");
    if (!exists) {
        throw new ApiError(400, "USER DOENT EXISTS PLEASE REGSITER FIRST");
    }
    const comppass = await exists.isPasswordcorrect(password)
    if (!comppass) {
        throw new ApiError(400, "PASSWORD INCORRECT")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(exists._id);
    const loggedin = await User.findById(exists._id).select("-password -refreshToken")
    
    // --- UPDATED COOKIE OPTIONS ---
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                {
                    user: loggedin, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})

const logout = asynchandler(async (req, res, next) => {
    const logout = await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        },
    }, {
        new: true
    })
    
    // --- UPDATED COOKIE OPTIONS ---
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
    
    return res.status(200).clearCookie('accessToken', options).clearCookie("refreshToken", options).json(new Apiresponse(200, {}, "USER LOGGED OUT SUCCESSFULLY"))
})

const getcurrentuser = asynchandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(new Apiresponse(200, user, "user fecthed successfully"))
})

const googlelogin = asynchandler(async (req, res) => {
    const { code } = req.query;
    if (!code) {
        throw new ApiError(400, "GOOGLE AUTH CODE MISSING");
    }

    const { tokens } = await OAuth2Client.getToken(code);
    OAuth2Client.setCredentials(tokens);

    const googleuserinfo = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name } = googleuserinfo.data;

    if (!email) {
        throw new ApiError(400, "GOOGLE AUTHENTICATION FAILED");
    }

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            email,
            name,
        });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedin = await User.findById(user._id)
        .select("-password -refreshToken");

    // --- UPDATED COOKIE OPTIONS ---
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                { user: loggedin, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const getuser = asynchandler(async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new ApiError(404, "USER NOT FOUND");
    }
    return res.status(200).json(new Apiresponse(200, user, "USER FETCHED SUCCESSFULLY"));
})

const sendmail = asynchandler(async (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        throw new ApiError(400, "FIELDS MISSING");
    }
    await emailqueue.add("email-queue", { email: email, message: message });
    return res.status(200).json(new Apiresponse(200, {}, "EMAIL SENT TO QUEUE SUCCESSFULLY"));
});

const setotp = asynchandler(async (req, res) => {
    const { name, email, password, captchaToken } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(400, "FIELDS MISSING");
    }

    if (captchaToken) {
        await verifyTurnstileToken(captchaToken);
    } else {
        throw new ApiError(400, "CAPTCHA verification is required");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const verificationToken = crypto.randomUUID();
    const redisKey = `otp:register:${verificationToken}`;
    await connection.set(
        redisKey,
        JSON.stringify({
            name,
            email,
            password,
            otp,
        }),
        "EX",
        3 * 60
    );
    const htmlContent = htmlTemplate(name, otp);
    await emailqueue.add("email-queue", {
        email: email,
        message: { htmlTemplate: htmlContent },
    },{ 
      priority: 1
    });
    return res
        .status(200)
        .json(new Apiresponse(200, verificationToken, "OTP SENT SUCCESSFULLY"));
});

const genaccesstoken = asynchandler(async (req, res) => {
    const token  = req.cookies.refreshToken;
    if (!token) {
        throw new ApiError(401, "REFRESH TOKEN MISSING");
    }
    const verif = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(verif._id);
    if (!user || user.refreshToken !== token) {
        throw new ApiError(403, "INVALID REFRESH TOKEN");
    }
    const { accessToken } = await generateAccessAndRefereshTokens(user._id);
    
    // --- UPDATED COOKIE OPTIONS ---
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new Apiresponse(
                200,
                {},
                "New Access Token Generated Successfully"
            )
        )
})

export {
    register,
    getuser,
    login,
    logout,
    getcurrentuser,
    googlelogin,
    sendmail,
    setotp,
    genaccesstoken
}