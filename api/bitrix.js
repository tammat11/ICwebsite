const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;

const DEAL_FUNNEL_ID = 111;
const DEAL_STAGE_ID = 'C111:PREPARATION';
const TENDER_ENTITY_TYPE_ID = 1372;
const TENDER_CATEGORY_ID = 435;
const TENDER_STAGE_ID = 'DT1372_435:CLIENT';

const TENDER_PRIMARY_FIELDS = [
    'id',
    'title',
    'createdTime',
    'updatedTime',
    'movedTime',
    'stageId',
    'categoryId',
    'assignedById',
    'ufCrm177_1771917018289',
    'ufCrm177_1771917047522',
    'ufCrm177_1771917249406',
    'ufCrm177_1771917265826',
    'ufCrm177_1771917306044',
    'ufCrm177_1771917325836',
    'ufCrm177_1771917352221',
    'ufCrm177_1771917404692',
    'ufCrm177_1771918963486',
    'ufCrm177_1771918990965',
    'ufCrm177_1771919098033',
    'ufCrm177_1771919122183',
    'ufCrm177_1771919156204',
    'ufCrm177_1771919180690',
    'ufCrm177_1771919201639',
    'ufCrm177_1771919276245',
    'ufCrm177_1773311202331',
    'ufCrm177_1773311265963',
    'ufCrm177_1773311436361',
    'ufCrm177_1773311543646',
    'ufCrm177_1773381811',
    'ufCrm177_1773382125293',
    'ufCrm177_1773382341973',
    'ufCrm177_1773383415952',
    'ufCrm177_1773398517150',
];

const TENDER_FIELD_LABELS = {
    id: 'ID',
    title: 'Название',
    createdTime: 'Создано',
    updatedTime: 'Обновлено',
    movedTime: 'Перемещено на стадию',
    stageId: 'Стадия',
    categoryId: 'Воронка',
    assignedById: 'Ответственный',
    ufCrm177_1771917018289: 'Портал закупок',
    ufCrm177_1771917047522: '№ объявления',
    ufCrm177_1771917249406: 'Заказчик',
    ufCrm177_1771917265826: 'Приоритет',
    ufCrm177_1771917306044: 'Наименование закупки',
    ufCrm177_1771917325836: 'Дополнительная характеристика',
    ufCrm177_1771917352221: 'Срок окончания обсуждения',
    ufCrm177_1771917404692: 'Срок окончания приема заявок',
    ufCrm177_1771918963486: 'Сумма без НДС',
    ufCrm177_1771918990965: 'Стоимость в месяц без НДС',
    ufCrm177_1771919098033: 'Дата начала оказания услуг',
    ufCrm177_1771919122183: 'Дата конца оказания услуг',
    ufCrm177_1771919156204: 'Место оказания услуг',
    ufCrm177_1771919180690: 'Краткая техническая спецификация',
    ufCrm177_1771919201639: 'Примечание',
    ufCrm177_1771919276245: 'Участвуем/Не участвуем',
    ufCrm177_1773311202331: 'Объем оказанных услуг',
    ufCrm177_1773311265963: 'Квалификационная сложность',
    ufCrm177_1773311436361: 'Скидка в %',
    ufCrm177_1773311543646: 'Ответственный с IC Line',
    ufCrm177_1773381811: 'Ответственный IC LINE',
    ufCrm177_1773382125293: 'Конкурсная документация',
    ufCrm177_1773382341973: 'Ссылка на договора b2g',
    ufCrm177_1773383415952: 'Причина не участия',
    ufCrm177_1773398517150: 'Дата начала оказания услуг*',
};

function getWebhookUrl() {
    if (!BITRIX_WEBHOOK_URL) {
        throw new Error('BITRIX_WEBHOOK_URL не настроен на сервере');
    }

    return BITRIX_WEBHOOK_URL.endsWith('/') ? BITRIX_WEBHOOK_URL : `${BITRIX_WEBHOOK_URL}/`;
}

async function bitrixRequest(endpoint, { method = 'POST', headers, body, query } = {}) {
    const webhookUrl = getWebhookUrl();
    const url = new URL(`${webhookUrl}${endpoint}`);

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
    }

    const response = await fetch(url, {
        method,
        headers,
        body,
    });

    const result = await response.json();

    if (!response.ok || result.error) {
        throw new Error(result.error_description || result.error || `Bitrix request failed: ${endpoint}`);
    }

    return result;
}

