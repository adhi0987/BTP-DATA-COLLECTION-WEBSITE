import React, { useState } from "react";
import { sendControlCommand } from "../../services/api";
import "../../App.css";

export const ControlPanel = ({ userId }: { userId: string | null }) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!userId) return alert("Please fill the user form first!");

    setIsLoading(true);
    const command = isCollecting ? "STOP" : "START";
    try {
      await sendControlCommand(command);
      setIsCollecting(!isCollecting);
    } catch (e) {
      alert("Failed to send command.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="control-card fade-in">
      <h3 className="section-title">2. Smart Watch Control</h3>
      <button
        onClick={handleToggle}
        className={`btn-submit ${isCollecting ? "btn-danger" : "btn-success"}`}
        disabled={isLoading || !userId}
        style={!userId ? { backgroundColor: "#999" } : undefined}
      >
        {isLoading
          ? "Processing..."
          : isCollecting
            ? "⏹ STOP DATA COLLECTION"
            : "▶ START DATA COLLECTION"}
      </button>
      <div className="control-status">
        <span
          className={`status-indicator ${isCollecting ? "active" : ""}`}
        ></span>
        <span>
          {isCollecting
            ? "Data collection in progress..."
            : "Ready to start collection"}
        </span>
      </div>
    </div>
  );
};
