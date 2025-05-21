import type { APIRoute } from "astro";
import { BitsnapBackend } from "bitsnap-checkout/backend";
import { getMethods } from "../../../../../src/methods/methods.ts";
import type { FormValues } from "../../../../../src/models/models.ts";
import { corsHeaders } from "../../../logic/cors.headers.ts";
import { getCachedDepartments } from "../../../logic/departments.logic.ts";
import { sendNotificationToDepartment, sendNotificationToUser } from "../../../logic/send.notification.ts";

const API_KEY = 'api_01JSPH88RTQK5X7PK8YVVYFYVP_re';
export const POST: APIRoute = async (context) => {
    if (context.request.headers.get('Authorization') != '01JSK775XA5HCF6J2WMHXHX6FM') {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
                ...corsHeaders,
            },
        });
    }

    await BitsnapBackend.setApiKey(API_KEY);
    const form: { [step: string]: FormValues | undefined } = await context.request.json();

    context.locals.runtime.ctx.waitUntil(processRequest({
      session: context.locals.runtime.env.SESSION,
      form: form,
    }));

    return new Response(JSON.stringify(form), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}

async function processRequest(args: {
  form: { [step: string]: FormValues | undefined };
  session: KVNamespace;
}) {

  const readableHumanFormat = await convertPayloadToReadableFormat(args.form);
  const departmentEmails = await getEmailsFromForm(args.session, args.form);

  const userEmail = getUserEmailFromForm(args.form);

  // const mockMail = 'kontakt@mateuszkuchcinski.pl'
  // const mockMail = 'piotr.krzesaj.5@gmail.com';

  if (userEmail) {
      // we are sending notification to user.
      console.log('sending notification to user', userEmail);

      try {

          await sendNotificationToUser({
              cache: args.session,
              department: departmentEmails.department,
              email: userEmail,
              replyTo: departmentEmails.emails.length > 0 ? departmentEmails.emails[0] : undefined,
          });
      } catch (e) {
          console.log(JSON.stringify(e));
          console.warn('failed to send notification to user', e);
      }
  }

  try {
      await sendNotificationToDepartment({
          summary: readableHumanFormat,
          emails: departmentEmails.emails,
      }).then().catch();
  } catch (e) {
      console.error('failed to send notification to department', e);
  }
}

function getUserEmailFromForm(payload: { [step: string]: FormValues | undefined }) {
    if (typeof payload['3'] == 'undefined') {
        return undefined;
    }
    if (typeof payload['3']['6'] == 'undefined') {
        return undefined
    }
    return payload['3']['6'] as string;
}

export const OPTIONS: APIRoute = async () => {
    return new Response('ok', {
        status: 200,
        headers: corsHeaders,
    })
}

async function getEmailsFromForm(cache: KVNamespace, payload: { [step: string]: FormValues | undefined }) {

    if (typeof payload['3'] == 'undefined') {
        return {
            emails: [],
            department: '',
        }
    }
    if (typeof payload['3']['2'] == 'undefined') {
        return {
            emails: [],
            department: '',
        }
    }
    const department = payload['3']['2'];

    const departments = await getCachedDepartments({
        cache: cache,
    })

    const foundDepartment = departments.departments.find(el => el.name === department);

    return {
        emails: foundDepartment?.mails ?? [],
        department: foundDepartment?.name ?? '',
    }
}

async function convertPayloadToReadableFormat(payload: { [step: string]: FormValues | undefined }) {
    const methods = await getMethods();

    const rows: string[] = [];

    for (const step of Object.keys(payload)) {
        const stepIndex = parseInt(step);
        if (isNaN(stepIndex)) {
            continue;
        }
        if (methods.length <= stepIndex) {
            continue;
        }

        const method = methods[stepIndex];
        const stepValues = payload[step];

        let readable = `${method.title} ${method.subtitle ?? ''}
`;

        Object.keys(stepValues ?? {}).forEach(key => {
            const readableValue = method.elements.find(el => el.id === key)?.name;
            const answer = stepValues?.[key];
            readable += `${readableValue}${answer === 'true' ? '' : `: ${answer ?? ''}`}\n`;
        });

        rows.push(readable);
    }

    return rows.join('\n\n');
}
