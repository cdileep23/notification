import express from 'express'
import { createBlog, getBlogsByUser } from '../controller/blog.controller.js';

const router=express.Router()


router.route("/create-blog/:userId").post(createBlog);
router.route('/get-blogs').get(getBlogsByUser)
export default router