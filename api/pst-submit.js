const DEFAULT_PST_SHEETS_WEB_APP_URL =
  process.env.PST_SHEETS_WEB_APP_URL ||
  'https://script.google.com/macros/s/AKfycbxM_Nfc07nXoHWK2jD8Ubhj19bJd-52_-O0n5aRZMT69tEHLoA45EfpyxVZxoNJ2-HQqg/exec';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

function normalizeErrorMessage(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function readJsonResponse(response) {
  const rawText = await response.text();
  let parsed = null;

  try {
    parsed = rawText ? JSON.parse(rawText) : null;
  } catch {
    parsed = null;
  }

  return { rawText, parsed };
}

async function fetchUpstreamStatus(targetUrl, debugId) {
  if (!debugId) {
    return null;
  }

  const statusUrl = new URL(targetUrl);
  statusUrl.searchParams.set('action', 'status');
  statusUrl.searchParams.set('debugId', debugId);

  const response = await fetch(statusUrl.toString(), {
    method: 'GET',
  });
  const { parsed } = await readJsonResponse(response);

  if (!response.ok || !parsed || parsed.ok !== true) {
    return null;
  }

  return parsed;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = String(DEFAULT_PST_SHEETS_WEB_APP_URL || '').trim();

  if (!targetUrl) {
    return res.status(500).json({
      ok: false,
      error: 'PST Google Sheets Web App URL is not configured',
    });
  }

  if (req.method === 'GET') {
    const debugId = String(req.query?.debugId || '').trim();
    if (!debugId) {
      return res.status(400).json({ ok: false, error: 'debugId is required' });
    }

    try {
      const status = await fetchUpstreamStatus(targetUrl, debugId);
      if (!status) {
        return res.status(404).json({ ok: false, error: 'Submission status not found', debugId });
      }

      return res.status(200).json({
        ok: true,
        debugId,
        status,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        debugId,
        error: error instanceof Error ? error.message : 'Failed to read submission status',
      });
    }
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

    const { rawText, parsed } = await readJsonResponse(upstreamResponse);

    const action = String(payload?.action || '').trim();

    if (!upstreamResponse.ok) {
      const upstreamStatus = await fetchUpstreamStatus(targetUrl, debugId).catch(() => null);
      if ((action === 'finalize' || !action) && upstreamStatus?.saved === true) {
        return res.status(200).json({
          ok: true,
          saved: true,
          recoveredFromStatusCheck: true,
          debugId,
          historyRow: Number(upstreamStatus.historyRow || 0),
          objectRow: Number(upstreamStatus.objectRow || 0),
          upstreamVersion: upstreamStatus.version || '',
        });
      }

      return res.status(502).json({
        ok: false,
        debugId,
        error: `Apps Script HTTP ${upstreamResponse.status}`,
        upstream: rawText.slice(0, 500),
      });
    }

    if (!parsed || parsed.ok !== true) {
      const upstreamStatus = await fetchUpstreamStatus(targetUrl, debugId).catch(() => null);
      if ((action === 'finalize' || !action) && upstreamStatus?.saved === true) {
        return res.status(200).json({
          ok: true,
          saved: true,
          recoveredFromStatusCheck: true,
          debugId,
          historyRow: Number(upstreamStatus.historyRow || 0),
          objectRow: Number(upstreamStatus.objectRow || 0),
          upstreamVersion: upstreamStatus.version || '',
        });
      }

      return res.status(502).json({
        ok: false,
        debugId,
        error:
          normalizeErrorMessage(parsed?.error) ||
          normalizeErrorMessage(rawText) ||
          'Apps Script returned an invalid response',
      });
    }

    if (action && action !== 'finalize') {
      return res.status(200).json({
        ok: true,
        ...parsed,
      });
    }

    const saved = parsed.saved === true;
    const historyRow = Number(parsed.historyRow || 0);
    const objectRow = Number(parsed.objectRow || 0);

    if (!saved || historyRow <= 0 || objectRow <= 0) {
      return res.status(502).json({
        ok: false,
        debugId,
        error:
          'Google Sheets did not confirm that the record was written. Please retry after the table confirms the entry.',
        upstream: parsed,
      });
    }

    return res.status(200).json({
      ok: true,
      saved: true,
      debugId,
      historyRow,
      objectRow,
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
