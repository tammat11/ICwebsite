const BITRIX_WEBHOOK_URL = 'https://tootopbrass.bitrix24.kz/rest/281/6730mf4ivq497k0n/';

async function checkDealDateFormat() {
    try {
        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.list.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'filter[CATEGORY_ID]': '69',
                'select[0]': 'ID',
                'select[1]': 'DATE_CREATE',
                'order[ID]': 'DESC',
                'start': '0'
            }).toString()
        });
        
        const data = await response.json();
        if (data.result && data.result.length > 0) {
            console.log("Raw DATE_CREATE from Bitrix:", data.result[0].DATE_CREATE);
            console.log("Type of DATE_CREATE:", typeof data.result[0].DATE_CREATE);
        } else {
            console.log("No deals found");
        }
    } catch (e) {
        console.error(e);
    }
}

checkDealDateFormat();
