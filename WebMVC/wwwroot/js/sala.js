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



//chat.addEventListener('click', showPanel);
reporte.addEventListener('click', showPanel);
closePanel.addEventListener('click', removePanel);

//chatM.addEventListener('click', showPanelM);
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
    visor.src = 'https://cdn.medismart.live/r1.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t2.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/r2.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t3.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/vogue-385_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t4.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/142240310-Plantas-Que-Planta-en-que-Lugar_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t5.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/ad-156-compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t6.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/glamour-210_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t7.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/traveler-138_compr.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
   btnVolver.classList.remove('d-none');
});

t8.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/wired0421.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t9.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/worl-cup_2018.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t10.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/korra1.pdf';
    visor.classList.toggle('d-none');
    revistas.classList.toggle('d-none');
    btnVolver.classList.remove('d-none');
});

t11.addEventListener('click', () => {
    visor.src = 'https://cdn.medismart.live/condorito.pdf';
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



const btnVolverVideo = document.getElementById('btnVolverVideo');
const contVideos = document.getElementById('contVideos');

const visorVideo = document.getElementById('visorVideo');


const videos = document.querySelectorAll('.medio--video');
const videoList = Array.from(videos);


videoList.forEach((el) => {
    el.addEventListener('click', function () {
        visorVideo.src = el.dataset.url;
        visorVideo.classList.toggle('d-none');
        btnVolverVideo.classList.toggle('d-none');
        contVideos.classList.toggle('d-none');
    });
});



const volverVideo = () => {
    visorVideo.src = '';
    visorVideo.classList.toggle('d-none');
    btnVolverVideo.classList.toggle('d-none');
    contVideos.classList.toggle('d-none');
}

btnVolverVideo.addEventListener('click', volverVideo);


// Juegos

const btnVolverJuego = document.getElementById('btnVolverJuego');
const contJuegos = document.getElementById('contJuegos');

const visorJuego = document.getElementById('visorJuego');


const juegos = document.querySelectorAll('.juego');
const juegoList = Array.from(juegos);


juegoList.forEach((el) => {
    el.addEventListener('click', function () {
        visorJuego.src = el.dataset.url;
        visorJuego.classList.toggle('d-none');
        btnVolverJuego.classList.toggle('d-none');
        contJuegos.classList.toggle('d-none');
    });
});



const volverJuego = () => {
    visorJuego.src = '';
    visorJuego.classList.toggle('d-none');
    btnVolverJuego.classList.toggle('d-none');
    contJuegos.classList.toggle('d-none');
}

btnVolverJuego.addEventListener('click', volverJuego);



//const contenedorMedia = document.querySelectorAll('.contenedor-media');


// Cerrar Modal

const cerrarModal = document.getElementById("cerrar-revistas");
const cerrarModalList = Array.from(cerrarModal);

cerrarModalList.forEach((el) => {
    el.addEventListener('click', function () {
        visorVideo.src = '';
        visorJuego.src = '';
        visor.src = '';
        visorVideo.classList.toggle('d-none');
        visorJuego.classList.toggle('d-none');
        visor.classList.toggle('d-none');
        contVideos.classList.toggle('d-none');
        contJuegos.classList.toggle('d-none');
        revistas.classList.toggle('d-none');
        btnVolver.toggle('d-none');
        btnVolverJuego.toggle('d-none');
        btnVolverVideo.toggle('d-none');
    });
});


//Volver

const volverModal = document.querySelectorAll('.btn-volver-media');
const volverModalList = Array.from(volverModal);
cerrarModalList.forEach((el) => {
    el.addEventListener('click', function () {

        visorVideo.src = '';
        visorJuego.src = '';
        visor.src = '';
        visorVideo.classList.toggle('d-none');
        visorJuego.classList.toggle('d-none');
        visor.classList.toggle('d-none');
        contVideos.classList.toggle('d-none');
        contJuegos.classList.toggle('d-none');
        revistas.classList.remove('d-none');
        if (btnVolver) {
            btnVolver.toggle('d-none');
            btnVolverJuego.toggle('d-none');
            btnVolverVideo.toggle('d-none');
        }
    });
});

