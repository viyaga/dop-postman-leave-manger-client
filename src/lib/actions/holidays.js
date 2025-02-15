"use server"

import prisma from "../prisma";
import { errResponse } from "../utils";

export const getAllHolidays = async () => {
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
        return { error: errResponse(error) };
    }
}

export const createHoliday = async (data) => {

    try {
        const newHoliday = await prisma.holiday.create({
            data
        });
        return { success: true, holiday: newHoliday };
    } catch (error) {
        return { error: errResponse(error) };
    }
}

export const updateHoliday = async (id, data) => {

    try {
        const updatedHoliday = await prisma.holiday.update({
            where: { id },
            data,
        });
        console.log({ updatedHoliday });


        return { success: true, updatedHoliday };
    } catch (error) {
        console.error({ error });

        return { error: errResponse(error) };
    }
}

export const delHoliday = async (id) => {

    try {
        await prisma.holiday.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        return { error: errResponse(error) };
    }
}