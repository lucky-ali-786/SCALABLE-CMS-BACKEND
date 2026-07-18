import { Router } from 'express';
import { upload } from '../middlewares/multer.js'
import { VerifyJwt } from '../middlewares/user_authorization.js'
import {
    createpost,
    updatepost,
    deletepost,
    getpost,
    getallposts,
    getmyposts,
    schduledpost,
    generateBlog 
} from '../controllers/posts.controller.js'

const router = Router();

router.use(VerifyJwt)
router.route('/generate-blog').post(generateBlog);

router.route('/createpost').post(upload.single('featuredImage'),
    createpost);
    
router.route('/getallposts').get(getallposts);

router.route('/myposts').get(getmyposts);

router.route('/scheduledpost').post(upload.single('featuredImage'),
    schduledpost);
router.route('/getpost/:postId').get(getpost);
router.route('/:postId').patch(upload.single('featuredImage'),
    updatepost);
    
router.route('/:postId').delete(deletepost);

export default router;