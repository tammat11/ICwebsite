import objectsCache from '../data/objects_cache.json';

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

const postBitrixAction = async <T>(action: string, payload: Record<string, unknown>) => {
    const response = await fetch('/api/bitrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || `Bitrix proxy error (${response.status})`);
    }

    return result as T;
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

export const createBitrixLead = async (data: LeadData) =>
    postBitrixAction('createBitrixLead', { data });

export const createHrCandidate = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    resumeFile?: File;
    resumeFiles?: { name: string; content: string }[];
}) => {
    const resumeFiles = [...(data.resumeFiles || [])];

    if (data.resumeFile) {
        resumeFiles.push({
            name: data.resumeFile.name,
            content: await fileToBase64(data.resumeFile),
        });
    }

    return postBitrixAction('createHrCandidate', {
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            resumeFiles,
        },
    });
};

export const updateSanitaryStats = async (score: number, curatorName: string) =>
    postBitrixAction('updateSanitaryStats', { score, curatorName });

export const createDailyReportItem = async (data: LeadData) => {
    const files = data.files
        ? await Promise.all(data.files.map(async file => ({
            name: file.name,
            content: await fileToBase64(file),
        })))
        : [];

    return postBitrixAction('createDailyReportItem', {
        data: {
            ...data,
            files,
        },
    });
};

export const createRemarkDeal = async (data: any) => {
    const files = data.files
        ? await Promise.all(data.files.map(async (file: File) => ({
            name: file.name,
            content: await fileToBase64(file),
        })))
        : [];

    return postBitrixAction('createRemarkDeal', {
        data: {
            ...data,
            files,
        },
    });
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const getNearestDeal = async (userLat: number, userLng: number) => {
    try {
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
                    extraFields: deal.extraFields,
                });
            }
        });

        const filteredDeals = deals.filter(d => d.distance <= 0.7);
        return filteredDeals.sort((a, b) => a.distance - b.distance).slice(0, 50);
    } catch (error) {
        console.error('Error finding nearest deal from cache:', error);
        return null;
    }
};

export const getAllDealsWithCoords = async (startDate?: string, endDate?: string) =>
    postBitrixAction('getAllDealsWithCoords', { startDate, endDate });

export const getDailyReports = async (entityTypeId = 1204, categoryId = 445, startDate?: string, endDate?: string) =>
    postBitrixAction('getDailyReports', { entityTypeId, categoryId, startDate, endDate });

export const getBitrixUsers = async () =>
    postBitrixAction('getBitrixUsers', {});

export default {
    createBitrixLead,
    createHrCandidate,
    createDailyReportItem,
    getNearestDeal,
    getAllDealsWithCoords,
    getDailyReports,
    getBitrixUsers,
};
