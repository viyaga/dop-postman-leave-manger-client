"use server"

import prisma from "../prisma";
import { errResponse } from "../utils";

export const getAllHolidays = async () => {
    console.log("Prisma Client:", prisma.holiday); // Debugging
    try {
        const holidays = await prisma.holiday.findMany();
        return holidays;
    } catch (error) {
        return { error: errResponse(error) };
    }
}

export async function getHolidayById(id) {
    try {
        const holiday = await prisma.holiday.findUnique({ where: { id } });
        return holiday;
    } catch (error) {
        return null;
    }
}

export const createHoliday = async (data) => {
    const { holiday, date } = data;

    try {
        const { holiday, date } = data;
        const newHoliday = await prisma.holiday.create({
            data: { holiday, date: date ? new Date(date) : null },
        });
        return { success: true, holiday: newHoliday };
    } catch (error) {
        return { error: errResponse(error) };
    }
}

export const updateHoliday = async (id, data) => {
    const { holiday, date } = data;

    try {
        const updatedHoliday = await prisma.holiday.update({
            where: { id },
            data: { holiday, date: date ? new Date(date) : null },
        });

        return { success: true, updatedHoliday };
    } catch (error) {
        return { error: errResponse(error) };
    }
}

export const delHoliday = async (id) => {
    try {
        await prisma.holiday.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        return { success: false, message: "Error deleting holiday" };
    }
}