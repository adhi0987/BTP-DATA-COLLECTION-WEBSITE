import React, { useState } from 'react';
import { fetchUserData } from '../../services/api';
import '../../App.css';

export const Export = ({ userId }: { userId: string | null }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadCSV = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const res = await fetchUserData(userId);
            const data = res.data.data;
            if(data.length === 0) return alert("No data collected yet.");

            const csvContent = "data:text/csv;charset=utf-8," 
                + "id,a_x,a_y,a_z,g_x,g_y,g_z,label,timestamp\n"
                + data.map((row: any) => `${row.id},${row.a_x},${row.a_y},${row.a_z},${row.g_x},${row.g_y},${row.g_z},${row.label},${row.timestamp}`).join("\n");
            
            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", `movement_data_${userId}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            alert("Failed to download CSV.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!userId) return null;
    
    return (
        <div className="export-card fade-in">
            <h3 className="section-title">3. Export</h3>
            <button 
                onClick={handleDownloadCSV} 
                className="btn-export"
                disabled={isLoading}
            >
                {isLoading ? 'Preparing...' : '📥 Download CSV Data'}
            </button>
            <p className="export-info">
                Export all collected movement data as a CSV file for analysis.
            </p>
        </div>
    );
};

