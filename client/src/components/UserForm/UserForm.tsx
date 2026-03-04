import React, { useState } from 'react';
import { createUser } from '../../services/api';

interface UserFormProps {
    onUserCreated: (id: string) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
    const [formData, setFormData] = useState({ age: '', height: '', health_condition: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createUser({
                age: Number(formData.age),
                height: Number(formData.height),
                health_condition: formData.health_condition
            });
            onUserCreated(res.data.id);
            alert("User saved! You can now start data collection.");
        } catch (error) {
            console.error(error);
            alert("Failed to save user.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Sample Information</h3>
            <div>
                <label>Age:</label><br/>
                <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} style={{ width: '100%' }} />
            </div>
            <div>
                <label>Height (cm):</label><br/>
                <input type="number" required value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} style={{ width: '100%' }} />
            </div>
            <div>
                <label>Health Conditions:</label><br/>
                <input type="text" placeholder="e.g., none" value={formData.health_condition} onChange={e => setFormData({...formData, health_condition: e.target.value})} style={{ width: '100%' }} />
            </div>
            <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Save & Initialize</button>
        </form>
    );
};