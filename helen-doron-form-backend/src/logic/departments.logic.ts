import type { ExecutionContext } from "@cloudflare/workers-types";
import zod from "zod";
import { getAllDepartments } from "./get.departments.ts";


export async function getCachedDepartments(args: {
    cache: KVNamespace;
  executionContext?: ExecutionContext;
}) {
    const shouldUpdateDepartments = await args.cache.get('cached-departments-should-update');
    const shouldUpdate = shouldUpdateDepartments == null || shouldUpdateDepartments === 'true';
    const cachedValue = await args.cache.get('cached-departments');
    if (cachedValue) {

      if (shouldUpdate) {
        args.executionContext?.waitUntil(getAndCacheDepartaments({
          cache: args.cache,
        }));
      }

        return {
            departments: departments.parse(JSON.parse(cachedValue)),
            shouldUpdate: false,
        };
    }

    const deps = await getAndCacheDepartaments({
        cache: args.cache,
    });

    return {
        departments: deps,
        shouldUpdate: false,
    }
}

export async function updateDepartmentsIfNeeded(args: {
    cache: KVNamespace;
}) {
    const isUpdating = await args.cache.get('is-updating-departments') === 'true';
    if (isUpdating) {
        console.log('departments are already updating, skipping');
        return;
    }
    await args.cache.put('is-updating-departments', 'true', { expirationTtl: 60 });

    await getAndCacheDepartaments(args);

    await args.cache.delete('is-updating-departments');
}

export async function getAndCacheDepartaments(args: {
    cache: KVNamespace;
}) {
    const departaments = await getAllDepartments();

    await Promise.all([
        args.cache.put('cached-departments-should-update', 'false', {expirationTtl: 60 * 15}),
        args.cache.put('cached-departments', JSON.stringify(departaments)),
    ]);

    return departaments;
}

const department = zod.object({
    id: zod.string(),
    name: zod.string(),
    mails: zod.array(zod.string()),
    state: zod.string().optional(),
})
const departments = zod.array(department);

export type Department = zod.infer<typeof department>;
export type Departments = zod.infer<typeof departments>;
