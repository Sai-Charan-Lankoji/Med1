import React from "react";

type CircularLetterProps = {
  letter: string;
};

const CircularLetter: React.FC<CircularLetterProps> = ({ letter }) => {
  const colors = [
    "#C0392B",
    "#1E8449",
    "#2C3E50",
    "#B7950B ",
    "#5B2C6F",
    "#A04000 ",
    "#1F618D",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const styles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: randomColor,
    color: "#FFF",
    fontWeight: "bold",
    fontSize: "10px",
    textAlign: "center",
  };

  return <div style={styles}>{letter}</div>;
};

export default CircularLetter;