async function createContact(data) {
    const params = new URLSearchParams();
    params.append('fields[NAME]', data.name || 'Клиент');
    if (data.lastName) params.append('fields[LAST_NAME]', data.lastName);
    if (data.company) params.append('fields[COMPANY_TITLE]', data.company);
    if (data.comments) params.append('fields[COMMENTS]', data.comments);

    if (data.phone) {
        params.append('fields[PHONE][0][VALUE]', data.phone);
        params.append('fields[PHONE][0][VALUE_TYPE]', 'WORK');
    }
    if (data.email) {
        params.append('fields[EMAIL][0][VALUE]', data.email);
        params.append('fields[EMAIL][0][VALUE_TYPE]', 'WORK');
    }

    const result = await bitrixRequest('crm.contact.add.json', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    return result.result ?? null;
}

async function handleCreateBitrixLead(data) {
    const contactId = await createContact(data);
    const params = new URLSearchParams();

    params.append('fields[TITLE]', data.title);
    params.append('fields[CATEGORY_ID]', String(DEAL_FUNNEL_ID));
    params.append('fields[STAGE_ID]', DEAL_STAGE_ID);
    if (data.comments) params.append('fields[COMMENTS]', data.comments);
    if (contactId) params.append('fields[CONTACT_ID]', String(contactId));

    if (data.extraFields) {
        Object.entries(data.extraFields).forEach(([key, value]) => {
            params.append(`fields[${key}]`, String(value));
        });
    }

    return bitrixRequest('crm.deal.add.json', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });
}

async function handleCreateHrCandidate(data) {
    const params = new URLSearchParams();
    params.append('entityTypeId', '1232');
    params.append('fields[title]', `Анкета кандидата: ${data.firstName} ${data.lastName}`);
    params.append('fields[categoryId]', '369');
    params.append('fields[stageId]', 'DT1232_369:NEW');
    params.append('fields[ufCrm119_1763461461473]', data.firstName);
    params.append('fields[ufCrm119_1763461467290]', data.lastName);
    params.append('fields[ufCrm119_1763461482839]', data.phone);

    if (Array.isArray(data.resumeFiles) && data.resumeFiles.length > 0) {
        data.resumeFiles.forEach((file, index) => {
            params.append(`fields[ufCrm119_1763461489623][${index}][fileData][0]`, file.name);
            params.append(`fields[ufCrm119_1763461489623][${index}][fileData][1]`, file.content);
        });
    }

    return bitrixRequest('crm.item.add.json', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });
}

async function handleUpdateSanitaryStats(score, curatorName) {
    const ENTITY_TYPE_ID = 1254;
    const CATEGORY_ID = 311;
    const MONTH_FIELD = 'ufCrm127_1756290422310';
    const COUNT_FIELD = 'ufCrm127_1756291224885';
    const TOTAL_FIELD = 'ufCrm_LKJSAND12';
    const AVG_FIELD = 'ufCrm_KASJD12';
    const CURATOR_FIELD = 'ufCrm127_1762769620';

    const searchVariations = [
        { title: curatorName, month: '05' },
        { title: ` ${curatorName}`, month: '05' },
        { title: curatorName, month: '' },
        { title: ` ${curatorName}`, month: '' },
    ];

    let targetItem = null;

    for (const variant of searchVariations) {
        const listParams = new URLSearchParams();
        listParams.append('entityTypeId', String(ENTITY_TYPE_ID));
        listParams.append('filter[title]', variant.title);
        listParams.append(`filter[${MONTH_FIELD}]`, variant.month);
        listParams.append('filter[categoryId]', String(CATEGORY_ID));

        const listData = await bitrixRequest('crm.item.list.json', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: listParams.toString(),
        });

        if (listData.result?.items?.length > 0) {
            targetItem = listData.result.items[0];
            break;
        }
    }

    if (targetItem) {
        const currentCount = parseInt(targetItem[COUNT_FIELD], 10) || 0;
        const currentTotal = parseFloat(targetItem[TOTAL_FIELD]) || 0;
        const newCount = currentCount + 1;
        const newTotal = currentTotal + score;
        const newAvg = newTotal / newCount;

        const updateParams = new URLSearchParams();
        updateParams.append('entityTypeId', String(ENTITY_TYPE_ID));
        updateParams.append('id', targetItem.id);
        updateParams.append(`fields[${COUNT_FIELD}]`, String(newCount));
        updateParams.append(`fields[${TOTAL_FIELD}]`, String(newTotal));
        updateParams.append(`fields[${AVG_FIELD}]`, String(newAvg.toFixed(2)));
        updateParams.append(`fields[${CURATOR_FIELD}]`, curatorName);

        if (!targetItem[MONTH_FIELD]) {
            updateParams.append(`fields[${MONTH_FIELD}]`, '05');
        }

        return bitrixRequest('crm.item.update.json', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: updateParams.toString(),
        });
    }

    const addParams = new URLSearchParams();
    addParams.append('entityTypeId', String(ENTITY_TYPE_ID));
    addParams.append('fields[title]', curatorName);
    addParams.append('fields[categoryId]', String(CATEGORY_ID));
    addParams.append(`fields[${MONTH_FIELD}]`, '05');
    addParams.append(`fields[${COUNT_FIELD}]`, '1');
    addParams.append(`fields[${TOTAL_FIELD}]`, String(score));
    addParams.append(`fields[${AVG_FIELD}]`, String(score.toFixed(2)));
    addParams.append(`fields[${CURATOR_FIELD}]`, curatorName);

    return bitrixRequest('crm.item.add.json', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: addParams.toString(),
    });
}

