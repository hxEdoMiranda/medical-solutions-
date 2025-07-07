import { getLocalidades, getEspecialidad, getMedicos } from '../apis/agenda-presencial.js';
import { personaFotoPerfil } from "../shared/info-user.js";
let localidades = await getLocalidades();
let especialidades = {};
let containerRegiones = document.getElementById('containerRegiones');
let containerLocalidades = document.getElementById('containerLocalidades');
let containerEspecialidades = document.getElementById('containerEspecialidades');
let containerServicios = document.getElementById('containerServicios');
let textLocalidad = "";
let textComuna = "";
let textRegion = "";
let specialty;
let services = [];
let medicos = {};

let totalSlots;
let textService;


await personaFotoPerfil()

export async function init(data) {


    //Swal.fire("", "Recuerda que puedes agendar con profesionales presencialmente", "info").then(() => {});

    $("#regiones").empty();
    appendOption();

    const regiones = [...new Set(localidades.map(item => item.address.state))];
    regiones.forEach((object, index) => {
        $("#regiones").append('<option class="dropdown-item" data-id="' + object + '"  value="' + index + '">' + object + '</option>');
    });



    document.querySelector(".itemRegiones").onchange = async () => {
        let region = document.getElementById('regiones');
        //var value = comuna.options[comuna.selectedIndex].value;
        textRegion = region.options[region.selectedIndex].text;
        $("#comunas").empty();
        $("#especialidades").empty();
        $("#servicios").empty();
        $("#comunas").append('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Comuna</option>');
        appendOption();
        localidades.forEach((object, index) => {

            if (object.address.state === textRegion) {
                $("#comunas").append('<option class="dropdown-item" data-id="' + object.address.district + '" data-nombrecomuna="' + object.address.city + '"  value="' + index + '">' + object.address.city + '</option>');
            }
        });
        if (localidades.length > 0) {
            containerRegiones.classList.remove("selector-activo");
            containerLocalidades.classList.remove("selector-activo");
            containerEspecialidades.classList.remove("selector-activo");
            containerServicios.classList.remove("selector-activo");
            containerLocalidades.classList.add("selector-activo");
        }
    }

    document.querySelector(".itemLocalidades").onchange = async () => {

        $("#servicios").empty();
        appendOption();
        $("#especialidades").empty();

        let comuna = document.getElementById('comunas');
        //var value = comuna.options[comuna.selectedIndex].value;

        textLocalidad = comuna.options[comuna.selectedIndex].getAttribute("data-id");
        textComuna = comuna.options[comuna.selectedIndex].getAttribute("data-nombrecomuna");

        especialidades = await getEspecialidad(textLocalidad, textComuna);
        especialidades.forEach(({ extension, text }, index) => {
            extension.forEach(({ url, valueString }) => {
                if (url === 'es') $("#especialidades").append('<option class="dropdown-item" data-id="' + text + '" value="' + index + '">' + valueString + '</option>');
            });
        });

        if (especialidades.length === 0) {
            Swal.fire("", "Estamos trabajando para mejorar tu experiencia. Próximamente tendrás horas disponibles para agendar en esta localidad", "info").then(() => {
            });
        }

        if (especialidades.length > 0) {
            containerLocalidades.classList.remove("selector-activo");
            containerEspecialidades.classList.add("selector-activo");

            var optionsEspec = $("#especialidades option");
            optionsEspec.sort(function (a, b) {
                if (a.text > b.text) return 1;
                if (a.text < b.text) return -1;
                return 0
            });
            $("#especialidades").empty().append(optionsEspec);
            $("#especialidades").prepend('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Especialidad</option>');
        }
    }

    document.querySelector(".itemEspecialidad").onchange = async () => {
        $("#servicios").empty();
        let especialidad = document.getElementById('especialidades');
        specialty = especialidad.options[especialidad.selectedIndex].getAttribute("data-id");
        medicos = await getMedicos(textLocalidad, textComuna, specialty);
        

        medicos.forEach(({ tiposServicios }) => {
            tiposServicios.forEach(({ text, extension }) => {
                extension.forEach(({ url, valueInteger }) => {
                    let dataServices = {
                        text: '',
                        totalSlots: 0
                    }
                    if (url === "service-slots-per-appointment") {
                        //dataServices.text = text.toUpperCase();
                        dataServices.text = text;
                        dataServices.totalSlots = valueInteger;
                        services.push(dataServices);
                    }

                })
            })
        })

        const key = 'text';
        const uniqueServices = [...new Map(services.map(item =>
            [item[key], item])).values()];

        $("#servicios").append('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Búsqueda servicios</option>');
        uniqueServices.forEach(({ text, totalSlots }, index) => {
            $("#servicios").append('<option class="dropdown-item" data-id="' + text + '" value="' + totalSlots + '">' + text + '</option>');

        });

        if (services.length > 0) {
            containerEspecialidades.classList.remove("selector-activo");
            containerServicios.classList.add("selector-activo");
            //cargarMedicos(medicos)
        } else Swal.fire("", "Estamos trabajando para mejorar tu experiencia. Próximamente tendrás horas disponibles para agendar en este servicio", "info").then(() => {
        });
    }


    //COMENTADO INICIALMENTE
    /*medicos = await getMedicos("", "", "");
   

    medicos.forEach(({ tiposServicios }) => {
        tiposServicios.forEach(({ text, extension }) => {
            extension.forEach(({ url, valueInteger }) => {
                let dataServices = {
                    text: '',
                    totalSlots: 0
                }
                if (url === "service-slots-per-appointment") {
                    //dataServices.text = text.toUpperCase();
                    dataServices.text = text;
                    dataServices.totalSlots = valueInteger;
                    services.push(dataServices);
                }

            })
        })
    })

    const key = 'text';
    const uniqueServices = [...new Map(services.map(item =>
        [item[key], item])).values()];

    $("#servicios").append('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Búsqueda servicios</option>');
    uniqueServices.forEach(({ text, totalSlots }, index) => {
        $("#servicios").append('<option class="dropdown-item" data-id="' + text + '" value="' + totalSlots + '">' + text + '</option>');

    });

    if (services.length > 0) {
        containerEspecialidades.classList.remove("selector-activo");
        containerServicios.classList.add("selector-activo");
    } else Swal.fire("", "Rellene campos para empezar la búsqueda", "info").then(() => {
    });
    let selectServicios = document.getElementById('servicios');
    textService = selectServicios.options[1].text;
    cargarMedicos(medicos);*/

}

