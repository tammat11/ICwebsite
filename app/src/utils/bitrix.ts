import objectsCache from '../data/objects_cache.json';
const BITRIX_WEBHOOK_URL = 'https://tootopbrass.bitrix24.kz/rest/281/6730mf4ivq497k0n/';


/** Воронка 111, стадия "Лиды (от маркетинга)" — при необходимости уточните STAGE_ID в настройках CRM */
const DEAL_FUNNEL_ID = 111;
const DEAL_STAGE_ID = 'C111:PREPARATION'; // Стадия "Лиды (от маркетинга)"

export interface LeadData {
    title: string;
    name?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    company?: string;
    comments?: string;
    source?: string;
    assignedById?: string | number;
    contactId?: string | number;
    companyId?: string | number;
    extraFields?: Record<string, string | number | boolean>;
    files?: File[];
}


async function createContact(data: LeadData): Promise<number | null> {
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

    const res = await fetch(`${BITRIX_WEBHOOK_URL}crm.contact.add.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });
    const json = await res.json();
    if (json.error) {
        console.error('Bitrix Contact Error:', json.error_description || json.error);
        return null;
    }
    return json.result ?? null;
}

export const createBitrixLead = async (data: LeadData) => {
    try {
        const contactId = await createContact(data);
        const params = new URLSearchParams();

        params.append('fields[TITLE]', data.title);
        params.append('fields[CATEGORY_ID]', String(DEAL_FUNNEL_ID));
        params.append('fields[STAGE_ID]', DEAL_STAGE_ID);
        if (data.comments) params.append('fields[COMMENTS]', data.comments);
        if (contactId) params.append('fields[CONTACT_ID]', String(contactId));

        // Add custom fields
        if (data.extraFields) {
            Object.entries(data.extraFields).forEach(([key, value]) => {
                params.append(`fields[${key}]`, String(value));
            });
        }

        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.add.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        const result = await response.json();
        console.log('Bitrix Response:', result);
        if (result.error) {
            console.error('Bitrix Error:', result.error_description || result.error);
        }
        return result;
    } catch (error) {
        console.error('Error creating Bitrix deal:', error);
        throw error;
    }
};

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;
            if (typeof result !== 'string') {
                reject(new Error('Failed to read file as base64'));
                return;
            }

            const [, base64 = ''] = result.split(',');
            resolve(base64);
        };

        reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

export const createHrCandidate = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    resumeFile?: File;
    resumeFiles?: { name: string; content: string }[];
}) => {
    try {
        const params = new URLSearchParams();
        params.append('entityTypeId', '1232');
        params.append('fields[title]', `Анкета кандидата: ${data.firstName} ${data.lastName}`);
        params.append('fields[categoryId]', '369');
        params.append('fields[stageId]', 'DT1232_369:NEW');
        
        // Маппинг полей
        params.append('fields[ufCrm119_1763461461473]', data.firstName);
        params.append('fields[ufCrm119_1763461467290]', data.lastName);
        params.append('fields[ufCrm119_1763461482839]', data.phone);

        // Обработка одного файла (для совместимости)
        if (data.resumeFile) {
            const base64 = await fileToBase64(data.resumeFile);
            params.append('fields[ufCrm119_1763461489623][fileData][0]', data.resumeFile.name);
            params.append('fields[ufCrm119_1763461489623][fileData][1]', base64);
        }

        // Обработка нескольких файлов (если переданы уже в base64)
        if (data.resumeFiles && data.resumeFiles.length > 0) {
            data.resumeFiles.forEach((file, index) => {
                params.append(`fields[ufCrm119_1763461489623][${index}][fileData][0]`, file.name);
                params.append(`fields[ufCrm119_1763461489623][${index}][fileData][1]`, file.content);
            });
        }

        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.add.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const result = await response.json();
        console.log('Bitrix HR candidate response:', result);

        if (result.error) {
            console.error('Bitrix HR candidate error:', result.error_description || result.error);
            throw new Error(result.error_description || result.error);
        }

        return result;
    } catch (error) {
        console.error('Error creating Bitrix HR candidate item:', error);
        throw error;
    }
};
export const updateSanitaryStats = async (score: number, curatorName: string) => {
    try {
        const ENTITY_TYPE_ID = 1254;
        const CATEGORY_ID = 311;
        const MONTH_FIELD = 'ufCrm127_1756290422310'; // Номер месяца
        const COUNT_FIELD = 'ufCrm127_1756291224885'; // Количество пройденных
        const TOTAL_FIELD = 'ufCrm_LKJSAND12';       // Общая сумма
        const AVG_FIELD = 'ufCrm_KASJD12';           // Средняя сумма
        const CURATOR_FIELD = 'ufCrm127_1762769620';  // Поле куратора

        // 1. Поиск записи. Пробуем найти с точным именем или с ведущим пробелом (бывает в базе)
        // И приоритезируем месяц "03", но если нет - берем пустой
        const searchVariations = [
            { title: curatorName, month: '03' },
            { title: ' ' + curatorName, month: '03' },
            { title: curatorName, month: '' },
            { title: ' ' + curatorName, month: '' }
        ];

        let targetItem = null;

        for (const variant of searchVariations) {
            const listParams = new URLSearchParams();
            listParams.append('entityTypeId', String(ENTITY_TYPE_ID));
            listParams.append('filter[title]', variant.title);
            listParams.append('filter[' + MONTH_FIELD + ']', variant.month);
            listParams.append('filter[categoryId]', String(CATEGORY_ID));

            const listRes = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.list.json`, {
                method: 'POST',
                body: listParams
            });
            const listData = await listRes.json();

            if (listData.result && listData.result.items && listData.result.items.length > 0) {
                targetItem = listData.result.items[0];
                break;
            }
        }

        if (targetItem) {
            const currentCount = parseInt(targetItem[COUNT_FIELD]) || 0;
            const currentTotal = parseFloat(targetItem[TOTAL_FIELD]) || 0;

            const newCount = currentCount + 1;
            const newTotal = currentTotal + score;
            const newAvg = newTotal / newCount;

            // Обновление существующей записи
            const updateParams = new URLSearchParams();
            updateParams.append('entityTypeId', String(ENTITY_TYPE_ID));
            updateParams.append('id', targetItem.id);
            updateParams.append('fields[' + COUNT_FIELD + ']', String(newCount));
            updateParams.append('fields[' + TOTAL_FIELD + ']', String(newTotal));
            updateParams.append('fields[' + AVG_FIELD + ']', String(newAvg.toFixed(2)));
            updateParams.append('fields[' + CURATOR_FIELD + ']', curatorName);
            // Если месяц был пустым - устанавливаем 03
            if (!targetItem[MONTH_FIELD]) {
                updateParams.append('fields[' + MONTH_FIELD + ']', '03');
            }

            const updateRes = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.update.json`, {
                method: 'POST',
                body: updateParams
            });
            return await updateRes.json();
        } else {
            // Если запись вообще не найдена - создаем новую для этого куратора на март
            console.log(`Creating new record for ${curatorName} for month 03`);
            const addParams = new URLSearchParams();
            addParams.append('entityTypeId', String(ENTITY_TYPE_ID));
            addParams.append('fields[title]', curatorName);
            addParams.append('fields[categoryId]', String(CATEGORY_ID));
            addParams.append('fields[' + MONTH_FIELD + ']', '03');
            addParams.append('fields[' + COUNT_FIELD + ']', '1');
            addParams.append('fields[' + TOTAL_FIELD + ']', String(score));
            addParams.append('fields[' + AVG_FIELD + ']', String(score.toFixed(2)));
            addParams.append('fields[' + CURATOR_FIELD + ']', curatorName);

            const addRes = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.add.json`, {
                method: 'POST',
                body: addParams
            });
            return await addRes.json();
        }
    } catch (error) {
        console.error('Error updating sanitary stats in Bitrix:', error);
        throw error;
    }
};

