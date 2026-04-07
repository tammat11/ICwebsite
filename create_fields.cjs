const https = require('https');
const WEBHOOK_PATH = '/rest/281/6730mf4ivq497k0n/';
const HOST = 'tootopbrass.bitrix24.kz';

const fields = [
    { key: 'feedbackSpeed', label: 'Скорость обратной связи куратора' },
    { key: 'improvementSuggestions', label: 'Вас устраивает качество сервиса?' },
    { key: 'curatorScore', label: 'Оцените работу куратора' },
    { key: 'suppliesQuality', label: 'Сроки и качество моющих средств/РМ' },
    { key: 'opuUniform', label: 'ОПУ в форме?' },
    { key: 'uniformCondition', label: 'Состояние формы' },
    { key: 'equipmentCondition', label: 'Инвентарь, оборудование, техника' },
    { key: 'hardFloorQuality', label: 'Качество уборки твердых покрытий' },
    { key: 'glassMirrorQuality', label: 'Уборка стекол и зеркал' },
    { key: 'fittingRoomsQuality', label: 'Примерочные, освещение' },
    { key: 'cleaningRoomCondition', label: 'Помещение клининга' },
    { key: 'restroomCondition', label: 'Состояние санузлов' },
    { key: 'softFurnitureCondition', label: 'Мягкая мебель и ковровые покрытия' },
    { key: 'objectComment', label: 'Общий комментарий к отчету' }
];

function callApi(method, data) {
    return new Promise((resolve) => {
        const payload = JSON.stringify(data);
        const req = https.request({
            hostname: HOST,
            path: WEBHOOK_PATH + method,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(body)); }
                catch(e) { resolve({error: 'Parse error', body}); }
            });
        });
        req.write(payload);
        req.end();
    });
}

async function start() {
    const mapping = {};
    console.log('--- CREATING USER FIELDS FOR CRM_105 ---');
    for (const f of fields) {
        const res = await callApi('crm.userfield.add', {
            fields: {
                ENTITY_ID: 'CRM_105',
                FIELD_NAME: 'AUDIT_' + f.key.toUpperCase().substring(0, 14),
                USER_TYPE_ID: 'string',
                EDIT_FORM_LABEL: { 'ru': f.label },
                LIST_COLUMN_LABEL: { 'ru': f.label }
            }
        });
        if (res.result) {
           mapping[f.key] = 'ufCrm105_' + res.result;
           console.log(`${f.label} -> Successfully created!`);
        } else {
           console.log(`${f.label} Error:`, res.error_description || res.error);
        }
    }
    console.log('--- FINAL MAPPING ---');
    console.log(JSON.stringify(mapping, null, 2));
}
start();
