"use server"

const { getOfficialsQuery } = require("../queries");
const { strapiFetch } = require("./common")

export const getAllOfficials = async () => {
    const res = await strapiFetch({ path: '/officials', query: getOfficialsQuery, tags: ['officials'], revalidateTime: 3600 * 24 * 365 });
    return res.body.data;
}