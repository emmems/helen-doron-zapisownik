import { BitsnapBackend } from "bitsnap-checkout/backend";
import { getEmailTemplate } from "./email.template.ts";
import { getMailConfigForDepartment } from "./mail.config.logic.ts";

export async function sendNotificationToUser(args: {
    cache: KVNamespace;
    department: string;
    replyTo?: string;
    email: string;
}) {
    const mailConfig = await getMailConfigForDepartment(args.department, args.cache);
    if (mailConfig == null) {
        console.error('no mail config found for department', args.department);
        return;
    }

    const result = await BitsnapBackend.sendNotification({
        type: 'email',
        title: mailConfig.subject,
        body: mailConfig.body,
        to: [args.email],
        emailOptions: {
            replyTo: args.replyTo,
            subject: mailConfig.subject,
            htmlText: getEmailTemplate({
              logoURL: 'https://pokazowa.helendoron.pl/wp-content/uploads/2025/05/helen-doron-english-email-logo-2.png',
              message: mailConfig.body.replaceAll('\n', '<br />')
            }),
        },
    })

    if (result == 'failure') {
        console.error('failed to send notification');
        return;
    }
}

export async function sendNotificationToDepartment(args: {
    summary: string;
    emails: string[];
}) {
    const result = await BitsnapBackend.sendNotification({
        type: ['email', 'push'],
        title: 'Formularz kontaktowy',
        body: args.summary,
        to: args.emails,
        emailOptions: {
            subject: 'Dziękujemy za zapis – ważne informacje o lekcji pokazowej w Helen Doron English',
        },
    })

    if (result == 'failure') {
        console.error('failed to send notification');
        return;
    }
}
