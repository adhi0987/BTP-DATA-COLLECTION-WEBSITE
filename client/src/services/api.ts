import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

export const createUser = (userData: { age: number, height: number, health_condition: string }) => {
    return axios.post(`${API_URL}/users`, userData);
};

export const sendControlCommand = (command: 'START' | 'STOP') => {
    return axios.post(`${API_URL}/control`, { command });
};

export const fetchUserData = (userId: string) => {
    return axios.get(`${API_URL}/data/export/${userId}`);
};

// NEW: Function to update the label of a specific data point
export const updateDataLabel = (dataId: number, label: string) => {
    return axios.put(`${API_URL}/data/${dataId}/label`, { label });
};