function appendOption() {
    if ($('#regiones').children('option').length == 0) $("#regiones").append('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Región</option>');
    if ($('#comunas').children('option').length == 0) $("#comunas").append('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Comuna</option>');
    if ($('#especialidades').children('option').length == 0) $("#especialidades").append('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Especialidad</option>');
    if ($('#servicios').children('option').length == 0) $("#servicios").append('<option class="dropdown-item" data-id="-1" value="-1" selected disabled>Servicio</option>');
}


document.querySelector(".itemServicios").onchange = async () => {
    let selectServicios = document.getElementById('servicios');
    totalSlots = selectServicios.options[selectServicios.selectedIndex].value;
    textService = selectServicios.options[selectServicios.selectedIndex].text;
    if (medicos && !medicos[0].error) {
        $(".presencial_box").hide();
        cargarMedicos(medicos);
    }
    else Swal.fire("", "Estamos trabajando para mejorar tu experiencia. Próximamente tendrás horas disponibles para agendar en esta especialidad", "info").then(() => {
    });
}

async function cargarMedicos(medicos) {


    $("#tab-content").empty();
    //let divMedicos = document.getElementById('tab-content');

    divProfesionales.innerHTML = "";

    medicos?.forEach(iterarMedicos);

    if ($(".kt_widget4_tab1_content").length === 0) {

        $("#tab-content").empty();
        document.querySelector('[id="pnlMedicos"]').setAttribute('style', 'display:block')
    }
}




