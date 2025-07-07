/*Sala Videos*/

const cardDataVideos = [
    {
        nombreVideo: "Un amigo con Asperger",
        fotoVideo: "https://i.ytimg.com/vi_webp/mzl33DR2rnM/sddefault.webp",
        urlVideo: "https://www.youtube.com/embed/mzl33DR2rnM",
        estadoVideo: "",
        categoriaVideo: "salud infantil",
    },
    {
        nombreVideo: "Trastornos de salud mental",
        fotoVideo: "https://i.ytimg.com/vi/T4v_EmJz5nI/sddefault.jpg",
        urlVideo: "https://www.youtube.com/embed/T4v_EmJz5nI",
        estadoVideo: "",
        categoriaVideo: "salud mental",
    },
    {
        nombreVideo: "Accidente cerebro vascular",
        fotoVideo: "https://i.ytimg.com/vi_webp/y5SvRVO6d_o/sddefault.webp",
        urlVideo: "https://www.youtube.com/embed/y5SvRVO6d_o",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
  
    {
        nombreVideo: "Autoexamen de mamas",
        fotoVideo: "https://i.ytimg.com/vi/P8FJSVjG9Ho/sddefault.jpg",
        urlVideo: "https://www.youtube.com/embed/P8FJSVjG9Ho",
        estadoVideo: "",
        categoriaVideo: "salud de la mujer",
    },
    {
        nombreVideo: "¿Qué es la menopausia?",
        fotoVideo: "https://i.ytimg.com/vi/uKvydd-1LT8/sddefault.jpg",
        urlVideo: "https://www.youtube.com/embed/uKvydd-1LT8",
        estadoVideo: "",
        categoriaVideo: "salud de la mujer",
    },
    {
        nombreVideo: "Viruela del mono",
        fotoVideo: "https://i.ytimg.com/vi/KvrcfmKPwBU/sddefault.jpg",
        urlVideo: "https://www.youtube.com/embed/KvrcfmKPwBU",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
    {
        nombreVideo: "Reconoce el acoso escolar",
        fotoVideo: "https://i.ytimg.com/vi/5ivkI13eufM/sddefault.jpg",
        urlVideo: "https://www.youtube.com/embed/5ivkI13eufM",
        estadoVideo: "",
        categoriaVideo: "salud infantil",
    },
 
   
    {
        nombreVideo: "Campaña VIH Minsal",
        fotoVideo: "https://i.ytimg.com/vi/eQMgCeXyxkY/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/eQMgCeXyxkY",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
    {
        nombreVideo: "La Tuberculosis",
        fotoVideo: "https://i.ytimg.com/vi/y5SvRVO6d_o/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/y5SvRVO6d_o",
        estadoVideo: "",
        categoriaVideo: "salud del adulto",
    },
    {
        nombreVideo: "Síntomas de un ataque cerebral",
        fotoVideo: "https://i.ytimg.com/vi/ByXNor-LZ-A/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/ByXNor-LZ-A",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
    {
        nombreVideo: "OMS: Niños y mascarillas",
        fotoVideo: "https://i.ytimg.com/vi/mkuNlkaLz2Q/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/mkuNlkaLz2Q",
        estadoVideo: "",
        categoriaVideo: "salud infantil",
    },
    {
        nombreVideo: "Conf. Internacional de Nutrición",
        fotoVideo: "https://i.ytimg.com/vi/GQQUVM5I7oo/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/GQQUVM5I7oo",
        estadoVideo: "",
        categoriaVideo: "salud del adulto",
    },
    {
        nombreVideo: "La contaminación y tu organismo",
        fotoVideo: "https://i.ytimg.com/vi/vdhDnYdBDhQ/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/vdhDnYdBDhQ",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
    {
        nombreVideo: "Iniciativa contra la depresión",
        fotoVideo: "https://i.ytimg.com/vi/4CdM4_k6glQ/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/4CdM4_k6glQ",
        estadoVideo: "",
        categoriaVideo: "salud mental",
    },
    {
        nombreVideo: "7 tips para prevenir el COVID",
        fotoVideo: "https://i.ytimg.com/vi/cP0FeB29NLQ/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/cP0FeB29NLQ",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
 
    {
        nombreVideo: "La higiene de manos",
        fotoVideo: "https://i.ytimg.com/vi/NMmAj1EKdVo/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/NMmAj1EKdVo",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
    {
        nombreVideo: "La pandemia está lejos del final",
        fotoVideo: "https://i.ytimg.com/vi/LcgMIIFCtf8/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/LcgMIIFCtf8",
        estadoVideo: "",
        categoriaVideo: "salud del adulto",
    },
    {
        nombreVideo: "Evitar la pérdida auditiva",
        fotoVideo: "https://i.ytimg.com/vi/Ag-16MTo4Nw/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/Ag-16MTo4Nw",
        estadoVideo: "",
        categoriaVideo: "prevencion",
    },
    {
        nombreVideo: "Traemos salud a la vida",
        fotoVideo: "https://i.ytimg.com/vi/vP8EoLwPGWk/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/vP8EoLwPGWk",
        estadoVideo: "",
        categoriaVideo: "salud del adulto",
    },
    {
        nombreVideo: "Vivir con depresión",
        fotoVideo: "https://i.ytimg.com/vi/XiCrniLQGYc/hqdefault.jpg",
        urlVideo: "https://www.youtube.com/embed/XiCrniLQGYc",
        estadoVideo: "",
        categoriaVideo: "salud mental",
    },
 
    {
        nombreVideo: "Consejos de Actividad Física",
        fotoVideo: "../img/videos/video2.jpg",
        urlVideo: "https://player.vimeo.com/video/490880536",
        estadoVideo: "",
        categoriaVideo: "salud del adulto",
    },
]

const contVideos = document.getElementById('contVideos');

const categoryButtons = document.querySelectorAll('.category-button');

let lastSelectedButton = null;

function mostrarTodosVideos() {
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });

    const botonTodos = document.querySelector('[data-categoria="todos"]');
    botonTodos.classList.add('active');

    if (lastSelectedButton) {
        lastSelectedButton.classList.remove('active');
    }

    lastSelectedButton = botonTodos;

    contVideos.classList.remove('fade-in');
    contVideos.classList.add('fade-out');

    setTimeout(() => {
        contVideos.innerHTML = cardDataVideos.map(cardVideo).join("");
        contVideos.classList.remove('fade-out');
        contVideos.classList.add('fade-in');

        const videoList = document.querySelectorAll('.medio--video');

        videoList.forEach(el => {
            el.addEventListener('click', () => {
                contIframeVideos.classList.remove('d-none');
                contVideos.classList.add('d-none');
                visorVideo.src = el.dataset.url;
                removeDnoneReturn();
            });
        });
    }, 100);
}

function cardVideo(video) {
    return `
        <div class="medio medio--video ${video.estadoVideo} " data-url="${video.urlVideo}">
            <div class="medio__img">
                <img src="${video.fotoVideo}" alt="">
            </div>
            <div class="medio__data">
                <div class="medio__titulo">
                    ${video.nombreVideo}
                    <small>${video.categoriaVideo}</small>
                </div>
            </div>
        </div>
    `;
}

mostrarTodosVideos();

function filtrarVideos(categoria) {
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });

    const botonSeleccionado = document.querySelector(`[data-categoria="${categoria}"]`);
    botonSeleccionado.classList.add('active');

    if (lastSelectedButton) {
        lastSelectedButton.classList.remove('active');
    }

    lastSelectedButton = botonSeleccionado;

    contVideos.classList.remove('fade-in');
    contVideos.classList.add('fade-out');

    setTimeout(() => {
        const videosFiltrados = cardDataVideos.filter(video => video.categoriaVideo === categoria);
        contVideos.innerHTML = videosFiltrados.map(cardVideo).join("");

        contVideos.classList.remove('fade-out');
        contVideos.classList.add('fade-in');

        const videoList = document.querySelectorAll('.medio--video');

        videoList.forEach(el => {
            el.addEventListener('click', () => {
                contIframeVideos.classList.remove('d-none');
                contVideos.classList.add('d-none');
                visorVideo.src = el.dataset.url;
                removeDnoneReturn();
            });
        });
    }, 10);
}

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const categoriaSeleccionada = button.dataset.categoria;

        if (categoriaSeleccionada === 'todos') {
            mostrarTodosVideos();
        } else {
            filtrarVideos(categoriaSeleccionada);
        }
    });
});
