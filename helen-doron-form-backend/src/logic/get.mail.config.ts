import zod from "zod";

export async function getMailConfig() {
    const start = performance.now();
    console.log('making request for mail config');
    const result = await fetch('https://n8n.lecenakodach.pl/webhook/helen-doron-form-get-mail-list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log('mail config request took', performance.now() - start);

    try {
        const payload = await result.json();
        console.log('result', payload);
        return mailConfigRows.parse(payload);
    } catch (e) {
        return [];
    }
}

const mailConfigRow = zod.object({
    'Oddział': zod.string(),
    'Treść maila': zod.string(),
    'Temat': zod.string(),
}).transform(el => ({
    department: el['Oddział'],
    body: el["Treść maila"],
    subject: el.Temat,
}));

export const mailConfigRows = zod.array(mailConfigRow);
export type MailConfigRows = zod.infer<typeof mailConfigRows>;