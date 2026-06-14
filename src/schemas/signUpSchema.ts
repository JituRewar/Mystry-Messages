import {z} from "zod"

export const userNameValidation = z
.string()
.min(2,"username must be atleast 2 characters")
.max(20,"username must not exceeds 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"username must not contain special charcters")

export const signupSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message:"invalied email address"}),
    password: z.string().min(6,{message:"password must be at least 6 characters"})
})