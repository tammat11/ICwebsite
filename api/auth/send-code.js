import crypto from 'crypto';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_GROUP_ID = process.env.TG_GROUP_ID || '-5105161509';
const ALLOWED_PHONES = (process.env.ALLOWED_PHONES || process.env.ALLOWED_PHONE || '77070522006')
    .split(',')
    .map(phone => phone.replace(/\D/g, ''))
    .filter(Boolean);
const AUTH_SECRET = process.env.AUTH_SECRET || 'ic-group-admin-secret-2026';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { phone } = req.body;
        const cleanPhone = phone?.replace(/\D/g, '');

        if (!cleanPhone || !ALLOWED_PHONES.includes(cleanPhone)) {
            return res.status(403).json({ error: 'Номер не авторизован' });
        }

        // Generate 6-digit code
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Create signed token with the code
        const payload = JSON.stringify({ code, expires, phone: cleanPhone });
        const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
        const token = Buffer.from(payload).toString('base64') + '.' + signature;

        // Send code to Telegram group
        const message = `🔐 Код для входа в админ-панель IC Group:\n\n<b>${code}</b>\n\nДействителен 5 минут.`;

        if (!TG_BOT_TOKEN) {
            return res.status(500).json({ error: 'TG_BOT_TOKEN не настроен на сервере' });
        }

        await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_GROUP_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Send code error:', error);
        return res.status(500).json({ error: 'Ошибка отправки кода' });
    }
}
