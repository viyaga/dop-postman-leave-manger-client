"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { errResponse } from "../utils";

// ➤ **Get All Officials**
export const getAllOfficials = async () => {
  try {
    const officials = await prisma.official.findMany();
    return officials;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Get Official by ID**
export const getOfficialById = async (id) => {
  try {
    const official = await prisma.official.findUnique({
      where: { id },
    });
    return official;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Create Official**
export const createOfficial = async (data) => {
  try {
    const newOfficial = await prisma.official.create({
      data,
    });

    return newOfficial;
  } catch (error) {
    console.log({ error });
    
    return { error: errResponse(error) };
  }
};

// ➤ **Update Official**
export const updateOfficial = async (id, data) => {
  try {
    const updatedOfficial = await prisma.official.update({
      where: { id },
      data,
    });

    return updatedOfficial;
  } catch (error) {
    return { error: errResponse(error) };
  }
};

// ➤ **Delete Official**
export const deleteOfficial = async (id) => {
  try {
    await prisma.official.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { error: errResponse(error) };
  }
};
