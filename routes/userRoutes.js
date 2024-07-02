import express from 'express';
import {createPost,updatePost,deletePost,getPosts,getSinglePost,loggedUserPosts,likePost,dislikePost,allUsers} from '../controllers/userControllers.js'
import {checkAuth} from '../middlewares/checkAuth.js'
const router = express.Router();

router.use(checkAuth);

router.post("/create-post", createPost)
router.patch("/update-post",updatePost)
router.delete("/delete-post/:postId",deletePost)
router.get("/get-posts",getPosts)
router.get("/get-post/:postId",getSinglePost)
router.get("/get-posts/:userId",loggedUserPosts)
router.post("/like-post", likePost)
router.post("/dislike-post", dislikePost)
router.get("/all-users", allUsers)
export default router