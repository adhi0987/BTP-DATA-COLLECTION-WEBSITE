import React from 'react';
import { fetchUserData } from '../../services/api';

interface ExportProps {
    userId: string | null;
}

export const Export: React.FC<ExportProps> = ({ userId }) => {
    const handleDownloadCSV = async () => {
        if (!userId) return;
        try {
            const res = await fetchUserData(userId);
            const data = res.data.data;
            
            if(data.length === 0) {
                alert("No data collected yet. Please start collection first.");
                return;
            }

            // CSV Headers for 6-axis data
            const csvContent = "data:text/csv;charset=utf-8," 
                + "id,a_x,a_y,a_z,g_x,g_y,g_z,label,timestamp\n"
                + data.map((row: any) => 
                    `${row.id},${row.a_x},${row.a_y},${row.a_z},${row.g_x},${row.g_y},${row.g_z},${row.label},${row.timestamp}`
                  ).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `movement_data_${userId}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e) {
            console.error(e);
            alert("Failed to download CSV.");
        }
    };

    if (!userId) return null;

    return (
        <div style={{ padding: '20px', border: '1px solid #2196f3', borderRadius: '8px', backgroundColor: '#e3f2fd' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0d47a1'}}>Data Export</h3>
            <p style={{ fontSize: '14px', marginBottom: '15px', color: '#555' }}>
                Download the collected 6-axis accelerometer and gyroscope data.
            </p>
            <button 
                onClick={handleDownloadCSV}
                style={{ backgroundColor: '#1976d2', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold'}}
            >
                Download CSV Data
            </button>
        </div>
    );
};