export const createDailyReportItem = async (data: LeadData) => {
    try {
        const params = new URLSearchParams();

        params.append('entityTypeId', '1204');
        params.append('fields[title]', data.title);
        params.append('fields[categoryId]', '445');
        
        if (data.assignedById) params.append('fields[assignedById]', String(data.assignedById));
        if (data.contactId) params.append('fields[contactId]', String(data.contactId));
        if (data.companyId) params.append('fields[companyId]', String(data.companyId));
        
        // Добавление пользовательских полей
        if (data.extraFields) {
            Object.entries(data.extraFields).forEach(([key, value]) => {
                params.append(`fields[${key}]`, String(value));
            });
        }

        // Добавление фотографий (преобразование в base64 и маппинг)
        if (data.files && data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                const base64 = await fileToBase64(data.files[i]);
                // Мы используем поле UF_CRM_105_1775650024571 для фото. 
                // В Битриксе множественные поля файлов передаются как массив индексов.
                params.append(`fields[UF_CRM_105_1775650024571][${i}][fileData][0]`, data.files[i].name);
                params.append(`fields[UF_CRM_105_1775650024571][${i}][fileData][1]`, base64);
            }
        }

        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.add.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const result = await response.json();
        console.log('Bitrix SPA Response:', result);
        if (result.error) {
            console.error('Bitrix SPA Error:', result.error_description || result.error);
        }
        return result;
    } catch (error) {
        console.error('Error creating Bitrix SPA item:', error);
        throw error;
    }
};