async function handleCreateDailyReportItem(data) {
    const fields = {
        title: data.title,
        categoryId: '445',
        ufCrm105_1775651155077: data.clientName || '',
        ...(data.assignedById ? { assignedById: data.assignedById } : {}),
        ...(data.contactId ? { contactId: data.contactId } : {}),
        ...(data.companyId ? { companyId: data.companyId } : {}),
        ...(data.extraFields || {}),
    };

    if (Array.isArray(data.files) && data.files.length > 0) {
        fields.ufCrm105_1775650024571 = data.files;
    }

    return bitrixRequest('crm.item.add.json', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            entityTypeId: '1204',
            fields,
        }),
    });
}

async function handleCreateRemarkDeal(data) {
    const fields = {
        TITLE: `ЗАМЕЧАНИЕ (${data.objectTitle}): ${data.date}`,
        CATEGORY_ID: '81',
        STAGE_ID: 'C81:PREPARATION',
        COMPANY_ID: data.companyId || '',
        CONTACT_ID: data.contactId || '',
        ASSIGNED_BY_ID: data.assignedById || '',
        COMMENTS: data.comments,
        UF_CRM_1707153439: data.city || '',
        UF_CRM_1743501476: data.address || '',
        UF_CRM_1742459776: data.ipName || '',
        UF_CRM_1743669674: data.ipResp || '',
        UF_CRM_1716804677915: '43437',
        UF_CRM_1719824872888: '43735',
        UF_CRM_1723523640792: '44881',
    };

    if (Array.isArray(data.files) && data.files.length > 0) {
        fields.UF_CRM_1716804439763 = data.files;
    }

    return bitrixRequest('crm.deal.add.json', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
    });
}

async function handleUpdateObjectCoordinates(dealId, lat, lng) {
    const LAT_FIELD_ID = 'UF_CRM_1732276400585';
    const LNG_FIELD_ID = 'UF_CRM_1732276407859';
    const params = new URLSearchParams();

    params.append('id', String(dealId));
    params.append(`fields[${LAT_FIELD_ID}]`, String(lat));
    params.append(`fields[${LNG_FIELD_ID}]`, String(lng));

    return bitrixRequest('crm.deal.update.json', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });
}

async function handleGetAllDealsWithCoords(startDate, endDate) {
    let allDeals = [];
    let start = 0;
    let hasNext = true;

    const LAT_FIELD_ID = 'UF_CRM_1732276400585';
    const LNG_FIELD_ID = 'UF_CRM_1732276407859';
    const filterParams = { CATEGORY_ID: '69' };

    if (startDate) filterParams['>=DATE_CREATE'] = `${startDate}T00:00:00`;
    if (endDate) filterParams['<=DATE_CREATE'] = `${endDate}T23:59:59`;

    while (hasNext && allDeals.length < 2500) {
        const bodyObj = {
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
            'select[11]': 'DATE_CREATE',
            'order[ID]': 'DESC',
            start: String(start),
            ...Object.fromEntries(Object.entries(filterParams).map(([key, value]) => [`filter[${key}]`, value])),
        };

        const result = await bitrixRequest('crm.deal.list.json', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(bodyObj).toString(),
        });

        if (result.result?.length > 0) {
            const processed = result.result
                .filter(d => d[LAT_FIELD_ID] && d[LNG_FIELD_ID])
                .map(d => ({
                    id: d.ID,
                    title: d.TITLE,
                    lat: parseFloat(d[LAT_FIELD_ID]),
                    lng: parseFloat(d[LNG_FIELD_ID]),
                    contactId: d.CONTACT_ID,
                    companyId: d.COMPANY_ID,
                    assignedById: d.ASSIGNED_BY_ID,
                    dateCreate: d.DATE_CREATE,
                    city: d.UF_CRM_1707153439,
                    address: d.UF_CRM_1743501476,
                    ipName: d.UF_CRM_1742459776,
                    ipResp: d.UF_CRM_1743669674,
                }));

            allDeals = [...allDeals, ...processed];
            start = result.next || 0;
            hasNext = Boolean(result.next);
        } else {
            hasNext = false;
        }
    }

    return allDeals;
}

