import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'ic-group-admin-secret-2026';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'tammat11';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'ICwebsite';
const FILE_PATH = process.env.GITHUB_NEWS_FILE_PATH || 'app/src/data/news.json';
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

async function githubRequest(path, init = {}) {
    const headers = new Headers(init.headers || {});
    headers.set('Accept', 'application/vnd.github+json');
    headers.set('User-Agent', 'ic-group-admin');

    if (GITHUB_TOKEN) {
        headers.set('Authorization', `Bearer ${GITHUB_TOKEN}`);
    }

    return fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${path}`, {
        ...init,
        headers,
    });
}

async function getNewsData() {
    const res = await githubRequest(`/contents/${FILE_PATH}?ref=${DEFAULT_BRANCH}`);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GitHub GET failed (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf8');

    return {
        sha: data.sha,
        news: JSON.parse(content),
    };
}

async function saveNewsData(news, sha, message) {
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN не настроен на сервере');
    }

    const res = await githubRequest(`/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            branch: DEFAULT_BRANCH,
            sha,
            content: Buffer.from(JSON.stringify(news, null, 2), 'utf8').toString('base64'),
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GitHub PUT failed (${res.status}): ${errorText}`);
    }

    return res.json();
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const { news } = await getNewsData();
            return res.status(200).json(news);
        }

        if (!verifyAuth(req)) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        if (req.method === 'POST') {
            const { news, sha } = await getNewsData();
            const article = {
                id: crypto.randomUUID(),
                ...req.body,
            };
            const updatedNews = [article, ...news];

            await saveNewsData(updatedNews, sha, `CMS: create article ${article.id}`);
            return res.status(201).json(article);
        }

        if (req.method === 'PUT') {
            const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
            if (!id) return res.status(400).json({ error: 'ID обязателен' });

            const { news, sha } = await getNewsData();
            const index = news.findIndex(article => article.id === id);
            if (index === -1) return res.status(404).json({ error: 'Новость не найдена' });

            const updatedArticle = { ...news[index], ...req.body, id: news[index].id };
            const updatedNews = [...news];
            updatedNews[index] = updatedArticle;

            await saveNewsData(updatedNews, sha, `CMS: update article ${id}`);
            return res.status(200).json(updatedArticle);
        }

        if (req.method === 'DELETE') {
            const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
            if (!id) return res.status(400).json({ error: 'ID обязателен' });

            const { news, sha } = await getNewsData();
            const updatedNews = news.filter(article => article.id !== id);

            await saveNewsData(updatedNews, sha, `CMS: delete article ${id}`);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('News API error:', error);
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Ошибка сервера' });
    }
}
