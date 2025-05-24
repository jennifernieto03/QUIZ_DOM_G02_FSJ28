import preguntas from './preguntas.json';

let preguntaSeleccionada = [];
let indicePregunta = 0;
let numPregunta = 1;
let incorrectas = 0;

function empezarQuiz(tema) {
  document.getElementById('pantallaPrincipal').style.display = 'none';

  document.getElementById('contenedorPreguntas').style.display = 'grid';
  const textoTema = document.getElementById('textoTema');
  textoTema.textContent = tema.toUpperCase(); 
  document.querySelector('.header__tema-actual').style.visibility = 'visible';
  const iconoTema = document.querySelector('.header__icono');

  const imagenesPorTema = {
    html: 'icon-html.svg',
    css: 'icon-css.svg',
    git: 'icon-git.svg',
    javascript: 'icon-js.svg'
    
  };

  const temaNormalizado = tema.toLowerCase();

  const imagen = imagenesPorTema[temaNormalizado] || 'icon-default.svg';

  iconoTema.src = `/src/images/${imagen}`;

  preguntas_categoria(tema);
}

window.empezarQuiz = empezarQuiz;


const toggle = document.getElementById('checkbox');
const root = document.documentElement;
const iconoSol = document.querySelector('.header__icono-sol img');
const iconoLuna = document.querySelector('.header__icono-luna img');

toggle.checked = false;

toggle.addEventListener('change', () => {
  if (toggle.checked) {
    root.classList.add('modo-claro');
    iconoSol.src = '/src/images/icon-sun-dark.svg';
    iconoLuna.src = '/src/images/icon-moon-dark.svg';
  } else {
    root.classList.remove('modo-claro');
    iconoSol.src = '/src/images/icon-sun-light.svg';
    iconoLuna.src = '/src/images/icon-moon-light.svg';
  }
});


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

  document.getElementById('numeroPregunta').textContent = ` ${numPregunta} de ${preguntaSeleccionada.length}`;
  document.getElementById('pregunta').textContent = pregunta.pregunta;
  document.getElementById('opcionUnoLabel').textContent = pregunta.opcionA;
  document.getElementById('opcionDosLabel').textContent = pregunta.opcionB;
  document.getElementById('opcionTresLabel').textContent = pregunta.opcionC;
  document.getElementById('opcionCuatroLabel').textContent = pregunta.opcionD;

  // Limpiar selección previa
  document.querySelectorAll('input[name="opcion"]').forEach(input => input.checked = false);
  // Reset color de fondo
  resetOptionBackground();
  activarSeleccionVisual();
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
    const label = op.labels[0];
    const contenedor = op.closest('.quiz-opciones__respuesta');

    // Limpiar fondo de los labels (verde/rojo)
    label.style.backgroundColor = "";

    // Quitar la clase activa de la tarjeta
    if (contenedor) {
      contenedor.classList.remove('activa');
    }
  });
}


function handleEndGame() {
  let correctas = 10 - incorrectas;

  // Ocultar el quiz
  document.getElementById('contenedorPreguntas').style.display = 'none';

  // Mostrar resultados
  const resultados = document.getElementById('pantallaResultados');
  resultados.style.display = 'block';
  resultados.innerHTML = ''; 

  const section = document.createElement('section');
  section.classList.add('contenedor__resultados');

  section.innerHTML = `
      <div class="contenedor__informacion">
        <h2 class="quiz__finalizado">Quiz finalizado</h2>
        <p class="texto__puntaje">Tu puntaje fue...</p>
      </div>
      <div>
          <div class="contenedor__puntaje">
          <div class="score">${correctas}</div>
          <p>de 10</p>
      </div>
        <button class="boton__jugar" onclick="location.reload()">Volver a intentar</button>
      </div>
  `;
  resultados.appendChild(section);
}

function activarSeleccionVisual() {
  const opciones = document.querySelectorAll('.quiz-opciones__respuesta');

  opciones.forEach(opcion => {
    opcion.addEventListener('click', () => {
      opciones.forEach(o => o.classList.remove('activa'));
      opcion.classList.add('activa');
      const input = opcion.querySelector('input[type="radio"]');
      input.checked = true;
    });
  });
}


// Agrega el evento de forma moderna (en lugar de onclick en el HTML)
document.getElementById("botonContinuar").addEventListener("click", siguientePregunta);