async function handleGetAllDeals(startDate, endDate) {
    let allDeals = [];
    let start = 0;
    let hasNext = true;

    const LAT_FIELD_ID = 'UF_CRM_1732276400585';
    const LNG_FIELD_ID = 'UF_CRM_1732276407859';
    const filterParams = { CATEGORY_ID: '69' };

    if (startDate) filterParams['>=DATE_CREATE'] = `${startDate}T00:00:00`;
    if (endDate) filterParams['<=DATE_CREATE'] = `${endDate}T23:59:59`;

    while (hasNext && allDeals.length < 2500) {
        const bodyObj = {
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
            'select[11]': 'DATE_CREATE',
            'order[ID]': 'DESC',
            start: String(start),
            ...Object.fromEntries(Object.entries(filterParams).map(([key, value]) => [`filter[${key}]`, value])),
        };

        const result = await bitrixRequest('crm.deal.list.json', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(bodyObj).toString(),
        });

        if (result.result?.length > 0) {
            const processed = result.result.map(d => ({
                id: d.ID,
                title: d.TITLE,
                lat: d[LAT_FIELD_ID] ? parseFloat(d[LAT_FIELD_ID]) : null,
                lng: d[LNG_FIELD_ID] ? parseFloat(d[LNG_FIELD_ID]) : null,
                contactId: d.CONTACT_ID,
                companyId: d.COMPANY_ID,
                assignedById: d.ASSIGNED_BY_ID,
                dateCreate: d.DATE_CREATE,
                city: d.UF_CRM_1707153439,
                address: d.UF_CRM_1743501476,
                ipName: d.UF_CRM_1742459776,
                ipResp: d.UF_CRM_1743669674,
            }));

            allDeals = [...allDeals, ...processed];
            start = result.next || 0;
            hasNext = Boolean(result.next);
        } else {
            hasNext = false;
        }
    }

    return allDeals;
}

function hasTenderValue(value) {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
}

function normalizeTenderValue(value) {
    if (Array.isArray(value)) {
        return value.map(item => {
            if (item && typeof item === 'object' && ('url' in item || 'urlMachine' in item)) {
                return {
                    id: item.id,
                    url: item.url,
                    name: item.name || item.originalName || `Файл ${item.id || ''}`.trim(),
                };
            }

            return item;
        });
    }

    return value;
}

function mapTenderItem(item) {
    const fields = TENDER_PRIMARY_FIELDS
        .filter(key => hasTenderValue(item[key]))
        .map(key => ({
            key,
            label: TENDER_FIELD_LABELS[key] || key,
            value: normalizeTenderValue(item[key]),
        }));

    return {
        id: item.id,
        title: item.title || `Тендер #${item.id}`,
        bitrixUrl: `https://tootopbrass.bitrix24.kz/crm/type/${TENDER_ENTITY_TYPE_ID}/details/${item.id}/`,
        stageId: item.stageId,
        createdTime: item.createdTime,
        updatedTime: item.updatedTime,
        deadline: item.ufCrm177_1771917404692,
        customer: item.ufCrm177_1771917249406,
        announcementNumber: item.ufCrm177_1771917047522,
        purchaseName: item.ufCrm177_1771917306044,
        location: item.ufCrm177_1771919156204,
        amount: item.ufCrm177_1771918963486,
        note: item.ufCrm177_1771919201639,
        fields,
    };
}

async function handleGetTenderApplications() {
    let allItems = [];
    let start = 0;
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < 20 && allItems.length < 1000) {
        const data = await bitrixRequest('crm.item.list.json', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                entityTypeId: TENDER_ENTITY_TYPE_ID,
                filter: {
                    categoryId: TENDER_CATEGORY_ID,
                    stageId: TENDER_STAGE_ID,
                },
                select: TENDER_PRIMARY_FIELDS,
                order: { id: 'DESC' },
                start,
            }),
        });

        if (data.result?.items?.length > 0) {
            allItems = [...allItems, ...data.result.items];
            if (data.next && data.result.items.length >= 50) {
                start = data.next;
                pageCount += 1;
            } else {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }

    return {
        entityTypeId: TENDER_ENTITY_TYPE_ID,
        categoryId: TENDER_CATEGORY_ID,
        stageId: TENDER_STAGE_ID,
        items: allItems.map(mapTenderItem),
    };
}

