import express from 'express'
import { getNotifications } from '../controller/notification.controller.js'

const router=express.Router()
router.route('/get-all/:userId').get(getNotifications)

export default router