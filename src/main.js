import preguntas from './preguntas.json';

let preguntaSeleccionada = [];
let indicePregunta = 0;
let numPregunta = 1;
let incorrectas = 0;

function empezarQuiz(tema) {
  document.getElementById('pantallaPrincipal').style.display = 'none';
  document.getElementById('contenedorPreguntas').style.display = 'grid';
  console.log("Tema seleccionado:", tema);
  preguntas_categoria(tema);
}
window.empezarQuiz = empezarQuiz;

function preguntas_categoria(tema) {
  preguntaSeleccionada = preguntas[tema];
  indicePregunta = 0;
  numPregunta = 1;
  mostrarPregunta();
}

function mostrarPregunta() {
  const pregunta = preguntaSeleccionada[indicePregunta];
  if (!pregunta) {
    handleEndGame();
    return;
  }

  document.getElementById('numeroPregunta').textContent = `Pregunta ${numPregunta} de ${preguntaSeleccionada.length}`;
  document.getElementById('pregunta').textContent = pregunta.pregunta;
  document.getElementById('opcionUnoLabel').textContent = pregunta.opcionA;
  document.getElementById('opcionDosLabel').textContent = pregunta.opcionB;
  document.getElementById('opcionTresLabel').textContent = pregunta.opcionC;
  document.getElementById('opcionCuatroLabel').textContent = pregunta.opcionD;

  // Limpiar selección previa
  document.querySelectorAll('input[name="opcion"]').forEach(input => input.checked = false);
  // Reset color de fondo
  resetOptionBackground();
}

function revisarPregunta() {
  const pregunta = preguntaSeleccionada[indicePregunta];
  const respuestaCorrecta = pregunta.respuesta;
  const opciones = document.getElementsByName("opcion");

  const seleccionada = Array.from(opciones).find(op => op.checked);
  if (!seleccionada) {
    alert("Selecciona una opción antes de continuar.");
    return false; // No avanzar aún
  }

  const esCorrecta = seleccionada.value === respuestaCorrecta;
  const idLabelSeleccionada = seleccionada.labels[0].id;
  const idLabelCorrecta = Array.from(opciones).find(op => op.value === respuestaCorrecta).labels[0].id;

  if (esCorrecta) {
    document.getElementById(idLabelCorrecta).style.backgroundColor = "green";
  } else {
    document.getElementById(idLabelSeleccionada).style.backgroundColor = "red";
    document.getElementById(idLabelCorrecta).style.backgroundColor = "green";
    incorrectas++;
  }

  return true;
}

function siguientePregunta() {
  const puedeContinuar = revisarPregunta();
  if (!puedeContinuar) return;

  setTimeout(() => {
    indicePregunta++;
    numPregunta++;
    mostrarPregunta();
  }, 1000);
}

function resetOptionBackground() {
  const opciones = document.getElementsByName("opcion");
  opciones.forEach(op => {
    const labelId = op.labels[0].id;
    document.getElementById(labelId).style.backgroundColor = "";
  });
}

function handleEndGame() {
  alert("🎉 Quiz finalizado. Respuestas incorrectas: " + incorrectas);
}

// Agrega el evento de forma moderna (en lugar de onclick en el HTML)
document.getElementById("botonContinuar").addEventListener("click", siguientePregunta);
