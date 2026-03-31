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
export const updateSanitaryStats = async (score: number, curator: string) => {
    try {
        const ENTITY_TYPE_ID = 1254;
        const CATEGORY_ID = 311;
        const MONTH_FIELD = 'ufCrm127_1756290422310'; // Номер месяца
        const COUNT_FIELD = 'ufCrm127_1756291224885'; // Количество пройденных
        const TOTAL_FIELD = 'ufCrm_LKJSAND12';       // Общая сумма
        const AVG_FIELD = 'ufCrm_KASJD12';           // Средняя сумма
        const CURATOR_FIELD = 'ufCrm_1762769620';    // Поле куратора

        // 1. Поиск записи для месяца "03"
        const listParams = new URLSearchParams();
        listParams.append('entityTypeId', String(ENTITY_TYPE_ID));
        listParams.append('filter[' + MONTH_FIELD + ']', '03');
        listParams.append('filter[categoryId]', String(CATEGORY_ID));

        const listRes = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.list.json`, {
            method: 'POST',
            body: listParams
        });
        const listData = await listRes.json();

        if (listData.result && listData.result.items && listData.result.items.length > 0) {
            const item = listData.result.items[0];
            const currentCount = parseInt(item[COUNT_FIELD]) || 0;
            const currentTotal = parseFloat(item[TOTAL_FIELD]) || 0;

            const newCount = currentCount + 1;
            const newTotal = currentTotal + score;
            const newAvg = newTotal / newCount;

            // 2. Обновление записи
            const updateParams = new URLSearchParams();
            updateParams.append('entityTypeId', String(ENTITY_TYPE_ID));
            updateParams.append('id', item.id);
            updateParams.append('fields[' + COUNT_FIELD + ']', String(newCount));
            updateParams.append('fields[' + TOTAL_FIELD + ']', String(newTotal));
            updateParams.append('fields[' + AVG_FIELD + ']', String(newAvg.toFixed(2)));
            updateParams.append('fields[' + CURATOR_FIELD + ']', curator);

            const updateRes = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.update.json`, {
                method: 'POST',
                body: updateParams
            });
            return await updateRes.json();
        } else {
            console.warn('Record for month 03 not found in Bitrix24');
            return null;
        }
    } catch (error) {
        console.error('Error updating sanitary stats in Bitrix:', error);
        throw error;
    }
};
