import type {APIRoute} from "astro";
import {updateDepartmentsIfNeeded} from "../../../../logic/departments.logic.ts";
import {corsHeaders} from "../../../../logic/cors.headers.ts";


export const GET: APIRoute = async ({locals, request}) => {

    if (request.headers.get('Authorization') != '01JSK775XA5HCF6J2WMHXHX6FM') {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
                ...corsHeaders,
            },
        });
    }

    await updateDepartmentsIfNeeded({
        cache: locals.runtime.env.SESSION,
    });

    return new Response('ok', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            ...corsHeaders,
        },
    });
}

export const OPTIONS: APIRoute = async () => {
    return new Response('ok', {
        status: 200,
        headers: corsHeaders,
    })
}