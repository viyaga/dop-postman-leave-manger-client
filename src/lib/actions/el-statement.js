"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { errResponse } from "../utils";

// ➤ **Get All EL Statements**
export const getAllElStatements = async () => {
  try {
    const elStatements = await prisma.elStatement.findMany();
    return elStatements;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Get EL Statement by ID**
export const getElStatementById = async (id) => {
  try {
    const elStatement = await prisma.elStatement.findUnique({ where: { id } });
    return elStatement;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Create EL Statement**
export const createElStatement = async (data) => {
  try {
    const newElStatement = await prisma.elStatement.create({
      data,
    });

    revalidateTag("el_statements");
    return newElStatement;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Update EL Statement**
export const updateElStatement = async (id, data) => {
  try {
    const updatedElStatement = await prisma.elStatement.update({
      where: { id },
      data,
    });

    revalidateTag("el_statements");
    return updatedElStatement;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Delete EL Statement**
export const deleteElStatement = async (id) => {
  try {
    await prisma.elStatement.delete({ where: { id } });
    revalidateTag("el_statements");
    return { success: true };
  } catch (error) {
    return { error: errResponse(error) };
  }
};
