import crypto from 'crypto';
import { list, put, del } from '@vercel/blob';

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

async function getNewsData() {
    try {
        const { blobs } = await list({ prefix: 'news-data' });
        if (blobs.length === 0) return [];
        const response = await fetch(blobs[0].url);
        return await response.json();
    } catch {
        return [];
    }
}

async function saveNewsData(data) {
    // Delete old blob
    try {
        const { blobs } = await list({ prefix: 'news-data' });
        for (const blob of blobs) {
            await del(blob.url);
        }
    } catch { /* ignore */ }

    await put('news-data.json', JSON.stringify(data), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
    });
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        const news = await getNewsData();
        return res.status(200).json(news);
    }

    // All write operations require auth
    if (!verifyAuth(req)) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    if (req.method === 'POST') {
        const news = await getNewsData();
        const article = {
            id: crypto.randomUUID(),
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        news.unshift(article); // add to beginning
        await saveNewsData(news);
        return res.status(201).json(article);
    }

    if (req.method === 'PUT') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'ID обязателен' });
        const news = await getNewsData();
        const index = news.findIndex(a => a.id === id);
        if (index === -1) return res.status(404).json({ error: 'Новость не найдена' });
        news[index] = { ...news[index], ...req.body, updatedAt: new Date().toISOString() };
        await saveNewsData(news);
        return res.status(200).json(news[index]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'ID обязателен' });
        let news = await getNewsData();
        news = news.filter(a => a.id !== id);
        await saveNewsData(news);
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
