const DEFAULT_PST_SHEETS_WEB_APP_URL =
  process.env.PST_SHEETS_WEB_APP_URL ||
  'https://script.google.com/macros/s/AKfycbx9ovxC2Effj6P3IDo9DgZr65BDhDPbBFZVKqS96ydHFwh7BI49nenzn3S32zkNqXCJPQ/exec';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
};

function normalizeErrorMessage(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const payload =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : req.body && typeof req.body === 'object'
          ? req.body
          : {};

    const debugId = String(payload?.submissionDebugId || `pst-${Date.now()}`).trim();
    const targetUrl = String(DEFAULT_PST_SHEETS_WEB_APP_URL || '').trim();

    if (!targetUrl) {
      return res.status(500).json({
        ok: false,
        debugId,
        error: 'PST Google Sheets Web App URL is not configured',
      });
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        ...payload,
        submissionDebugId: debugId,
      }),
    });

    const rawText = await upstreamResponse.text();
    let parsed = null;

    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsed = null;
    }

    if (!upstreamResponse.ok) {
      return res.status(502).json({
        ok: false,
        debugId,
        error: `Apps Script HTTP ${upstreamResponse.status}`,
        upstream: rawText.slice(0, 500),
      });
    }

    if (!parsed || parsed.ok !== true) {
      return res.status(502).json({
        ok: false,
        debugId,
        error:
          normalizeErrorMessage(parsed?.error) ||
          normalizeErrorMessage(rawText) ||
          'Apps Script returned an invalid response',
      });
    }

    return res.status(200).json({
      ok: true,
      debugId,
      upstreamVersion: parsed.version || '',
    });
  } catch (error) {
    console.error('PST submit relay error:', error);
    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : 'Unexpected PST relay error',
    });
  }
}
