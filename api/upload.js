import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'ic-group-admin-secret-2026';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'tammat11';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'ICwebsite';
const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || 'main';

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

async function githubRequest(path, init = {}) {
    const headers = new Headers(init.headers || {});
    headers.set('Accept', 'application/vnd.github+json');
    headers.set('User-Agent', 'ic-group-admin');
    headers.set('Authorization', `Bearer ${GITHUB_TOKEN}`);

    return fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${path}`, {
        ...init,
        headers,
    });
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-File-Name');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!verifyAuth(req)) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: 'GITHUB_TOKEN не настроен на сервере' });
    }

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        const contentTypeHeader = req.headers['content-type'];
        const nameHeader = req.headers['x-file-name'];
        const contentType = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : (contentTypeHeader || 'image/jpeg');
        const originalNameRaw = Array.isArray(nameHeader) ? nameHeader[0] : (nameHeader || 'image.jpg');
        const originalName = decodeURIComponent(originalNameRaw);
        const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const ext = safeName.includes('.') ? safeName.split('.').pop() : 'jpg';
        const filename = `app/public/uploads/upload_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;

        const uploadRes = await githubRequest(`/contents/${filename}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `CMS: upload image ${safeName}`,
                branch: DEFAULT_BRANCH,
                content: body.toString('base64'),
            }),
        });

        if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            throw new Error(`GitHub upload failed (${uploadRes.status}): ${errorText}`);
        }

        const publicUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${DEFAULT_BRANCH}/${filename.replace(/^app\/public\//, '')}`;

        return res.status(200).json({ url: publicUrl, contentType });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Ошибка загрузки' });
    }
}
