function startQuiz(tema) {
  document.getElementById('pantallaPrincipal').style.display = 'none';

  const quizSection = document.getElementById('contenedorPreguntas');
  quizSection.style.display = 'grid';

  const textoTema = document.getElementById('textoTema');
  textoTema.textContent = tema.toUpperCase(); 

  console.log("Tema seleccionado:", tema);
}

window.startQuiz = startQuiz;