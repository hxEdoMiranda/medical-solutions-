/*Sala Juegos*/


const cardData = [
    {
        nombreJuego: "Alien Cyclone",
        fotoJuego: "../img/juegos/alien-cyclone.png",
        urlJuego: "https://embed.gsrca.de/p/J44k/GQ3TKND/",
        estadoJuego: "",
        categoriaJuego: "",
    },

    {
        nombreJuego: "Clumsy Bird",
        fotoJuego: "../img/juegos/clumsy.png",
        urlJuego: "https://ellisonleao.github.io/clumsy-bird/",
        estadoJuego: "",
        categoriaJuego: "",
    },
      {
        nombreJuego: "Cookie Moons",
        fotoJuego: "../img/juegos/cookie-moons.png",
        urlJuego: "https://embed.gsrca.de/p/JEhF/GYYGKYT/",
        estadoJuego: "",
        categoriaJuego: "",
    },



    {
        nombreJuego: "Everyone's sky",
        fotoJuego: "../img/juegos/everyone.png",
        urlJuego: "https://js13kgames.com/games/everyones-sky/index.html",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "Matchmania",
        fotoJuego: "../img/juegos/matchmania.png",
        urlJuego: "https://embed.gsrca.de/p/rtAG/GE4TKOL/",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "Ninja vs EvilCorp",
        fotoJuego: "../img/juegos/ninja-evil.png",
        urlJuego: "https://js13kgames.com/games/ninja-vs-evilcorp/index.html",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "OnOff",
        fotoJuego: "../img/juegos/onoff.png",
        urlJuego: "https://js13kgames.com/games/onoff/index.html",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "Pac Man",
        fotoJuego: "../img/juegos/pacman.png",
        urlJuego: "https://pacman.js.org/",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "Spin Hawk: Wings of Fury!",
        fotoJuego: "../img/juegos/spin-hawk.png",
        urlJuego: "https://embed.gsrca.de/p/rI3w/MVTDEOL/",
        estadoJuego: "",
        categoriaJuego: "",
    },

    {
        nombreJuego: "Super Flappy Land",
        fotoJuego: "../img/juegos/flappyland.png",
        urlJuego: "https://embed.gsrca.de/p/9UJ9/MFRDMOL/",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "Super Smash Ants",
        fotoJuego: "../img/juegos/smashants.png",
        urlJuego: "https://embed.gsrca.de/p/Usd/MEYTANL/",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "Stolen Sword",
        fotoJuego: "../img/juegos/stolen-sword.png",
        urlJuego: "https://js13kgames.com/games/stolen-sword/index.html",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "Tetris",
        fotoJuego: "../img/juegos/tetris.png",
        urlJuego: "https://games.coolgames.com/tetris-lottery/en/3.2/index.html?mp_assets=https%3A%2F%2Fs2.minijuegosgratis.com%2F&mp_embed=0&mp_game_id=1189&mp_game_uid=tetris-i1240&mp_game_url=https%3A%2F%2Fwww.minijuegos.com%2Fembed%2Ftetris-i1240&mp_int=1&mp_locale=es_ES&mp_player_type=IFRAME&mp_site_https_url=https%3A%2F%2Fwww.minijuegos.com%2F&mp_site_name=minijuegos.com&mp_site_url=https%3A%2F%2Fwww.minijuegos.com%2F&mp_timezone=America%2FSantiago&mp_view_type=''>",
        estadoJuego: "",
        categoriaJuego: "",
    },
    {
        nombreJuego: "The Legend of Yeti-404",
        fotoJuego: "../img/juegos/yeti.png",
        urlJuego: "https://js13kgames.com/games/the-legend-of-yeti-404/index.html",
        estadoJuego: "",
        categoriaJuego: "",
    },
  
    {
        nombreJuego: "X-Type",
        fotoJuego: "../img/juegos/xtype.png",
        urlJuego: "https://phoboslab.org/xtype/",
        estadoJuego: "",
        categoriaJuego: "",
    },
 
   
 
 
 
 
  
]


