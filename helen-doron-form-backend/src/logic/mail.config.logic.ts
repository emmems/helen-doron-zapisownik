import { getMailConfig, type MailConfigRows } from "./get.mail.config.ts";

export async function getMailConfigForDepartment(department: string, cache: KVNamespace) {
    const mailConfig = await getCachedMailConfig({
        cache: cache,
    });

    const mailConfigForDepartment = mailConfig.find(el => el.department.toLowerCase() === department.toLowerCase());
    if (mailConfigForDepartment == null) {
        if (mailConfig.length > 0) {
            return mailConfig[0];
        }
        return undefined;
    }

    return mailConfigForDepartment;
}

async function getCachedMailConfig(args: {
    cache: KVNamespace;
}) {
    const shouldUpdateDepartments = await args.cache.get('cached-mail-logic-should-update');

    const shouldUpdate = shouldUpdateDepartments == null || shouldUpdateDepartments === 'true';
    if (!shouldUpdate) {
        const cachedValue = await args.cache.get('cached-mail-logic');
        if (cachedValue) {
            return JSON.parse(cachedValue) as MailConfigRows;
        }
    }

    return await getAndCacheMailConfig({
        cache: args.cache,
    });
}

export async function getAndCacheMailConfig(args: {
    cache: KVNamespace;
}) {
    const mailConfig = await getMailConfig();

    await Promise.all([
        args.cache.put('cached-mail-logic-should-update', 'false', {expirationTtl: 60 * 15}),
        args.cache.put('cached-mail-logic', JSON.stringify(mailConfig)),
    ]);

    return mailConfig;
}
