import express from "express";
import { Me, loginUser, logout, registerUser } from "../controller/authController";

const router = express.Router()
// --Routes
router.post('/register-user' , registerUser)
router.post('/login-user' , loginUser)
router.post('/logout' , logout)
router.get('/user',Me)

export default router