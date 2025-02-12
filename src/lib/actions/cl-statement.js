"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { errResponse } from "../utils";

// ➤ **Get All CL Statements**
export const getAllClStatements = async () => {
  try {
    const clStatements = await prisma.clStatement.findMany();
    return clStatements;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Get CL Statement by ID**
export const getClStatementById = async (id) => {
  try {
    const clStatement = await prisma.clStatement.findUnique({ where: { id } });
    return clStatement;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Create CL Statement**
export const createClStatement = async (data) => {
  try {
    const newClStatement = await prisma.clStatement.create({
      data,
    });

    revalidateTag("cl_statements");
    return newClStatement;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Update CL Statement**
export const updateClStatement = async (id, data) => {
  try {
    const updatedClStatement = await prisma.clStatement.update({
      where: { id },
      data,
    });

    revalidateTag("cl_statements");
    return updatedClStatement;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Delete CL Statement**
export const deleteClStatement = async (id) => {
  try {
    await prisma.clStatement.delete({ where: { id } });
    revalidateTag("cl_statements");
    return { success: true };
  } catch (error) {
    return { error: errResponse(error) };
  }
};
