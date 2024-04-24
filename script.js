const movimientos = document.getElementById("contador");
const tiempo = document.getElementById("time");
const boton_iniciar = document.querySelector(".start");
const boton_reiniciar = document.querySelector(".reiniciar");
const boton_detener = document.getElementById("stop");
const gameContenedor = document.querySelector(".contenedor");
const result = document.getElementById("resultado");
const controls = document.querySelector(".controles");
const infobox = document.querySelector(".info-box");
const tabler0 = document.querySelector(".tablero");

let tarjetas;
let interval;
let firstCard = false;
let secondCard = false;

//Elementos del Array (tarjetas del memorama-game)
const items = [
    { name: "ardilla", image: "images/ardilla.gif" },
    { name: "ballena", image: "images/ballena.gif" },
    { name: "canguro", image: "images/canguro.gif" },
    { name: "cerdo", image: "images/cerdo.gif" },
    { name: "gallo", image: "images/gallo.gif" },
    { name: "hormiga", image: "images/hormiga.gif" },
    { name: "mono", image: "images/mono.gif" },
    { name: "paloma", image: "images/paloma.gif" },
    { name: "pavo", image: "images/pavo.gif" },
    { name: "pollo", image: "images/pollo.gif" },
    { name: "pulpo", image: "images/pulpo.gif" },
    { name: "raton", image: "images/raton.gif" },
    { name: "toro", image: "images/toro.gif" },
];

//Añadir audio-game

let winAudio = new Audio('./audio/win.wav');
let victoryAudio = new Audio('./audio/victoryfinal.mp3');
let lostAudio = new Audio('./audio/lost.wav');
let crickAudio = new Audio('./audio/click.mp3');

//Contador de tiempo inicial del juego
let segundos = 0,
    minutos = 0;
//Contador de movimientos & contador-ganar
let contadorMoves = 0,
    contadorGanar = 0;

tabler0.classList.add("hide");

//Generar tiempo
const timeGenerator = () => {
    segundos += 1;
    if (segundos >= 60) {
        minutos += 1;
        segundos = 0;
    }
    //Reset a la hora antes de indicar
    let secondsValue = segundos < 10 ? `0${segundos}` : segundos;
    let minutesValue = minutos < 10 ? `0${minutos}` : minutos;
    tiempo.innerHTML = `<span>Tiempo: </span>${minutesValue}:${secondsValue}`;
};

//Cálculo de movimientos realizados
const movContador = () => {
    contadorMoves += 1;
    movimientos.innerHTML = `<span>Movimientos: </span>${contadorMoves}`;
};

//Ejecutar objetos aleatorios del array
const generateRandom = (size = 4) => {
    //Array temporal
    let arrayTemporal = [...items];
    //Iniciar valores de las tarjetas
    let valorTarjetas = [];
    //Matriz de 4x4 
    size = (size * size) / 2;
    //Selección aleatoria
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * arrayTemporal.length);
        valorTarjetas.push(arrayTemporal[randomIndex]);
        //una vez seleccionado se elimina el objeto de la matriz temporal
        arrayTemporal.splice(randomIndex, 1);
    }
    return valorTarjetas;
};

const matrixGenerator = (valorTarjetas, size = 4) => {
    gameContenedor.innerHTML = "";
    valorTarjetas = [...valorTarjetas, ...valorTarjetas];
    valorTarjetas.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        //Crear tarjetas visibles (Imagen) y no visibles
        //data-card almacena los nombres de las tarjetas para compararlos más adelante
        gameContenedor.innerHTML += `
        <div class="contenedor-tarjetas" data-card-value="${valorTarjetas[i].name}">
            <div class="novisible">?</div>
            <div class="visible">
                <img src="${valorTarjetas[i].image}" class="image"/>
            </div>
        </div>
        `;
    }
    //Grid
    gameContenedor.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Tarjetas
    tarjetas = document.querySelectorAll(".contenedor-tarjetas");
    tarjetas.forEach((card) => {
        card.addEventListener("click", () => {
            // Si la tarjeta ya está emparejada, no hagas nada
            if (card.classList.contains("matched")) {
            return;
        }
            //Si la tarjeta seleccionada aún no coincide, solo ejecute (es decir, la tarjeta que ya coincide al hacer clic se ignorará)
            if (!card.classList.contains("flipped")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movContador();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        //si ambas cartas coinciden, agregar la clase "matched" para que sean ignoradas la próxima vez
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        //Contador aumenta
                        contadorGanar += 1;
                        winAudio.play();
                        if (contadorGanar == Math.floor(valorTarjetas.length / 2)) {
                            result.innerHTML = `<h4>Movimientos Realizados: ${contadorMoves}</h4>
                            <h4>Tiempo Transcurrido: ${minutos} minuto/s y ${segundos} segundos</h4>`;
                            stopGame();
                            victoryAudio.play();

                            infobox.classList.add("hide");
                            tabler0.classList.remove("hide");

                            setTimeout(() => {
                                controls.classList.add("show"); // 
                            }, 300);

                        }
                        
                    } else {
                        //Cuando las cartas no coinciden volver a su situación normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        lostAudio.play();
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 500); // Reducir el tiempo de espera
                    }
                }
            }
        });
    });
};

//Iniciar-Botón
boton_iniciar.addEventListener("click", () => {
  contadorMoves = 0;
  segundos = 0;
  minutos = 0;
  tiempo.innerHTML = `<span>Tiempo: </span>00:00`; // Reiniciar el tiempo a cero
  //Visibilidad de controles y botones.
  infobox.classList.add("hide");
  tabler0.classList.remove("hide");
  controls.classList.add("hide");
  boton_detener.classList.remove("hide");
  boton_iniciar.classList.add("hide");
  //Iniciar temporizador
  interval = setInterval(timeGenerator, 1000);
  //Movimientos - Inicio
  movimientos.innerHTML = `<span>Movimientos: </span> ${contadorMoves}`;
  initializer();
  crickAudio.play();
});

//Reiniciar-Botón
boton_reiniciar.addEventListener("click", () => {
    controls.classList.remove("show");
    contadorMoves = 0;
    segundos = 0;
    minutos = 0;
    tiempo.innerHTML = `<span>Tiempo: </span>00:00`; 
    interval = setInterval(timeGenerator, 1000);
    movimientos.innerHTML = `<span>Movimientos: </span> ${contadorMoves}`;
    initializer();
    crickAudio.play();
  });

//Stop game
boton_detener.addEventListener("click",
  (stopGame = () => {
    infobox.classList.remove("hide");
    controls.classList.remove("hide");
    boton_detener.classList.add("hide");
    boton_iniciar.classList.remove("hide");
    tabler0.classList.add("hide");
    clearInterval(interval);
    crickAudio.play();
  })
);

//Inicializa valores y llamadas a funciones.
const initializer = () => {
  result.innerText = "";
  contadorGanar = 0;
  let valorTarjetas = generateRandom();
  console.log(valorTarjetas);
  matrixGenerator(valorTarjetas);
};