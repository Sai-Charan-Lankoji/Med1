import React from "react";

// Recursive component to render JSON data with colors
const JsonViewer = ({ data }: { data: any }) => {
  const renderValue = (value: any) => {
    if (value === null) {
      return <span style={{ color: "red" }}>null</span>;
    } else if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <div style={{ marginLeft: 20 }}>
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <span style={{ color: "blue" }}>{key}:</span>{" "}
              {renderValue(val)}
            </div>
          ))}
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div style={{ marginLeft: 20 }}>
          {value.map((item, index) => (
            <div key={index}>
              {renderValue(item)}
            </div>
          ))}
        </div>
      );
    } else {
      return <span style={{ color: "green" }}>{JSON.stringify(value)}</span>;
    }
  };

  return <pre>{renderValue(data)}</pre>;
};
