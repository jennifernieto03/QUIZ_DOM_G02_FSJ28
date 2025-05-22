function empezarQuiz(tema) {
  document.getElementById('pantallaPrincipal').style.display = 'none';

  const quizSection = document.getElementById('contenedorPreguntas');
  quizSection.style.display = 'grid';

  const textoTema = document.getElementById('textoTema');
  textoTema.textContent = tema.toUpperCase(); 

  console.log("Tema seleccionado:", tema);
}

window.empezarQuiz = empezarQuiz;

const toggle = document.getElementById('checkbox');
const root = document.documentElement;
const iconoSol = document.querySelector('.header__icono-sol img');
const iconoLuna = document.querySelector('.header__icono-luna img');

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
