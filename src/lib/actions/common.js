'use server'

import qs from 'qs'
import { errResponse } from '../utils';

const endpoint = process.env.STRAPI_API_ENDPOINT;
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
};

export async function strapiFetch({ path, query, method = 'GET', body, tags, revalidateTime = 18000 }) {
    try {
        const url = `${endpoint}${path}${query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : ''}`;
        const result = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            ...(tags && { next: { tags, revalidate: revalidateTime } })
        });

        if (method === 'DELETE') {
            if (!result.ok) {
                throw new Error("An error occured while deleting");
            }

            return { status: result.status }
        }


        const responseBody = await result.json();

        if (!result.ok) {
            throw responseBody;
        }

        console.log({
            status: result.status,
            body: responseBody
        });

        return {
            status: result.status,
            body: responseBody
        };
    } catch (e) {
        return { error: e?.error };
    }
}