async function iterarMedicos(medico, index) {

    //medico.qualification.forEach(({ extension }) => {
    //    extension.forEach(({ valueString, url }) => {
    //        if (url === 'issuer') divCajMedico.setAttribute('data-tituloMedico', valueString);
    //    });
    //});
    let flag = false;
    medico.tiposServicios.forEach(({ text, extension }) => {
        extension.forEach(({ url, valueInteger }) => {
            if (url === "service-slots-per-appointment" && text === textService) {
                flag = true;
            }

        });
    });
    if (flag) {
        let divCajMedico = document.createElement('div');
        divCajMedico.classList.add('col-12', 'col-sm-6', 'col-lg-4', 'col-xl-3', 'mb-3',);
        divCajMedico.classList.add('cajaInfoMedico');

        var divCard = document.createElement('div');
        var divBack;

        let buttonInside = document.createElement('button');
        var url;

        divCajMedico.addEventListener("click", async function () {
            var idMedico = $(this)[0].dataset.idmedico;
            let divPerfilProfesional = document.createElement('div');
            var classMedico = `.${idMedico}`;
            divPerfilProfesional.classList.add('perfil-profesional');

            divPerfilProfesional.classList.add(idMedico);
        });

        // start Front Card
        divCard.classList.add('card', 'caja-profesional');

        // Se genera Front de tarjeta
        let divFront = document.createElement('div');
        divFront.classList.add('front');

        let fotoProfesional = document.createElement('img');
        // fotoProfesional.classList.add('card-img-top');

        if (medico.genero === 'male') {
            fotoProfesional.src = baseUrlWeb + '/upload/foto_perfil/noPerfilProfesional/ManAvatar.svg';
        } else {
            fotoProfesional.src = baseUrlWeb + '/upload/foto_perfil/noPerfilProfesional/WomanAvatar.svg';
        }

        let divCardBody = document.createElement('div');
        divCardBody.classList.add('card-body');

        let divContData = document.createElement('div');
        divContData.classList.add('cont-data');

        let divDataAtencion = document.createElement('div');
        divDataAtencion.classList.add('data-atencion');


        let calendarIcon = document.createElement('i');
        calendarIcon.classList.add('fal', 'fa-calendar-alt');

        let spanHeader = document.createElement('span');
        spanHeader.classList.add('header-aviso-atencion');
        spanHeader.appendChild(calendarIcon);


        let labelProximaAtencion = document.createElement('span');

        labelProximaAtencion.innerHTML = "Próxima Atención";

        spanHeader.appendChild(labelProximaAtencion);

        divDataAtencion.appendChild(spanHeader);


        let divClasificación = document.createElement('div');
        divClasificación.classList.add("calificacion");

        for (var i = 0; i < 5; i++) {
            let divEstrellaPositiva = document.createElement('i');
            divEstrellaPositiva.classList.add('fas');
            divEstrellaPositiva.classList.add('fa-star');
            divEstrellaPositiva.classList.add('positiva');
            divClasificación.appendChild(divEstrellaPositiva);

        }
        for (var i = 0; i < 0; i++) {
            let divEstrellaNeutra = document.createElement('i');
            divEstrellaNeutra.classList.add('fal');
            divEstrellaNeutra.classList.add('fa-star');
            divClasificación.appendChild(divEstrellaNeutra);
        }


        // data atencion - clasificacion

        let spanNombreMedico = document.createElement('span');
        spanNombreMedico.classList.add('nombre-profesional');

        //titulo profesional
        let spanEspecialidad = document.createElement('span');
        spanEspecialidad.classList.add('titulo-profesional');
        spanEspecialidad.textContent = medico.especialidad + " - " + textService;

        //spanTituloProfesionalNombre.textContent = medico.tituloUniversitario;

        //medico.qualification.forEach(({ extension }) => {
        //    extension.forEach(({ valueString, url }) => {
        //        if (url === 'issuer') spanTituloProfesionalNombre.textContent = valueString;
        //    });
        //});;


        let labelNombreProfesional = document.createElement('span');

        labelNombreProfesional.innerHTML = `${medico.nombreCompleto}`;
        spanNombreMedico.appendChild(labelNombreProfesional);
        spanNombreMedico.appendChild(spanEspecialidad);


        let labelInstitucionProfesional = document.createElement('small');
        labelInstitucionProfesional.innerHTML = ` ${medico.proximaHora.lugar ? medico.proximaHora.lugar : ''}${medico.proximaHora.direccion ? ', ' + medico.proximaHora.direccion : ''}`;


        spanNombreMedico.appendChild(labelInstitucionProfesional);
        divDataAtencion.appendChild(spanNombreMedico);

        //let spanAlmaProfesional = document.createElement('span');
        //spanAlmaProfesional.classList.add('titulo-profesional');
        //spanAlmaProfesional.innerHTML = medico.almaMater;

        //divDataAtencion.appendChild(spanAlmaProfesional);
        //let spanTituloProfesional = document.createElement('span');
        //spanTituloProfesional.classList.add('especialidad-profesional', 'fuente-accesible');
        //spanTituloProfesional.innerHTML = medico.especialidad;
        //divDataAtencion.appendChild(spanTituloProfesional);



        divDataAtencion.appendChild(divClasificación);
        let spanFechaAtencion = document.createElement('span');
        spanFechaAtencion.classList.add('d-block');
        spanFechaAtencion.classList.add('fecha-atencion', 'front-fecha-atencion');


        let lblFechaAtencion = document.createElement('strong');
        lblFechaAtencion.innerHTML = ''
        lblFechaAtencion.innerHTML = `${moment(medico.proximaHora.inicio).format("DD-MM-YYYY")} - ${moment(medico.proximaHora.inicio).format("HH:mm")} HRS`;

        spanFechaAtencion.appendChild(lblFechaAtencion);

        divDataAtencion.appendChild(spanFechaAtencion);

        let spanHoraAtencionProxima = document.createElement('span');
        spanHoraAtencionProxima.classList.add('d-block');
        spanHoraAtencionProxima.classList.add('aviso-hora');

        let divOpciones = document.createElement('div');

        let linkSearch = document.createElement('a');
        linkSearch.href = "#";
        let iconSearch = document.createElement('i');
        iconSearch.classList.add("fal");
        iconSearch.classList.add("fa-search");
        linkSearch.appendChild(iconSearch);


        let linkCalendar = document.createElement('a');
        linkCalendar.href = "#";
        let iconSearch2 = document.createElement('i');
        iconSearch2.classList.add("fal");
        iconSearch2.classList.add("fa-calendar-alt");
        linkCalendar.appendChild(iconSearch2);


        divOpciones.classList.add('caja-opciones');

        divOpciones.appendChild(linkSearch);
        divOpciones.appendChild(linkCalendar);

        // end. Front Card


        //start. Back Card
        divBack = document.createElement('div');
        divBack.classList.add('back');
        // divBack.innerHTML = `<div class="loader">
        //    <div class="fa-2x">
        //      <i class="fas fa-spinner fa-spin"></i>
        //      </div>
        //  </div>`;
        divBack.innerHTML = '';
        // end. Back Card

        divContData.appendChild(divDataAtencion);
        divContData.appendChild(divOpciones);
        divCardBody.appendChild(fotoProfesional);
        divCardBody.appendChild(divContData);
        // divCard.appendChild(fotoProfesional);
        divFront.appendChild(divCardBody);
        //divBack.appendChild(divPerfilProfesional);
        divCard.appendChild(divFront);
        divCard.appendChild(divBack);
        divCajMedico.appendChild(divCard);

        let divProfesionales = document.getElementById('divProfesionales');

        divProfesionales.appendChild(divCajMedico);
        
        // Evalua si profesional cobra o no
        if (!medico.cobrar) {
            divCard.classList.add('no-flip');
            buttonInside.setAttribute('class', 'btn btn-primary btn-block btn-sm my-2 btn-agendar');
            buttonInside.innerHTML = "Agendar";
            divCardBody.appendChild(buttonInside);
            url = "/Presencial/Agenda_2" + "?idMedico=" + medico.nombreCompleto + "&fechaPrimeraHora=" + moment(medico.proximaHora.inicio).format("DD-MM-YYYY") + "&m=" + textLocalidad + "&r=" + specialty + "&titulo=" + medico.tituloUniversitario + "&tipoServicio=" + textService + "&totalSlots=" + totalSlots + "&lugar=" + `${medico.proximaHora.lugar ? medico.proximaHora.lugar : ''}${medico.proximaHora.direccion ? ', ' + medico.proximaHora.direccion : ''}` + "&genero=" + medico.genero;
        }
        //click botón agendar
        buttonInside.addEventListener("click", async function () {
            // divCard.classList.remove("flipped");
            if (medico.atencionDirecta) {

            }
            //convenio tipo suscripcion, sin pago, pasa a agenda 2, sin ingresar numero de serie de cedula de identidad
            else if (!medico.cobrar) {
                divCard.classList.remove("flipped");
                location.href = url;
            }
            // tarjeta pago
            else {
                window.location.href = url;
                divCard.classList.remove("flipped");
            }
        });
    }
}