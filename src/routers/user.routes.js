import { Router } from 'express';
import { VerifyJwt } from '../middlewares/user_authorization.js'
import {
    register,
    login,
    logout,
    getcurrentuser,
    googlelogin, getuser, sendmail,
    setotp, genaccesstoken
} from '../controllers/users.controller.js'
import limiter from '../utils/limiter.js';
import { looseLimiter } from '../utils/limiter.js';
const router = Router();
router.route('/register').post(limiter, register);
router.route("/login").post(limiter, login);
router.route('/logout').post(VerifyJwt, logout);
router.route('/getcurrentuser').get(VerifyJwt, getcurrentuser)
router.route('/google').get(googlelogin);
router.route('/sendmail').post(looseLimiter, sendmail);
router.route('/sendotp').post(limiter, setotp);
router.route('/genaccesstoken').get(genaccesstoken);
router.route('/user/:userId').get(getuser);
export default router;
