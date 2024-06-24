import { Request, Response } from "express";
import User from "../model/userSchema";
import { clearToken, generateToken, getUser } from "../utils/auth";
import { loginSchema, registerSchema } from "../utils/zod";
  
// Controllr for Register User
const registerUser = async (req: Request, res: Response) => {

    try {
        // const { name, email, password } = req.body;
        const parsedData = registerSchema.parse(req.body);
        const { name, email, password } = parsedData;

        if (!name || !email || !password) {
          return;
        }
        // find if user registered with email.
        let user = await User.findOne({ email });
        if (user !== null) {
          res.status(400).json({
            message: "user is registerd",
          });
        }
        // Create User
        user = await User.create({
          name,
          email,
          password,
        });
        // generate JWT Token
        generateToken(res, user._id);
      
        if (user !== null) {
          res.status(201).json({
            message: "created successfully",
            user: user,
          });
        } else {
          res.status(400).json({
            message: "something error occured hile saving user.",
          });
        }
    } catch (error) {
        console.log("Error Occured", error);
    }
};

// Login-User Controller
const loginUser = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.parse(req.body);

    const { email, password } = parsedData;

    if (!email || !password) {
      return;
    }
    // Find User With Email.
    let user = await User.findOne({ email });
    if (user === null) {
      res.status(400).json({
        message: "user is not registered.",
      });
    }
    // Hash Password->Compare with Stored Password
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(res, user._id);
      res.status(200).json({
        email: user.email,
        token: token,
        _id:user._id
      });
    } else {
      res.status(400).json({
        message: "password is wrong.",
      });
    }
  } catch (error) {
    console.log("Error Occured", error);
  }
};
// LogOut Controller
const logout = (req: Request, res: Response) => {

    try {
        if (req.cookies["auth-cookie"]) {
            clearToken(res);
          }
          res.status(200).json({ message: "User logged out" });
    } catch (error) {
        console.log("Error Occured", error);
    }
  
};
// Get USer Controller
const Me = (req: Request, res: Response) => {

    try {
        if (req.cookies["auth-cookie"]) {
            const token: string = req.cookies["auth-cookie"];
            getUser(token);
          } else {
            res.status(200).json({ message: "Please Login" });
          }
    } catch (error) {
        console.log("Error Occured", error);
    }
  
};
export { registerUser, loginUser, logout, Me };
