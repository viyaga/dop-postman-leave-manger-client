"use server"

import { revalidateTag } from "next/cache";
import { errResponse } from "../utils";

const { getHolidaysQuery } = require("../queries");
const { strapiFetch } = require("./common")

export const getAllHolidays = async () => {
    const res = await strapiFetch({ path: '/holidays', query: getHolidaysQuery, tags: ['holidays'], revalidateTime: 3600 * 24 * 365 });

    if (res?.error) return { error: errResponse(res?.error) }

    return res?.body?.data;
}

export const createHoliday = async (data) => {
    const res = await strapiFetch({ path: '/holidays', method: 'POST', body: { data } });
    if (res?.error) return { error: errResponse(res?.error) }
    revalidateTag('holidays');
    return res?.body?.data;
}

export const updateHoliday = async (documentId, data) => {
    console.log({ documentId, data });

    const res = await strapiFetch({ path: `/holidays/${documentId}`, method: 'PUT', body: { data } });
    if (res?.error) return { error: errResponse(res?.error) }
    revalidateTag('holidays');
    return res?.body?.data;
}

export const delHoliday = async (documentId) => {
    const res = await strapiFetch({ path: `/holidays/${documentId}`, method: 'DELETE' });

    if (res?.error) return { error: errResponse(res?.error) }
    revalidateTag('holidays');

    return
}