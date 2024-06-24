
import { z } from 'zod';
export const registerSchema = z.object({
    name: z.string().min(3,{ message: "Must be 5 or more characters long" }),
    email: z.string().email({message: "Please enter Valid Email" }),
    password: z.string().min(6, {message: "Password must be at least 6 characters long" }),
  });
  
  export const loginSchema = z.object({
    email: z.string().email({message: "Please enter Valid Email" }),
    password: z.string().min(6, {message: "Password must be at least 6 characters long" }),
  });
  