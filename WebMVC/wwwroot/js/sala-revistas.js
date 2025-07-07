/*Sala Revistas*/

const cardDataRevistas = [
    {
        nombreRevista: "Guía de Autocuidado en niñas y niños",
        fotoRevista: "../img/revistas/r1.png",
        urlRevista: "../img/revistas/r1.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "Muy Interesante",
        fotoRevista: "../img/revistas/r2.jpg",
        urlRevista: "../img/revistas/r2.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "Vogue",
        fotoRevista: "../img/revistas/r3.jpg",
        urlRevista: "../img/revistas/vogue-385_compr.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "Qué planta en qué lugar",
        fotoRevista: "../img/revistas/r4.jpg",
        urlRevista: "../img/revistas/142240310-Plantas-Que-Planta-en-que-Lugar_compr.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "AD",
        fotoRevista: "../img/revistas/r5.jpg",
        urlRevista: "../img/revistas/ad-156-compr.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "Glamour",
        fotoRevista: "../img/revistas/r6.jpg",
        urlRevista: "../img/revistas/glamour-210_compr.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    }, {
        nombreRevista: "Traveler",
        fotoRevista: "../img/revistas/r7.jpg",
        urlRevista: "../img/revistas/traveler-138_compr.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "Wired",
        fotoRevista: "../img/revistas/r8.jpg",
        urlRevista: "../img/revistas/wired0421.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "World Cup Legends",
        fotoRevista: "../img/revistas/r9.jpg",
        urlRevista: "../img/revistas/worl-cup_2018.pdf",
        estadoRevista: "",
        categoriaRevista: "",
    },
    {
        nombreRevista: "The Legend of Korra",
        fotoRevista: "../img/revistas/r10.jpg",
        urlRevista: "../img/revistas/korra1.pdf",
        estadoRevista: "",
                    categoriaRevista: "",
    },
    {
    nombreRevista: "Condorito 40 años",
    fotoRevista: "../img/revistas/r11.jpg",
     urlRevista: "../img/revistas/condorito.pdf",
                estadoRevista: "",
                    categoriaRevista: "",
    }
]

function cardRevista(revista) {
    return `
        <div class="medio medio--revista ${revista.estadoRevista} " data-url="${revista.urlRevista}">
            <div class="medio__img">
                <img src="${revista.fotoRevista}" alt="">
            </div>
        </div>
    `}

function cardRevista(revista) {
    return `
        <div class="medio medio--revista ${revista.estadoRevista} " data-url="${revista.urlRevista}">
            <div class="medio__img">
                <img src="${revista.fotoRevista}" alt="">
            </div>
        </div>
    `}


const contRevistas = document.getElementById('contRevistas');
const contIframeRevistas = document.getElementById('contIframeRevistas');
const visorRevista = document.getElementById('visorRevista');

contRevistas.innerHTML = `
${cardDataRevistas.map(cardRevista).join("")}
`


const revistaList = document.querySelectorAll('.medio--revista');


revistaList.forEach(el => {
    el.addEventListener('click', () => {
        contIframeRevistas.classList.remove('d-none'); // remueve la clase si ya la tiene
        contRevistas.classList.add('d-none');
        visorRevista.src = el.dataset.url;
        removeDnoneReturn();
    });
});

const reporte = document.getElementById('reporte');
const reporteM = document.getElementById('reporte-m');
const panel = document.getElementById('panel')
const panelM = document.getElementById('panel-m')
const closePanelM = document.getElementById('close-panel-m')
const closePanel = document.getElementById('close-panel')



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

reporte.addEventListener('click', showPanel);
closePanel.addEventListener('click', removePanel);
reporteM.addEventListener('click', showPanelM);
closePanelM.addEventListener('click', removePanelM);