async function handleGetTenderApplication(id) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
        throw new Error('Некорректный ID тендера');
    }

    const data = await bitrixRequest('crm.item.get.json', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            entityTypeId: TENDER_ENTITY_TYPE_ID,
            id: numericId,
        }),
    });

    if (!data.result?.item) {
        throw new Error('Тендер не найден');
    }

    return mapTenderItem(data.result.item);
}

async function handleUpdateTenderStage(id, stageId, extraFields = {}) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
        throw new Error('Некорректный ID тендера');
    }

    const data = await bitrixRequest('crm.item.update.json', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            entityTypeId: TENDER_ENTITY_TYPE_ID,
            id: numericId,
            fields: { stageId, ...extraFields },
        }),
    });

    return { ok: true, result: data.result };
}

async function handleGetDailyReports(entityTypeId = 1204, categoryId = 445, startDate, endDate) {
    let allItems = [];
    let start = 0;
    let hasMore = true;
    let pageCount = 0;

    const filter = { categoryId: String(categoryId) };
    if (startDate) filter['>=createdTime'] = `${startDate}T00:00:00+03:00`;
    if (endDate) filter['<=createdTime'] = `${endDate}T23:59:59+03:00`;

    while (hasMore && pageCount < 50) {
        const data = await bitrixRequest('crm.item.list.json', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                entityTypeId,
                filter,
                select: [
                    'id', 'assignedById', 'createdTime', 'categoryId',
                    'UF_CRM_105_1753336038', 'UF_CRM_105_1753784383',
                    'UF_CRM_265_1753336038', 'UF_CRM_265_1753784383',
                    'UF_CRM_105_1775650060', 'UF_CRM_105_1775650055',
                    'UF_CRM_265_1775650060', 'UF_CRM_265_1775650055',
                ],
                start,
            }),
        });

        if (data.result?.items) {
            allItems = [...allItems, ...data.result.items];
            if (data.next && data.result.items.length >= 50) {
                start = data.next;
                pageCount += 1;
            } else {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }

    return allItems;
}

async function handleGetBitrixUsers() {
    let allUsers = [];
    let start = 0;
    let hasMore = true;

    while (hasMore) {
        const data = await bitrixRequest('user.get.json', {
            method: 'GET',
            query: { start },
        });

        if (data.result) {
            allUsers = [...allUsers, ...data.result];
            if (data.next) {
                start = data.next;
            } else {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }

    const usersMap = {};
    allUsers.forEach(user => {
        usersMap[String(user.ID)] = `${user.NAME} ${user.LAST_NAME || ''}`.trim();
    });

    return usersMap;
}

const actionHandlers = {
    createBitrixLead: async payload => handleCreateBitrixLead(payload.data),
    createHrCandidate: async payload => handleCreateHrCandidate(payload.data),
    updateSanitaryStats: async payload => handleUpdateSanitaryStats(payload.score, payload.curatorName),
    createDailyReportItem: async payload => handleCreateDailyReportItem(payload.data),
    createRemarkDeal: async payload => handleCreateRemarkDeal(payload.data),
    updateObjectCoordinates: async payload => handleUpdateObjectCoordinates(payload.dealId, payload.lat, payload.lng),
    getAllDealsWithCoords: async payload => handleGetAllDealsWithCoords(payload.startDate, payload.endDate),
    getAllDeals: async payload => handleGetAllDeals(payload.startDate, payload.endDate),
    getTenderApplications: async () => handleGetTenderApplications(),
    getTenderApplication: async payload => handleGetTenderApplication(payload.id),
    getDailyReports: async payload => handleGetDailyReports(payload.entityTypeId, payload.categoryId, payload.startDate, payload.endDate),
    getBitrixUsers: async () => handleGetBitrixUsers(),
    updateTenderStage: async payload => handleUpdateTenderStage(payload.id, payload.stageId, payload.extraFields),
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { action, payload = {} } = req.body || {};
        const actionHandler = actionHandlers[action];

        if (!actionHandler) {
            return res.status(400).json({ error: 'Unsupported Bitrix action' });
        }

        const result = await actionHandler(payload);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Bitrix proxy error:', error);
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Bitrix proxy error' });
    }
}
