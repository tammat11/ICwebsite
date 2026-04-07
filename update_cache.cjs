const fs = require('fs');
const https = require('https');

const BITRIX_WEBHOOK_URL = 'https://tootopbrass.bitrix24.kz/rest/281/6730mf4ivq497k0n/';
const LAT_FIELD_ID = 'UF_CRM_1732276400585';
const LNG_FIELD_ID = 'UF_CRM_1732276407859';

async function fetchDeals() {
    let allDeals = [];
    let start = 0;
    while (start < 1500) {
        const body = new URLSearchParams({
            'filter[CATEGORY_ID]': '69',
            'select[0]': 'ID',
            'select[1]': 'TITLE',
            'select[2]': LAT_FIELD_ID,
            'select[3]': LNG_FIELD_ID,
            'select[4]': 'COMPANY_ID',
            'select[5]': 'CONTACT_ID',
            'select[6]': 'ASSIGNED_BY_ID',
            'select[7]': 'UF_CRM_1707153439',
            'select[8]': 'UF_CRM_1743501476',
            'select[9]': 'UF_CRM_1742459776',
            'select[10]': 'UF_CRM_1743669674',
            'start': String(start)
        }).toString();
        
        const data = await new Promise((resolve) => {
            const req = https.request(BITRIX_WEBHOOK_URL + 'crm.deal.list.json', { method: 'POST' }, res => {
                let out = '';
                res.on('data', c => out += c);
                res.on('end', () => resolve(JSON.parse(out)));
            });
            req.write(body);
            req.end();
        });
        
        if (data.result && data.result.length > 0) {
            const processed = data.result.filter(d => d[LAT_FIELD_ID] && d[LNG_FIELD_ID]).map(d => ({
                 id: d.ID,
                 title: d.TITLE,
                 lat: parseFloat(d[LAT_FIELD_ID]),
                 lng: parseFloat(d[LNG_FIELD_ID]),
                 contactId: d.CONTACT_ID,
                 companyId: d.COMPANY_ID,
                 assignedById: d.ASSIGNED_BY_ID,
                 city: d.UF_CRM_1707153439 || '',
                 address: d.UF_CRM_1743501476 || '',
                 ipName: d.UF_CRM_1742459776 || '',
                 ipResp: d.UF_CRM_1743669674 || ''
            }));
            allDeals.push(...processed);
            if (data.next) start = data.next;
            else break;
        } else break;
    }
    fs.writeFileSync('app/src/data/objects_cache.json', JSON.stringify(allDeals, null, 2));
    console.log("CACHE UPDATED, LENGTH:", allDeals.length);
}
fetchDeals();
