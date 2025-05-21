import zod from "zod";
import type {Departments} from "./departments.logic.ts";

export async function getAllDepartments(): Promise<Departments> {
    const start = performance.now();
    console.log('making request for departaments');
    const result = await fetch('https://n8n.lecenakodach.pl/webhook/helen-doron-get-places', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log('departments request took', performance.now() - start);

    try {
        const payload = excelRows.parse(await result.json());

        return payload.map(el => ({
            id: el.department.normalize(),
            name: el.department,
            mails: el.mails,
            state: el.state,
        }));
    } catch (e) {
        console.warn(e);
        return [];
    }
}

const excelRow = zod.object({
    'Oddział': zod.string(),
    'Mail': zod.string(),
    'Województwo': zod.string(),
}).transform(el => ({
    department: el['Oddział'],
    mails: el.Mail.split(',').map(el => el.trim()),
    state: el['Województwo'].toLowerCase().normalize(),
}));
const excelRows = zod.array(excelRow);