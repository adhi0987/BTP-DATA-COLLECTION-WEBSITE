import React, { useState } from 'react';
import { createUser } from '../../services/api';
import '../../App.css';

export const UserForm = ({ onUserCreated }: { onUserCreated: (id: string) => void }) => {
    const [formData, setFormData] = useState({ age: '', height: '', health_condition: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-card fade-in">
            <h3 className="section-title">1. Subject Information</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input 
                        id="age"
                        type="number" 
                        placeholder="Enter age" 
                        required 
                        value={formData.age} 
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="form-input"
                        min="1"
                        max="150"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="height">Height (cm)</label>
                    <input 
                        id="height"
                        type="number" 
                        placeholder="Enter height in cm" 
                        required 
                        value={formData.height} 
                        onChange={e => setFormData({...formData, height: e.target.value})}
                        className="form-input"
                        min="1"
                        max="300"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="health_condition">Health Conditions (Optional)</label>
                    <input 
                        id="health_condition"
                        type="text" 
                        placeholder="e.g., None, Diabetes, Hypertension" 
                        value={formData.health_condition} 
                        onChange={e => setFormData({...formData, health_condition: e.target.value})}
                        className="form-input"
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save & Initialize'}
                </button>
            </form>
        </div>
    );
};

