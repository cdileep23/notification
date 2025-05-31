import express from 'express'
import { followUser, getUsersNotFollowing } from '../controller/user.controller.js';

const router=express.Router()


router.route("/get-unfollowing/:userId").get(getUsersNotFollowing);

router.route('/add-follower/:userId').post(followUser)
export default router