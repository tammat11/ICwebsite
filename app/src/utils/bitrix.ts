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
        const fields: Record<string, string> = {
            'TITLE': data.title,
            'SOURCE_ID': 'WEB',
        };

        if (data.name) fields['NAME'] = data.name;
        if (data.lastName) fields['LAST_NAME'] = data.lastName;
        if (data.company) fields['COMPANY_TITLE'] = data.company;
        if (data.comments) fields['COMMENTS'] = data.comments;
        
        // Complex fields for phone and email
        if (data.phone) {
            fields['PHONE'] = [{ 'VALUE': data.phone, 'VALUE_TYPE': 'WORK' }] as any;
        }
        if (data.email) {
            fields['EMAIL'] = [{ 'VALUE': data.email, 'VALUE_TYPE': 'WORK' }] as any;
        }

        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.lead.add.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: fields,
                params: { "REGISTER_SONET_EVENT": "Y" }
            }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating Bitrix lead:', error);
        throw error;
    }
};
