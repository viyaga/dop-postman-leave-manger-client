"use server"

import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";
import { signIn } from "@/auth";
import { Admin } from "../models";

// connect DB =======================================================
const connectDB = async () => {
    const connection = {};
    try {
        if (connection.isConnected) return;
        const db = await mongoose.connect(process.env.MONGO_URI);
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        throw new Error(error);
    }
};

// register user ========================================================
const registerAdmin = async (name, email, password, subdivisionName) => {

    try {
        await connectDB()
        const isExisiting = await Admin.findOne({ email })
        if (isExisiting) return { error: "Email Already Registered" }

        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)

        await Admin.create({ name, email, password: hashedPassword, subdivisionName })
        return { success: "Registration successfull" }
    } catch (error) {
        return { error: "An error occurred, try after sometime" }
    }
}

// login User =========================================================
const loginUser = async (userName, password, subdivisionName) => {
    // userName = email || employeeId
    try {
        if (subdivisionName) {
            await signIn("credentials", { userName, password, subdivisionName, redirect: false });
        } else {
            await signIn("credentials", { userName, password, redirect: false });
        }

        return { success: "Login successfull" }
    } catch (err) {
        return { error: "Wrong Credentials!" }
    }
};

export { connectDB, registerAdmin, loginUser }