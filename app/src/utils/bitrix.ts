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
