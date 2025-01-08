import React, { useState } from "react";

const EditorCodigo = ({ onEnviar, lenguaje, lenguajes }) => {
  const [codigo, setCodigo] = useState("");
  const [lenguajeSeleccionado, setLenguajeSeleccionado] = useState(lenguaje);

  const manejarEnvio = () => {
    onEnviar(codigo, lenguajeSeleccionado); // Enviar ambos parámetros correctamente
  };

  return (
    <div>
      <select
        value={lenguajeSeleccionado}
        onChange={(e) => setLenguajeSeleccionado(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      >
        {lenguajes.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <textarea
        rows="10"
        cols="50"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder={`Escribe tu código en ${lenguajeSeleccionado}...`}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button onClick={manejarEnvio}>Enviar Código</button>
    </div>
  );
};

export default EditorCodigo;
