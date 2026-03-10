import crypto from 'crypto';
import { put } from '@vercel/blob';

const AUTH_SECRET = process.env.AUTH_SECRET || 'ic-group-admin-secret-2026';

function verifyAuth(req) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return false;
    const token = auth.slice(7);
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return false;
    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
    if (signature !== expectedSig) return false;
    const data = JSON.parse(payload);
    return data.exp > Date.now() && data.role === 'admin';
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!verifyAuth(req)) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    try {
        // Read raw body
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        const contentType = req.headers['content-type'] || 'image/jpeg';
        const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
        const filename = `news-images/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;

        const blob = await put(filename, body, {
            access: 'public',
            contentType,
        });

        return res.status(200).json({ url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Ошибка загрузки' });
    }
}
