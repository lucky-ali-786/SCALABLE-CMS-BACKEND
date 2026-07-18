import { Router } from "express";
const router = Router();
import {
   createcomment, deletecomment, getcommentsbypostid, likecomment, mycomments,
   editcomment
} from '../controllers/comment.controllers.js';
import { VerifyJwt } from "../middlewares/user_authorization.js";
router.post('/createcomment', VerifyJwt, createcomment);
router.get('/mycomments', VerifyJwt, mycomments);
router.post('/likecomment', VerifyJwt, likecomment);
router.patch('/editcomment', VerifyJwt, editcomment);
router.delete('/deletecomment/:commentId',VerifyJwt, deletecomment);
router.get('/getcommentsbypostid/:postId', getcommentsbypostid);
export default router;