import React, { useState } from 'react';
import { UserForm } from '../components/UserForm/UserForm';
import { ControlPanel } from '../components/ControlPanel/ControlPanel';
import { DataTable } from '../components/DataTable/DataTable';
import { Export } from '../components/Export/Export';

export const Dashboard: React.FC = () => {
    const [activeUserId, setActiveUserId] = useState<string | null>(null);

    return (
        <div className="dashboard-container">
            <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
                BTP Data Collection Dashboard
            </h1>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Left Column: Form */}
                <div style={{ flex: '1 1 300px' }}>
                    <UserForm onUserCreated={setActiveUserId} />
                </div>
                
                {/* Right Column: Controls and Export */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <ControlPanel userId={activeUserId} />
                    <Export userId={activeUserId} />
                </div>
            </div>

            {/* Bottom Row: Data Table for Tagging */}
            {activeUserId && (
                <div style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                    <DataTable userId={activeUserId} />
                </div>
            )}
        </div>
    );
};