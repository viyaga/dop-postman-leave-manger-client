"use server"

const { getSubstitutesQuery } = require("../queries");
const { strapiFetch } = require("./common")

export const getAllSubstitutes = async () => {
    const res = await strapiFetch({ path: '/substitutes', query: getSubstitutesQuery, tags: ['substitutes'], revalidateTime: 3600 * 24 * 365 });
    return res.body.data;
}