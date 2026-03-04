import { useState, useCallback } from 'react';
import { fetchUserData } from '../services/api';

export const useDataFetch = (userId: string | null) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetchUserData(userId);
            setData(res.data.data);
        } catch (err: any) {
            console.error("Failed to fetch data", err);
            setError(err.message || "An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    return { data, setData, loading, error, loadData };
};