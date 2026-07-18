import { Router } from "express";
const router = Router();
import {
    toggleLike, trendingposts,
    getLikesByPostId,
    getlikes,
    mylikes
} from '../controllers/likes.controllers.js';
import { VerifyJwt } from "../middlewares/user_authorization.js";
router.get('/like/trendingposts',VerifyJwt,trendingposts);
router.post('/like/toggle', VerifyJwt, toggleLike);
router.get('/likeofapost/:postId',getlikes);
router.get('/likedby/:postId',VerifyJwt,getLikesByPostId);
router.get('/mylikes',VerifyJwt,mylikes);
export default router;