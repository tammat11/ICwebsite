const BITRIX_WEBHOOK_URL = 'https://tootopbrass.bitrix24.kz/rest/281/6730mf4ivq497k0n/';

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

export const createBitrixLead = async (data: LeadData) => {
    try {
        const params = new URLSearchParams();
        params.append('fields[TITLE]', data.title);
        params.append('fields[SOURCE_ID]', 'WEB');

        if (data.name) params.append('fields[NAME]', data.name);
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

        params.append('params[REGISTER_SONET_EVENT]', 'Y');

        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.lead.add.json`, {
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
        console.error('Error creating Bitrix lead:', error);
        throw error;
    }
};
