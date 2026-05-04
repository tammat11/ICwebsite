const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    const { entityTypeId, itemId, fieldName, fileId } = req.body || {};

    if (!entityTypeId || !itemId || !fieldName || !fileId) {
        return res.status(400).json({ error: 'Missing params' });
    }

    if (!BITRIX_WEBHOOK_URL) {
        return res.status(500).json({ error: 'Webhook not configured' });
    }

    const base = BITRIX_WEBHOOK_URL.endsWith('/') ? BITRIX_WEBHOOK_URL : `${BITRIX_WEBHOOK_URL}/`;
    const url = `${base}crm.controller.item.getFile/?entityTypeId=${entityTypeId}&id=${itemId}&fieldName=${fieldName}&fileId=${fileId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: `Upstream ${response.status}` });
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const contentDisposition = response.headers.get('content-disposition') || '';

        res.setHeader('Content-Type', contentType);
        if (contentDisposition) res.setHeader('Content-Disposition', contentDisposition);

        const buffer = Buffer.from(await response.arrayBuffer());
        res.status(200).send(buffer);
    } catch (err) {
        console.error('[file-proxy] error:', err.message);
        res.status(500).json({ error: err.message });
    }
}
