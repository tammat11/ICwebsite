import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'ic-group-admin-secret-2026';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code, token } = req.body;

        if (!code || !token) {
            return res.status(400).json({ error: 'Код и токен обязательны' });
        }

        // Verify the token
        const [payloadB64, signature] = token.split('.');
        const payload = Buffer.from(payloadB64, 'base64').toString();
        const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

        if (signature !== expectedSig) {
            return res.status(403).json({ error: 'Неверный токен' });
        }

        const data = JSON.parse(payload);

        if (Date.now() > data.expires) {
            return res.status(403).json({ error: 'Код истёк, запросите новый' });
        }

        if (data.code !== code) {
            return res.status(403).json({ error: 'Неверный код' });
        }

        // Generate session token (valid 24 hours)
        const sessionPayload = JSON.stringify({
            phone: data.phone,
            role: 'admin',
            exp: Date.now() + 24 * 60 * 60 * 1000
        });
        const sessionSig = crypto.createHmac('sha256', AUTH_SECRET).update(sessionPayload).digest('hex');
        const sessionToken = Buffer.from(sessionPayload).toString('base64') + '.' + sessionSig;

        return res.status(200).json({ success: true, sessionToken });
    } catch (error) {
        console.error('Verify error:', error);
        return res.status(500).json({ error: 'Ошибка верификации' });
    }
}
