/* Sala */

const chat = document.getElementById('chat');
const reporte = document.getElementById('reporte');

const chatM = document.getElementById('chat-m');
const reporteM = document.getElementById('reporte-m');
const closePanel = document.getElementById('close-panel')

const panel = document.getElementById('panel')
const panelM = document.getElementById('panel-m')
const closePanelM = document.getElementById('close-panel-m')



// Func Desk

const showPanel = () => {
    panel.classList.toggle('show-panel')
}
const removePanel = () => {
    panel.classList.remove('show-panel')
}

// Func Mobile

const showPanelM = () => {
    panelM.classList.toggle('show-panel')
}
const removePanelM = () => {
    panelM.classList.remove('show-panel')
}



chat.addEventListener('click', showPanel);
reporte.addEventListener('click', showPanel);
closePanel.addEventListener('click', removePanel);

chatM.addEventListener('click', showPanelM);
reporteM.addEventListener('click', showPanelM);
closePanelM.addEventListener('click', removePanelM);


/* $(document).ready(function () {
    $("#modal-validacion").modal('show');
});*/



$(document).ready(function () {
    //$('#modal-validacion').modal('show');
    //$('#modal-videos').modal('show');
    // $('#modal-revista').modal('show');
});


// Revistas

const t1 = document.getElementById('thumb1');
const t2 = document.getElementById('thumb2');
const t3 = document.getElementById('thumb3');
const t4 = document.getElementById('thumb4');
const t5 = document.getElementById('thumb5');
const t6 = document.getElementById('thumb6');
const t7 = document.getElementById('thumb7');
const t8 = document.getElementById('thumb8');
const t9 = document.getElementById('thumb9');
const t10 = document.getElementById('thumb10');
const t11 = document.getElementById('thumb11');

const btnVolver = document.getElementById('btnVolver');

const revistas = document.getElementById('contRevistas');

const visor = document.getElementById('visor');
const contRevista = document.getElementById('contRevista');

const showRevista = (src) => {
    visor.classList.toggle('d-none');
    visor.src = src;
}

const removeSrc = () => {
    visor.src = '';
    
    revistas.classList.remove('d-none');
    visor.classList.add('d-none');
    btnVolver.classList.add('d-none');
}

