import React from "react";

const Resultado = ({ resultado }) => {
  return (
    <div>
      <h3>Resultado:</h3>
      <pre>{resultado}</pre>
    </div>
  );
};

export default Resultado;
