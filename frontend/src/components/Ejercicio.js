import React from "react";

const Ejercicio = ({ ejercicio, onSeleccionar }) => {
  return (
    <div
      onClick={onSeleccionar}
      style={{ cursor: "pointer", marginBottom: "20px" }}
    >
      <h3>{ejercicio.name}</h3>
      <p>{ejercicio.description.substring(0, 100)}...</p>
    </div>
  );
};

export default Ejercicio;
