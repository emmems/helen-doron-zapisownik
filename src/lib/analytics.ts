import zod from "zod";

const eventPayload = zod.object({
    event: zod.enum(["step_1", "step_2", "step_3", "form_submit", 'form_submit_clicked']),
    step: zod.string().optional(),
    value: zod.number().optional(),
    currency: zod.string().optional(),
    content_name: zod.string().optional(),
});
type EventPayload = zod.infer<typeof eventPayload>;

export function sendAnalyticEvent(payload: EventPayload) {
    if (typeof window == "undefined") {
        return;
    }

    sendGoogleAnalyticsEvent(payload);
    sendPixelAnalyticsEvent(payload);
}

function sendGoogleAnalyticsEvent(
    payload: Record<string, string | number | boolean | undefined>,
) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof window.dataLayer == "undefined") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.dataLayer = [];
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.dataLayer.push(payload);
}

function sendPixelAnalyticsEvent(payload: EventPayload) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof window.fbq == "undefined") {
        return;
    }

    let eventType = "";
    let eventName = "";
    let eventPayload: unknown = {};

    switch (payload.event) {
        case "step_1":
        case "step_2":
        case "step_3":
            eventType = "track";
            eventName = "ViewContent";
            eventPayload = {
                category_name: payload.event,
            };

            break;
        case "form_submit":
            eventType = "track";
            eventName = "ViewContent";
            eventPayload = {
                category_name: payload.event,
            };
            break;
        case "form_submit_clicked":
            eventType = "track";
            eventName = "Submit";
            eventPayload = {
                category_name: payload.event,
            };
            break;
        default:
            break;
    }

    if (window.location.search.includes("analytics")) {
        console.log("Pushing FB event", eventType, eventName, eventPayload);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.fbq(eventType, eventName, eventPayload);
}
