const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;

async function debugKarinaCalls() {
    if (!BITRIX_WEBHOOK_URL) {
        throw new Error('Set BITRIX_WEBHOOK_URL before running this scratch script');
    }

    const karinaId = 1093;
    console.log(`Checking items for Karina (ID: ${karinaId}) in SPA 1364...`);

    try {
        const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.item.list.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                entityTypeId: 1364,
                filter: {
                    assignedById: karinaId,
                },
                select: ['id', 'assignedById', 'createdBy', 'createdTime', 'categoryId', 'title'],
            }),
        });

        const data = await response.json();
        const items = data.result.items || [];

        console.log(`\nTotal items assigned to Karina: ${items.length}`);

        items.forEach((item, i) => {
            console.log(`${i + 1}. [ID: ${item.id}] Title: ${item.title} | Category: ${item.categoryId} | Created: ${item.createdTime}`);
        });

        const inTargetCategory = items.filter(i => String(i.categoryId) === '431');
        console.log(`\nItems in Category 431: ${inTargetCategory.length}`);
    } catch (e) {
        console.error('Error:', e);
    }
}

debugKarinaCalls();
