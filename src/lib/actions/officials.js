"use server";

import { revalidateTag } from "next/cache";
import { errResponse } from "../utils";

const { getRegularEmployeesQuery } = require("../queries");
const { strapiFetch } = require("./common");

export const getAllRegularEmployees = async () => {
    const res = await strapiFetch({ path: '/officials', query: getRegularEmployeesQuery, tags: ['regularEmployees'], revalidateTime: 3600 * 24 * 365 });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    return res?.body?.data;
};

export const createRegularEmployee = async (data) => {
    const res = await strapiFetch({ path: '/officials', method: 'POST', body: { data } });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    revalidateTag('regularEmployees');
    return res?.body?.data;
};

export const updateRegularEmployee = async (documentId, data) => {
    console.log({ documentId, data });
    
    const res = await strapiFetch({ path: `/officials/${documentId}`, method: 'PUT', body: { data } });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    revalidateTag('regularEmployees');
    return res?.body?.data;
};

export const delRegularEmployee = async (documentId) => {
    const res = await strapiFetch({ path: `/officials/${documentId}`, method: 'DELETE' });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    revalidateTag('regularEmployees');
    return;
};

export const getRegularEmployeeById = async (documentId) => {
    const res = await strapiFetch({ path: `/officials/${documentId}` });
    
    if (res?.error) return { error: errResponse(res?.error) };
    
    return res?.body?.data;
};
