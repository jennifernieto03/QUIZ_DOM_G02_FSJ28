const interruptorTema = document.querySelector('.light-dark-switch input[type="checkbox"]');
document.querySelector(".start-menu").classList.toggle("visible")

function cambiarTema(evento) {
    if (evento.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

interruptorTema.addEventListener('change', cambiarTema, false);

var botonesQuiz = document.querySelectorAll(".quiz-type");
var tipoQuiz;

for (var i = 0; i < botonesQuiz.length; i++) {
    botonesQuiz[i].addEventListener("click", function () {
        tipoQuiz = this.id;
        pantallaPregunta(tipoQuiz);
    })
}

function pantallaPregunta(tipo) {
    document.querySelector(".start-menu").classList.toggle("visible")
    establecerBarrasTema(tipo)
    document.querySelector(".question-screen").classList.toggle("visible")
    obtenerQuiz(tipo);
}

function establecerBarrasTema(tipo) {
    var barras = document.querySelectorAll(".curr-subject");
    for (let barra of barras) {
        barra.lastElementChild.innerHTML = tipo
        if (tipo == "HTML") {
            barra.firstElementChild.firstElementChild.src = "./assets/images/icon-html.svg"
        }
        else if (tipo == "CSS") {
            barra.firstElementChild.firstElementChild.src = "./assets/images/icon-css.svg"
        }
        else if (tipo == "JavaScript") {
            barra.firstElementChild.firstElementChild.src = "./assets/images/icon-js.svg"
        }
        else {
            barra.firstElementChild.firstElementChild.src = "./assets/images/icon-accessibility.svg"
        }
        barra.style.visibility = "visible"
    }
}

var quizSeleccionado;
var contadorPreguntas = -1;
var totalPreguntas;
var puntaje = 0;
var botonEnviar = document.querySelector(".submit-answer");
var incrementoProgreso;

async function obtenerQuiz(tipo) {
    const respuesta = await fetch('./data.json');
    const datos = await respuesta.json();
    for (const quiz of datos.quizzes) {
        if (quiz.title == tipo) {
            quizSeleccionado = quiz;
            totalPreguntas = quizSeleccionado.questions.length;
            document.querySelector(".question-total").textContent = totalPreguntas
            incrementoProgreso = (1 / totalPreguntas) * 100;
        }
    }
    generarPreguntas(quizSeleccionado)
}

function generarPreguntas(quiz) {
    contadorPreguntas++;
    document.querySelector(".question-number").textContent = (contadorPreguntas + 1);
    document.querySelector(".progress-bar.done").style.width = (incrementoProgreso * (contadorPreguntas + 1)).toString() + "%";
    botonEnviar.textContent = "Enviar"
    let opciones = document.querySelectorAll(".option");

    document.querySelector(".question").textContent = quiz.questions[contadorPreguntas].question;

    for (let opcion of opciones) {
        opcion.classList.remove("selected")
        opcion.classList.remove("invalid")
        opcion.classList.remove("correct")
    }

    for (let i = 0; i < opciones.length; i++) {
        switch (i) {
            case 0: opciones[i].innerHTML = "<div class='option-box'>A</div>"
                break;
            case 1: opciones[i].innerHTML = "<div class='option-box'>B</div>"
                break;
            case 2: opciones[i].innerHTML = "<div class='option-box'>C</div>"
                break;
            case 3: opciones[i].innerHTML = "<div class='option-box'>D</div>"
                break;
        }
        opciones[i].append(quiz.questions[contadorPreguntas].options[i])
    }
}

var opciones = document.querySelectorAll(".option");

for (let i = 0; i < opciones.length; i++) {
    opciones[i].addEventListener("click", function () {
        for (opcion of opciones) {
            opcion.classList.remove("selected")
            opcion.firstChild.classList.remove("selected-box")
        }
        opciones[i].classList.add("selected")
        opciones[i].firstChild.classList.add("selected-box")
    })
}

botonEnviar.addEventListener("click", function () {
    let opcionSeleccionada, textoRespuesta;

    if (botonEnviar.textContent == "Siguiente Pregunta") {
        generarPreguntas(quizSeleccionado);
        return;
    }
    if (botonEnviar.textContent == "Ver Resultados") {
        mostrarResultados();
        return;
    }
    if (opcionSeleccionada = document.querySelector(".selected")) {

        textoRespuesta = opcionSeleccionada.textContent.slice(1, opcionSeleccionada.textContent.length);

        opcionSeleccionada.classList.remove("selected")
        opcionSeleccionada.firstChild.classList.remove("selected-box")
    }
    else {
        document.querySelector(".select-prompt").style.visibility = "visible"
        return
    }

    if (validarRespuesta(textoRespuesta)) {
        if (!opcionSeleccionada.classList.contains("correct")) {
            puntaje++;
            opcionSeleccionada.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>"
        }
        opcionSeleccionada.classList.add("correct")
        opcionSeleccionada.firstChild.classList.add("correct-box")
        document.querySelector(".select-prompt").style.visibility = "hidden"
    }
    else {
        if (!opcionSeleccionada.classList.contains("invalid")) {
            opcionSeleccionada.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>"
        }

        opcionSeleccionada.classList.add("invalid")
        opcionSeleccionada.firstChild.classList.add("invalid-box")
        document.querySelector(".select-prompt").style.visibility = "hidden"
    }

    revelarRespuestas();

    if (contadorPreguntas >= (totalPreguntas - 1)) {
        botonEnviar.textContent = "Ver Resultados"

    }
    else {
        botonEnviar.textContent = "Siguiente Pregunta";
    }
    return;
})

function revelarRespuestas() {
    for (opcion of opciones) {
        let texto = opcion.textContent.slice(1, opcion.textContent.length)

        if (validarRespuesta(texto)) {
            if (!opcion.classList.contains("correct")) {
                opcion.classList.add("correct")
                opcion.firstChild.classList.add("correct-box")
                opcion.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>"

            }
        }
        else {
            if (!opcion.classList.contains("invalid")) {
                opcion.classList.add("invalid")
                opcion.firstChild.classList.add("invalid-box")
                opcion.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>"
            }
        }
    }
}

function validarRespuesta(seleccion) {
    let pregunta = quizSeleccionado.questions[contadorPreguntas];
    return (pregunta.answer === seleccion)
}

function mostrarResultados() {
    document.querySelector(".question-screen").classList.toggle("visible")
    document.querySelector(".quiz-complete").classList.toggle("visible")
    document.querySelector(".final-score").textContent = puntaje
    document.querySelector(".complete-question-total").textContent = totalPreguntas
}

document.querySelector(".restart").addEventListener("click", function () {
    document.querySelector(".quiz-complete").classList.toggle("visible")
    document.querySelector(".start-menu").classList.toggle("visible")
    document.querySelector(".curr-subject").style.visibility = "hidden"
    contadorPreguntas = -1
    puntaje = 0
})