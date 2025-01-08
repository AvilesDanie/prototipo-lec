import React, { useState, useEffect } from "react";
import EditorCodigo from "./components/EditorCodigo";
import Resultado from "./components/Resultado";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Button from "@mui/material/Button";
import "./App.css";

const App = () => {
  const [ejercicios, setEjercicios] = useState([]); // Lista de ejercicios
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null); // Ejercicio actual
  const [resultado, setResultado] = useState(""); // Resultado del código enviado

  const lenguajesPermitidos = ["python", "javascript", "java", "c", "c++"];

  // Obtener lista de ejercicios completados
  useEffect(() => {
    axios.get("http://localhost:4000/api/codewars/AvilesDanie/completed")
      .then((res) => {
        setEjercicios(res.data); // Guarda los ejercicios en el estado
      })
      .catch((err) => console.error(err));
  }, []);

  // Manejar selección de un ejercicio
  const seleccionarEjercicio = (id) => {
    axios.get(`http://localhost:4000/api/codewars/${id}`)
      .then((res) => {
        const lenguajesFiltrados = res.data.languages.filter((lang) =>
          lenguajesPermitidos.includes(lang.toLowerCase())
        );

        setEjercicioSeleccionado({
          titulo: res.data.name, // Nombre del ejercicio
          descripcion: res.data.description, // Descripción del ejercicio
          lenguajes: lenguajesFiltrados, // Lenguajes filtrados
        });
        setResultado(""); // Limpia el resultado anterior
      })
      .catch((err) => console.error(err));
  };

  // Manejar envío de código al backend
  const enviarCodigo = (codigo, lenguajeSeleccionado) => {
    console.log("Datos enviados:", { codigo, lenguaje: lenguajeSeleccionado });

    axios.post("http://localhost:4000/api/evaluar", {
      codigo,
      lenguaje: lenguajeSeleccionado, // Enviar el lenguaje seleccionado
    })
      .then((res) => setResultado(res.data.mensaje)) // Actualiza el resultado
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Aprende Programación</h1>
      {!ejercicioSeleccionado ? (
        <div>
          <h2>Lista de Ejercicios Completados</h2>
          {ejercicios.map((ejercicio) => (
            <Button
              key={ejercicio.id}
              variant="contained"
              color="primary"
              onClick={() => seleccionarEjercicio(ejercicio.id)}
              style={{ margin: "5px" }}
            >
              {ejercicio.name}
            </Button>
          ))}
        </div>
      ) : (
        <div>
          <h2>{ejercicioSeleccionado.titulo}</h2>
          {ejercicioSeleccionado.descripcion ? (
            <ReactMarkdown>{ejercicioSeleccionado.descripcion}</ReactMarkdown>
          ) : (
            <p>Descripción no disponible para este ejercicio.</p>
          )}
          <EditorCodigo
            onEnviar={enviarCodigo}
            lenguaje={ejercicioSeleccionado.lenguajes[0]}
            lenguajes={ejercicioSeleccionado.lenguajes}
          />
          <Resultado resultado={resultado} />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEjercicioSeleccionado(null)}
            style={{ marginTop: "10px" }}
          >
            Volver
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