t1.addEventListener('click', () => {
    visor.src = '/img/revistas/r1.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t2.addEventListener('click', () => {
    visor.src = '/img/revistas/r2.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t3.addEventListener('click', () => {
    visor.src = '/img/revistas/vogue-385_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t4.addEventListener('click', () => {
    visor.src = '/img/revistas/142240310-Plantas-Que-Planta-en-que-Lugar_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t5.addEventListener('click', () => {
    visor.src = '/img/revistas/ad-156-compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t6.addEventListener('click', () => {
    visor.src = '/img/revistas/glamour-210_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t7.addEventListener('click', () => {
    visor.src = '/img/revistas/traveler-138_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t8.addEventListener('click', () => {
    visor.src = '/img/revistas/wired0421.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t9.addEventListener('click', () => {
    visor.src = '/img/revistas/worl-cup_2018.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t10.addEventListener('click', () => {
    visor.src = '/img/revistas/korra1.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t11.addEventListener('click', () => {
    visor.src = '/img/revistas/condorito.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});


btnVolver.addEventListener('click', () => {
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.add('d-none');
    visor.src = '';
});



// Videos


//const v1 = document.getElementById('v1');
const v2 = document.getElementById('v2');
const v3 = document.getElementById('v3');
//const v4 = document.getElementById('v4');
//const v5 = document.getElementById('v5');
//const v6 = document.getElementById('v6');
// const v7 = document.getElementById('v7');
const btnVolverVideo = document.getElementById('btnVolverVideo');
const videos = document.getElementById('contVideos');

const visorVideo = document.getElementById('visorVideo');

const removeSrcVideo = () => {
    visorVideo.src = '';
    
    videos.classList.remove('d-none');
    visorVideo.classList.add('d-none');
    btnVolverVideo.classList.add('d-none');
}

//v1.addEventListener('click', () => {
//    visorVideo.src = 'https://www.youtube.com/embed/IxRiUAIvsyM?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=http://youtubeembedcode.com';
//    visorVideo.classList.toggle('d-none');
//    videos.classList.toggle('d-none');
//    btnVolverVideo.classList.remove('d-none');
//});

v2.addEventListener('click', () => {
    visorVideo.src = 'https://player.vimeo.com/video/490880402';
    visorVideo.classList.toggle('d-none');
    videos.classList.toggle('d-none');
    btnVolverVideo.classList.remove('d-none');
});

v3.addEventListener('click', () => {
    visorVideo.src = 'https://player.vimeo.com/video/490880536';
    visorVideo.classList.toggle('d-none');
    videos.classList.toggle('d-none');
    btnVolverVideo.classList.remove('d-none');
});

//v4.addEventListener('click', () => {
//    visorVideo.src = 'https://player.vimeo.com/video/490880567';
//    visorVideo.classList.toggle('d-none');
//    videos.classList.toggle('d-none');
//    btnVolverVideo.classList.remove('d-none');
//});

//v5.addEventListener('click', () => {
//    visorVideo.src = 'https://player.vimeo.com/video/490880554';
//    visorVideo.classList.toggle('d-none');
//    videos.classList.toggle('d-none');
//    btnVolverVideo.classList.remove('d-none');
//});
//
//v6.addEventListener('click', () => {
//    visorVideo.src = 'https://player.vimeo.com/video/490880672';
//    visorVideo.classList.toggle('d-none');
//    videos.classList.toggle('d-none');
//    btnVolverVideo.classList.remove('d-none');
//});

//v7.addEventListener('click', () => {
//    visorVideo.src = 'https://player.vimeo.com/video/490880444';
//    visorVideo.classList.toggle('d-none');
//    videos.classList.toggle('d-none');
//    btnVolverVideo.classList.remove('d-none');
//});

btnVolverVideo.addEventListener('click', () => {
    visorVideo.classList.toggle('d-none');
    videos.classList.toggle('d-none');
    btnVolverVideo.classList.add('d-none');
    visorVideo.src = '';
});



// Juegos

const j1 = document.getElementById('j1');
const j2 = document.getElementById('j2');
const j3 = document.getElementById('j3');
const j4 = document.getElementById('j4');
const j5 = document.getElementById('j5');
const j6 = document.getElementById('j6');
const j7 = document.getElementById('j7');
const j8 = document.getElementById('j8');
const j9 = document.getElementById('j9');
const j10 = document.getElementById('j10');
const btnVolverJuego = document.getElementById('btnVolverJuego');
const juegos = document.getElementById('contJuegos');

const visorJuego = document.getElementById('visorJuego');


const removeSrcJuego = () => {
    visorJuego.src = '';
    
    juegos.classList.remove('d-none');
    visorJuego.classList.add('d-none');
    btnVolverJuego.classList.add('d-none');
}



j1.addEventListener('click', () => {
    visorJuego.src = 'https://js13kgames.com/games/onoff/index.html';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});


j2.addEventListener('click', () => {
    visorJuego.src = 'https://js13kgames.com/games/everyones-sky/index.html';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

j3.addEventListener('click', () => {
    visorJuego.src = 'https://js13kgames.com/games/ninja-vs-evilcorp/index.html';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

j4.addEventListener('click', () => {
    visorJuego.src = 'https://phoboslab.org/xtype/';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

j5.addEventListener('click', () => {
    visorJuego.src = 'https://js13kgames.com/games/stolen-sword/index.html';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

j6.addEventListener('click', () => {
    visorJuego.src = 'https://js13kgames.com/games/the-legend-of-yeti-404/index.html';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

j7.addEventListener('click', () => {
    visorJuego.src = 'https://ellisonleao.github.io/clumsy-bird/';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

j8.addEventListener('click', () => {
    visorJuego.src = 'https://pacman.js.org/';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

j9.addEventListener('click', () => {
    visorJuego.src = 'https://tetris.com//games-content/play-tetris-content/resources/project-tetriscom/game/game-333939EF295B389F/if_game_html5.php?p=d&cbidg=333939EF295B389F';
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.remove('d-none');
});

btnVolverJuego.addEventListener('click', () => {
    visorJuego.classList.toggle('d-none');
    juegos.classList.toggle('d-none');
    btnVolverJuego.classList.add('d-none');
    visorJuego.src = '';
});