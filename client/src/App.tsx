import { useState } from 'react';
import { UserForm } from './components/UserForm/UserForm';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { DataTable } from './components/DataTable/DataTable';
import { Export } from './components/Export/Export';
import './App.css';

function App() {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>BTP Data Collection Dashboard</h1>
        <p className="subtitle">Smart Watch Movement Data Collection System</p>
      </header>
      
      <div className="dashboard-container">
        <div className="dashboard-top-row">
          <div className="form-section">
            <UserForm onUserCreated={setActiveUserId} />
          </div>
          <div className="control-section">
            <ControlPanel userId={activeUserId} />
            <Export userId={activeUserId} />
          </div>
        </div>
        
        {activeUserId && <DataTable userId={activeUserId} />}
      </div>
    </div>
  );
}

export default App;

