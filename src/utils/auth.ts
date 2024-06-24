import jwt from "jsonwebtoken";
import { Response } from "express";

const secret = process.env.JWT_SECRET || "secret";
// Generate JWT Token
const generateToken = (res: Response, userId: string): string | undefined => {
    if (!userId) {
        return undefined;
    }
// SIgn token
    const token = jwt.sign({ userId }, secret, {
        expiresIn: "1h",
    });
// Store Token In Cookie.
    res.cookie("auth-cookie", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    return token;
};
// Get Current user Using Token.
const getUser = (token: string): void => {
    console.log(token);

    if (token) {
        try {
            // Decode JWT token
            const decoded = jwt.verify(token, secret);
            console.log(decoded);
        } catch (error) {
            console.error("Token verification failed:", error);
        }
    } else {
        console.log("Token not provided");
    }
};
// Clear token From Cookie.
const clearToken = (res: Response): void => {
    res.cookie("auth-cookie", "", {
        httpOnly: true,
        expires: new Date(0),
    });
};

export { generateToken, clearToken, getUser };
