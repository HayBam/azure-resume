const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
const { EmailClient } = require('@azure/communication-email');

const MAX_EMAILS_PER_HOUR = 2;

const allowedOrigins = [
    'https://odunlamiayobami.com',
    'https://www.odunlamiayobami.com'
];

function getCorsHeaders(request) {
    const origin = request.headers.get('origin');
    const matchedOrigin = allowedOrigins.find(o => o === origin) || allowedOrigins[0];
    return {
        'Access-Control-Allow-Origin': matchedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
}

function getClientIp(request) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-client-ip')
        || request.headers.get('x-real-ip')
        || '0.0.0.0';
}

function validateInput(body) {
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
        return 'All fields are required.';
    }
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
        return 'One or more fields exceed the maximum allowed length.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid email address.';
    }
    return null;
}

async function getCosmosContainer(context) {
    const connectionString = process.env.COSMOS_CONNECTION_STRING;
    const databaseId = process.env.COSMOS_DATABASE_NAME;

    if (!connectionString) {
        throw new Error('COSMOS_CONNECTION_STRING is not configured');
    }

    const client = new CosmosClient(connectionString);
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({
        id: 'contactSubmissions',
        partitionKey: { paths: ['/clientIp'] }
    });

    return container;
}

async function checkRateLimit(container, clientIp, context) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { resources } = await container.items
        .query({
            query: 'SELECT VALUE COUNT(1) FROM c WHERE c.clientIp = @ip AND c.submittedAt > @since',
            parameters: [
                { name: '@ip', value: clientIp },
                { name: '@since', value: oneHourAgo }
            ]
        })
        .fetchAll();

    const count = resources[0] || 0;
    context.log(`Rate limit check: IP ${clientIp} has ${count} submissions in the last hour`);
    return count >= MAX_EMAILS_PER_HOUR;
}

async function sendEmail(subject, name, email, message) {
    const connectionString = process.env.ACS_CONNECTION_STRING;
    const senderAddress = process.env.ACS_SENDER_ADDRESS;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;

    if (!connectionString || !senderAddress || !recipientEmail) {
        throw new Error('Email service is not configured');
    }

    const client = new EmailClient(connectionString);

    const emailMessage = {
        senderAddress,
        content: {
            subject: `Portfolio Contact: ${subject}`,
            plainText: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">
                        New Contact Form Submission
                    </h2>
                    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #374151; width: 80px;">Name:</td>
                            <td style="padding: 8px; color: #1f2937;">${escapeHtml(name)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #374151;">Email:</td>
                            <td style="padding: 8px; color: #1f2937;">
                                <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #374151;">Subject:</td>
                            <td style="padding: 8px; color: #1f2937;">${escapeHtml(subject)}</td>
                        </tr>
                    </table>
                    <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-top: 16px;">
                        <h3 style="color: #374151; margin-top: 0;">Message</h3>
                        <p style="color: #1f2937; white-space: pre-wrap;">${escapeHtml(message)}</p>
                    </div>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                        Sent from your portfolio contact form at odunlamiayobami.com
                    </p>
                </div>
            `
        },
        recipients: {
            to: [{ address: recipientEmail }]
        },
        replyTo: [{ address: email, displayName: name }]
    };

    const poller = await client.beginSend(emailMessage);
    return await poller.pollUntilDone();
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, ch => map[ch]);
}

async function sendContactEmailHandler(request, context) {
    context.log('SendContactEmail function triggered');

    const headers = getCorsHeaders(request);

    if (request.method === 'OPTIONS') {
        return { status: 200, headers, body: '' };
    }

    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const isAllowed = (origin && allowedOrigins.includes(origin))
        || (referer && allowedOrigins.some(o => referer.startsWith(o)));

    if (!isAllowed) {
        return {
            status: 403,
            headers,
            body: JSON.stringify({ error: 'Forbidden' })
        };
    }

    try {
        const body = await request.json();
        const validationError = validateInput(body);
        if (validationError) {
            return {
                status: 400,
                headers,
                body: JSON.stringify({ error: validationError })
            };
        }

        const { name, email, subject, message } = body;
        const clientIp = getClientIp(request);

        const container = await getCosmosContainer(context);

        const rateLimited = await checkRateLimit(container, clientIp, context);
        if (rateLimited) {
            return {
                status: 429,
                headers,
                body: JSON.stringify({
                    error: 'You have reached the maximum number of messages (2 per hour). Please try again later.'
                })
            };
        }

        await sendEmail(subject, name, email, message);

        await container.items.create({
            id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            clientIp,
            name,
            email,
            subject,
            submittedAt: new Date().toISOString(),
            type: 'contactSubmission'
        });

        context.log(`Contact email sent successfully from ${email}`);

        return {
            status: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Your message has been sent successfully!'
            })
        };

    } catch (error) {
        context.log.error('SendContactEmail error:', error);

        return {
            status: 500,
            headers,
            body: JSON.stringify({
                error: 'Something went wrong. Please try again later.'
            })
        };
    }
}

app.http('SendContactEmail', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'contact',
    handler: sendContactEmailHandler
});

module.exports = { sendContactEmailHandler };
