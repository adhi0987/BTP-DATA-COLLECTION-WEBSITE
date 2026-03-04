import React, { useEffect, useState } from "react";
import { fetchUserData, updateDataLabel } from "../../services/api";
import "../../App.css";

interface DataRow {
  id: number;
  a_x: number;
  a_y: number;
  a_z: number;
  g_x: number;
  g_y: number;
  g_z: number;
  label: string;
  timestamp: string;
}

export const DataTable = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchUserData(userId);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const handleLabelChange = async (dataId: number, newLabel: string) => {
    try {
      await updateDataLabel(dataId, newLabel);
      setData((prevData) =>
        prevData.map((item) =>
          item.id === dataId ? { ...item, label: newLabel } : item,
        ),
      );
    } catch (error) {
      alert("Failed to update label");
    }
  };

  if (!userId) return null;

  return (
    <div className="data-section fade-in">
      <div className="data-header">
        <h3 className="section-title">4. Data Tagging</h3>
        <button onClick={loadData} className="btn-refresh" disabled={isLoading}>
          {isLoading ? "⟳ Loading..." : "⟳ Refresh Data"}
        </button>
      </div>

      {isLoading && data.length === 0 ? (
        <div className="loading">Loading data...</div>
      ) : data.length === 0 ? (
        <div className="no-data card">
          <p>
            No data collected yet. Start the data collection to see results
            here.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>a_x</th>
                <th>a_y</th>
                <th>a_z</th>
                <th>g_x</th>
                <th>g_y</th>
                <th>g_z</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.a_x.toFixed(3)}</td>
                  <td>{row.a_y.toFixed(3)}</td>
                  <td>{row.a_z.toFixed(3)}</td>
                  <td>{row.g_x.toFixed(3)}</td>
                  <td>{row.g_y.toFixed(3)}</td>
                  <td>{row.g_z.toFixed(3)}</td>
                  <td>
                    <select
                      value={row.label}
                      onChange={(e) =>
                        handleLabelChange(row.id, e.target.value)
                      }
                      className="label-select"
                    >
                      <option value="untagged">Untagged</option>
                      <option value="walking">Walking</option>
                      <option value="running">Running</option>
                      <option value="falling">Falling</option>
                      <option value="sitting">Sitting</option>
                      <option value="standing">Standing</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length > 0 && (
        <p style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
          Total records: {data.length}
        </p>
      )}
    </div>
  );
};
