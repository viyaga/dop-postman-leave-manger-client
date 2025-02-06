"use server";

import { revalidateTag } from "next/cache";
import { errResponse } from "../utils";

const { getSubstitutesQuery } = require("../queries");
const { strapiFetch } = require("./common");

export const getAllSubstitutes = async () => {
    const res = await strapiFetch({ path: '/substitutes', query: getSubstitutesQuery, tags: ['substitutes'], revalidateTime: 3600 * 24 * 365 });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    return res?.body?.data;
};

export const createSubstitute = async (data) => {
    const res = await strapiFetch({ path: '/substitutes', method: 'POST', body: { data } });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    revalidateTag('substitutes');
    return res?.body?.data;
};

export const updateSubstitute = async (documentId, data) => {
    console.log({ documentId, data });
    
    const res = await strapiFetch({ path: `/substitutes/${documentId}`, method: 'PUT', body: { data } });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    revalidateTag('substitutes');
    return res?.body?.data;
};

export const delSubstitute = async (documentId) => {
    const res = await strapiFetch({ path: `/substitutes/${documentId}`, method: 'DELETE' });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    revalidateTag('substitutes');
    return
};

export const getSubstituteById = async (documentId) => {
    const res = await strapiFetch({ path: `/substitutes/${documentId}` });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    return res?.body?.data;
};