export const createRemarkDeal = async (data: any) => {
    try {
        const params = new URLSearchParams();
        params.append('fields[TITLE]', `ЗАМЕЧАНИЕ (${data.objectTitle}): ${data.date}`);
        params.append('fields[CATEGORY_ID]', '81');
        params.append('fields[STAGE_ID]', 'C81:PREPARATION'); // Отработка Партнера
        params.append('fields[COMPANY_ID]', data.companyId || '');
        params.append('fields[CONTACT_ID]', data.contactId || '');
        params.append('fields[ASSIGNED_BY_ID]', data.assignedById || '');
        
        // Маппинг данных объекта
        params.append('fields[UF_CRM_1707153439]', data.city || ''); // Город
        params.append('fields[UF_CRM_1743501476]', data.address || ''); // Адрес объекта инфо
        params.append('fields[UF_CRM_1742459776]', data.ipName || ''); // Наименование ИП инфо
        params.append('fields[UF_CRM_1743669674]', data.ipResp || ''); // Ответственное лицо ИП инфо
        
        // Источник, Тип и Вид уборки
        params.append('fields[UF_CRM_1716804677915]', '43437'); // Качество уборки
        params.append('fields[UF_CRM_1719824872888]', '43735'); // От аккаунта замечание исходящее
        params.append('fields[UF_CRM_1723523640792]', '44881'); // Базовая уборка
        
        // Текст замечаний
        params.append('fields[COMMENTS]', data.comments);
        
        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.add.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });
        
        const result = await response.json();
        console.log('Remark Deal created:', result);
        return result;
    } catch (error) {
        console.error('Error creating Remark Deal:', error);
        throw error;
    }
};

// Function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

export const getNearestDeal = async (userLat: number, userLng: number) => {
    try {
        // Мы теперь используем локальную базу (objects_cache.json)
        // Это мгновенно и не нагружает сеть.
        const deals: any[] = [];
        
        objectsCache.forEach((deal: any) => {
            if (deal.lat && deal.lng) {
                const dist = calculateDistance(userLat, userLng, deal.lat, deal.lng);
                deals.push({
                    id: deal.id,
                    title: deal.title,
                    distance: dist,
                    assignedById: deal.assignedById,
                    contactId: deal.contactId,
                    companyId: deal.companyId,
                    city: deal.city,
                    address: deal.address,
                    ipName: deal.ipName,
                    ipResp: deal.ipResp,
                    extraFields: deal.extraFields
                });
            }
        });

        // Сортируем по дистанции и отдаем самые близкие (радиус 700м отсечем для чистоты)
        const filteredDeals = deals.filter(d => d.distance <= 0.7);
        return filteredDeals.sort((a, b) => a.distance - b.distance).slice(0, 50);
    } catch (error) {
        console.error('Error finding nearest deal from cache:', error);
        return null;
    }
};

export const getAllDealsWithCoords = async () => {
    try {
        let allDeals: any[] = [];
        let start = 0;
        let hasNext = true;

        const LAT_FIELD_ID = 'UF_CRM_1732276400585';
        const LNG_FIELD_ID = 'UF_CRM_1732276407859';

        while (hasNext && allDeals.length < 1500) { // Ограничим 1500 для безопасности
            const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.list.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'filter[CATEGORY_ID]': '69',
                    'select[0]': 'ID',
                    'select[1]': 'TITLE',
                    'select[2]': LAT_FIELD_ID,
                    'select[3]': LNG_FIELD_ID,
                    'select[4]': 'COMPANY_ID',
                    'select[5]': 'CONTACT_ID',
                    'select[6]': 'ASSIGNED_BY_ID',
                    'select[7]': 'UF_CRM_1707153439', // Город
                    'select[8]': 'UF_CRM_1743501476', // Адрес объекта инфо
                    'select[9]': 'UF_CRM_1742459776', // Наименование ИП инфо
                    'select[10]': 'UF_CRM_1743669674', // Ответственное лицо ИП инфо
                    'start': String(start)
                }).toString()
            });

            const result = await response.json();
            if (result.result && result.result.length > 0) {
                const processed = result.result
                    .filter((d: any) => d[LAT_FIELD_ID] && d[LNG_FIELD_ID])
                    .map((d: any) => ({
                        id: d.ID,
                        title: d.TITLE,
                        lat: parseFloat(d[LAT_FIELD_ID]),
                        lng: parseFloat(d[LNG_FIELD_ID]),
                        contactId: d.CONTACT_ID,
                        companyId: d.COMPANY_ID,
                        assignedById: d.ASSIGNED_BY_ID,
                        city: d.UF_CRM_1707153439,
                        address: d.UF_CRM_1743501476,
                        ipName: d.UF_CRM_1742459776,
                        ipResp: d.UF_CRM_1743669674
                    }));
                
                allDeals = [...allDeals, ...processed];
                
                if (result.next) {
                    start = result.next;
                } else {
                    hasNext = false;
                }
            } else {
                hasNext = false;
            }
        }

        return allDeals;
    } catch (error) {
        console.error('Error fetching all deals for map:', error);
        return [];
    }
};

export default { createBitrixLead, createHrCandidate, createDailyReportItem, getNearestDeal, getAllDealsWithCoords };
