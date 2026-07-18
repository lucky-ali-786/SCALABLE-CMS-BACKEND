import axios from "axios";
import { ApiError } from "./apierror.js";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const verifyTurnstileToken = async (token) => {
  try {
    if (!token) {
      throw new ApiError(400, "CAPTCHA token is missing");
    }

    const response = await axios.post(TURNSTILE_VERIFY_URL, {
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    });

    if (!response.data.success) {
      console.log("Turnstile verification failed:", response.data);
      throw new ApiError(400, "CAPTCHA verification failed. Please try again.");
    }

    // Optional: Check error codes returned by Cloudflare
    if (response.data["error-codes"] && response.data["error-codes"].length > 0) {
      console.log("Turnstile error codes:", response.data["error-codes"]);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error verifying Turnstile token:", error.message);
    throw new ApiError(500, "Error verifying CAPTCHA. Please try again.");
  }
};

export { verifyTurnstileToken };
