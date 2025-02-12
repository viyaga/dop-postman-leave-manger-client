"use server"

import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";
import { signIn } from "@/auth";
import prisma from "@/lib/prisma";

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
const registerAdmin = async (name, email, password, officeName) => {

  try {

		const user = await prisma.user.findUnique({ where: { email } });

    if (user) {     
      return { error: "User already exists" }
    }
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, officeName },
    });

    return { success: "Registration successfull" }

  } catch (error) {
    return { error: "An error occurred, try after sometime" }
  }
}

// login User =========================================================
const loginUser = async (email, password, subdivisionName) => {
  // userName = email || employeeId
  try {
    if (subdivisionName) {
      await signIn("credentials", { email, password, subdivisionName, redirect: false });
    } else {
      await signIn("credentials", { userName, password, redirect: false });
    }

    return { success: "Login successfull" }
  } catch (err) {
    return { error: "Wrong Credentials!" }
  }
};

// ➤ **Create User**
export async function createUser(name, email, password, officeName) {
  try {
    const newUser = await prisma.user.create({
      data: { name, email, password, officeName },
    });
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, message: "Error creating user" };
  }
}

// ➤ **Get All Users**
export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    return [];
  }
}

// ➤ **Get User by ID**
export async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
}

// ➤ **Update User**
export async function updateUser(id, name, email, officeName) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, officeName },
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, message: "Error updating user" };
  }
}

// ➤ **Delete User**
export async function deleteUser(id) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Error deleting user" };
  }
}


export { connectDB, registerAdmin, loginUser }