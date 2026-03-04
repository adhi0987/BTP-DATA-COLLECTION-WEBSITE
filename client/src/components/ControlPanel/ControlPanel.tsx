import React, { useState } from 'react';
import { sendControlCommand } from '../../services/api';

interface ControlPanelProps {
    userId: string | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ userId }) => {
    const [isCollecting, setIsCollecting] = useState(false);

    const handleToggle = async () => {
        if (!userId) {
            alert("Please fill the user form first to initialize a session!");
            return;
        }
        
        const command = isCollecting ? 'STOP' : 'START';
        try {
            await sendControlCommand(command);
            setIsCollecting(!isCollecting);
        } catch(e) {
            console.error(e);
            alert("Failed to send command to smartwatch.");
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Smart Watch Control</h3>
            <button 
                onClick={handleToggle}
                style={{ 
                    backgroundColor: isCollecting ? '#d32f2f' : '#2e7d32', 
                    color: 'white', 
                    padding: '12px 24px', 
                    fontSize: '16px', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                {isCollecting ? 'STOP DATA COLLECTION' : 'START DATA COLLECTION'}
            </button>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                Status: {isCollecting ? 'Collecting Data...' : 'Idle'}
            </p>
        </div>
    );
};