function cardJuego(juego) {
    return `
        <div class="medio medio--juego ${juego.estadoJuego} " data-url="${juego.urlJuego}">
            <div class="medio__img">
                <img src="${juego.fotoJuego}" alt="">
            </div>
            <div class="medio__data">
                <div class="medio__titulo">
                ${juego.nombreJuego}
                    <small>${juego.categoriaJuego}</small>
                </div>
            </div>
        </div>
    `}

//Contiene las cajas
const contJuegos = document.getElementById('contJuegos');




//Iframe
const contIframeJuegos = document.getElementById('contIframeJuegos');


const visorJuego = document.getElementById('visorJuego');


//const contMedia = document.getElementById('contMedia');


const closeMediaBtn = document.querySelectorAll('.close-media');
const openJuegos = document.getElementById('bntJuegos')



contJuegos.innerHTML = `
${cardData.map(cardJuego).join("")}
`

const juegoList = document.querySelectorAll('.medio--juego');




var divs = document.querySelectorAll(".panel-medios");
var contDivs = document.querySelectorAll(".panel-medios__body");
var btnClose = document.querySelectorAll(".panel-medios__close");
var btnReturn = document.querySelectorAll(".btn-return");
var backdrop = document.getElementById("backdrop");
var boton1 = document.getElementById("hs-c");
var boton2 = document.getElementById("hs-e");
var boton3 = document.getElementById("hs-d");

var boton1M = document.getElementById("icon-sala-mobile-juegos");
var boton2M = document.getElementById("icon-sala-mobile-videos");
var boton3M = document.getElementById("icon-sala-mobile-revistas");


addDnoneReturn();

//Desk

boton1.addEventListener("click", function () {
    ocultarDivs(0);
    backdrop.classList.remove('d-none');
});

boton2.addEventListener("click", function () {
    ocultarDivs(1);
    backdrop.classList.remove('d-none');
});

boton3.addEventListener("click", function () {
    ocultarDivs(2);
    backdrop.classList.remove('d-none');
});

//Mob

boton1M.addEventListener("click", function () {
    ocultarDivs(0);
    backdrop.classList.remove('d-none');
});

boton2M.addEventListener("click", function () {
    ocultarDivs(1);
    backdrop.classList.remove('d-none');
});

boton3M.addEventListener("click", function () {
    ocultarDivs(2);
    backdrop.classList.remove('d-none');
});



btnClose.forEach((el) => {
    el.addEventListener('click', function () {
        for (const div of divs) {
            div.classList.add('close-panel');
            backdrop.classList.add('d-none');
            limpiaSrcIframe();
            removeDnone();
            document.body.style.overflow = "auto";
        }
    });
});


btnReturn.forEach((el) => {
    el.addEventListener('click', function () {
        addDnoneReturn();
        for (const contDiv of contDivs) {
            contDiv.classList.remove('d-none');
            limpiaSrcIframe();
        }
    });
});


function limpiaSrcIframe() {
    visorJuego.src = '';
    visorVideo.src = '';
    visorRevista.src = '';
}

function removeDnone() {
    contJuegos.classList.remove('d-none');
    contVideos.classList.remove('d-none');
    contRevistas.classList.remove('d-none');
}

function addDnoneReturn() {
    btnReturn.forEach((el) => {
        el.classList.add('d-none');
    })
}

function removeDnoneReturn() {
    btnReturn.forEach((el) => {
        el.classList.remove('d-none');
    })
}






function ocultarDivs(index) {
    divs.forEach(function (div, i) {
        if (i !== index) {
            //div.style.display = "none";
            //div.classList.add('d-none');
            div.classList.add('close-panel');
            document.body.style.overflow = "hidden";
        } else {
            //div.style.display = "block";
            div.classList.remove('close-panel');
            
        }
    });
}

juegoList.forEach(el => {
    el.addEventListener('click', () => {
        contIframeJuegos.classList.remove('d-none'); // remueve la clase si ya la tiene
        contJuegos.classList.add('d-none');
        visorJuego.src = el.dataset.url;
        removeDnoneReturn();
    });
});