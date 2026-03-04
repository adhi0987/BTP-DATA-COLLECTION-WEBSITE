import React, { useEffect, useState } from 'react';
import { fetchUserData, updateDataLabel } from '../../services/api';

interface DataTableProps {
    userId: string;
}

export const DataTable: React.FC<DataTableProps> = ({ userId }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchUserData(userId);
            setData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (userId) loadData();
    }, [userId]);

    const handleLabelChange = async (dataId: number, newLabel: string) => {
        try {
            await updateDataLabel(dataId, newLabel);
            // Update local state to reflect the change immediately
            setData(prevData => prevData.map(item => 
                item.id === dataId ? { ...item, label: newLabel } : item
            ));
        } catch (error) {
            console.error("Failed to update label", error);
            alert("Failed to update label");
        }
    };

    if (!userId) return null;

    return (
        <div style={{ marginTop: '30px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Data Tagging Table</h3>
                <button onClick={loadData} style={{ padding: '5px 15px', cursor: 'pointer' }}>Refresh Data</button>
            </div>
            
            {loading ? <p>Loading data...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>a_x</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>a_y</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>a_z</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>g_x</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>g_y</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>g_z</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Label / Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px' }}>{row.id}</td>
                                <td style={{ padding: '8px' }}>{row.a_x.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{row.a_y.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{row.a_z.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{row.g_x.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{row.g_y.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{row.g_z.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>
                                    <select 
                                        value={row.label} 
                                        onChange={(e) => handleLabelChange(row.id, e.target.value)}
                                        style={{ padding: '4px' }}
                                    >
                                        <option value="untagged">Untagged</option>
                                        <option value="walking">Walking</option>
                                        <option value="running">Running</option>
                                        <option value="resting">Resting</option>
                                        <option value="falling">Falling</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {data.length === 0 && !loading && <p>No data recorded yet. Start collection to see data here.</p>}
        </div>
    );
};