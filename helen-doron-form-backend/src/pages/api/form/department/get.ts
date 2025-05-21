import type { APIRoute } from "astro";
import { corsHeaders } from "../../../../logic/cors.headers.ts";
import { getCachedDepartments } from "../../../../logic/departments.logic.ts";

export const GET: APIRoute = async ({request, locals}) => {
    if (request.headers.get('Authorization') != '01JSK775XA5HCF6J2WMHXHX6FM') {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
                ...corsHeaders,
            },
        });
    }
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const input = url.searchParams.get('input');

    const result = await getCachedDepartments({
        cache: locals.runtime.env.SESSION,
        executionContext: locals.runtime.ctx,
    });

    if (search != null && search.length > 0) {
        result.departments = result.departments.filter(d => {
            console.log(d.name, normalizeString(d.state ?? '').toLowerCase(), normalizeString(search).toLowerCase(), normalizeString(d.state ?? '').toLowerCase() == normalizeString(search).toLowerCase());
          return normalizeString(d.state ?? '').toLowerCase(), normalizeString(search).toLowerCase(), normalizeString(d.state ?? '').toLowerCase() == normalizeString(search).toLowerCase();
        });
    }
    if (input != null) {
        result.departments = result.departments.filter(d => d.name?.toLowerCase().normalize().includes(input.normalize().toLowerCase()) ?? true);
    }

    result.departments = result.departments.map(el => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete el.mails;
        return el;
    })

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
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


function normalizeString(val: string): string {
    return val.normalize('NFD').replaceAll('-', '').replaceAll('ł', 'l').replace(/[\u0300-\u036f]/g, "");
}
