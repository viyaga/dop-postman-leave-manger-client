"use server"

const { getHolidaysQuery } = require("../queries");
const { strapiFetch } = require("./common")

export const getAllHolidays = async () => {
    const res = await strapiFetch({ path: '/holidays', query: getHolidaysQuery, tags: ['holidays'], revalidateTime: 3600 * 24 * 365 });
    return res.body.data;
}