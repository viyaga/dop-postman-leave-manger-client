"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { errResponse } from "../utils";

// ➤ **Get All Substitutes**
export const getAllSubstitutes = async () => {
  try {
    const substitutes = await prisma.substitute.findMany();
    return substitutes;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Get Substitute by ID**
export const getSubstituteById = async (id) => {
  try {
    const substitute = await prisma.substitute.findUnique({ where: { id } });
    return substitute;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Create Substitute**
export const createSubstitute = async (data) => {
  try {
    const newSubstitute = await prisma.substitute.create({
      data,
    });

    return newSubstitute;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Update Substitute**
export const updateSubstitute = async (id, data) => {
  try {
    const updatedSubstitute = await prisma.substitute.update({
      where: { id },
      data,
    });

    revalidateTag("substitutes");
    return updatedSubstitute;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Delete Substitute**
export const deleteSubstitute = async (id) => {
  try {
    await prisma.substitute.delete({ where: { id } });
    revalidateTag("substitutes");
    return { success: true };
  } catch (error) {
    return { error: errResponse(error) };
  }
};
