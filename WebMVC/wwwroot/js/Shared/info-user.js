// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


var baseUrl = new URL(window.location.href); //url base para servicios.
if (baseUrl.hostname.includes("localhost")) {
    baseUrl = "http://localhost:7000";
} else if (baseUrl.hostname.includes("desa")) {
    baseUrl = "https://desa.services.medismart.live";
} else if (baseUrl.hostname.includes("t.qa")) {
    baseUrl = "https://test.services.medismart.live";
} else if (baseUrl.hostname.includes("qa")) {
    baseUrl = "https://qa.services.medismart.live";
} else if (baseUrl.hostname.includes("staging")) {
    baseUrl = "https://staging.services.medismart.live";

} else {
    baseUrl = "https://services.medismart.live";
}


var baseUrlWeb = new URL(window.location.href); // url base para mostrar imagenes.
if (baseUrlWeb.hostname.includes(".webiste")) {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.website";
} else if (baseUrlWeb.hostname.includes("qa")) {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.medical.medismart.live";
} else {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.live";
}

import { personByUser, updateEstadoPassword, updateEstadoNotice, updateAceptaTerminos } from '../apis/personas-fetch.js';

export async function persona() {
    var persona = await personByUser(uid);

    document.getElementById('nombreCompleto').innerHTML = "Hola, " + persona.nombreCompleto;
    var iniciales = document.querySelector('.iniciales');
    if (document.querySelector("#fotoPerfil") != null) {
        if (persona.rutaAvatar != "") {
            document.getElementById('fotoPerfil').src = baseUrl + persona.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            iniciales.classList.remove('d-none');
            document.querySelector('#fotoPerfil').classList.add('d-none');
            iniciales.innerHTML = persona.iniciales;
        }
    }



};

export async function saludoPaciente() {
    var persona = await personByUser(uid);
    var url = new URL(window.location.href);
    if (persona.identificador === persona.identificadorFirebase) {
        window.actualizarDatos = true;
    } else {
        window.actualizarDatos = false;
    }

    if (!persona.changePassword && (!url.host.includes('uoh.') || !url.host.includes('zurich.') || !url.host.includes('vivetuseguro.'))) {
        updateEstadoPassword(uid);

        if (!window.actualizarDatos) {
            swal.fire({
                title: 'Es necesario cambiar password',
                text: "¿Quiere cambiarla ahora?",
                type: 'question',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'Sí, ir a cambiar',
                cancelButtonText: 'Cancelar'
            }).then(async function (result) {

                if (result.value) {
                    window.location.href = "/Paciente/Configuracion";
                }
                else if (result.dismiss == "cancel") {

                }

            });
        }
    }
    
    if (window.host.includes('laaraucana.')) {
        //let iconTop = "../../img/la-araucana/exclamacion-modal.png";
        if (!persona.aceptaTerminos) {
            if (!window.actualizarDatos) {
                await Swal.fire({
                    imageUrl: '../../img/la-araucana/exclamacion-modal.png',
                    //type: `${iconTop}`,
                    backdrop: true,
                    html: `<div class="check-aceptacion"><h5>IMPORTANTE: Aviso sobre Uso de Datos Personales</h5><p>Estimado usuario con la finalidad de prestarle un mejor servicio en nuestra plataforma de <strong>Medismart</strong>, solicitamos a <strong style="color: #0081A4">Usted su consentimiento para compartir con la Caja de Compensación La Araucana</strong> la información que se detalla a continuación:</p><ul><li>Nombre completo</li><li>RUT</li><li>Titular o Carga</li><li>Prestación</li><li>Fecha prestación</li></ul>`,
                    confirmButtonText: 'Confirmar',
                    confirmButtonColor: 'red',
                    allowOutsideClick: false,
                    focusConfirm: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                }).then((result) => {
                        updateAceptaTerminos(uid);
                        window.location.href = "#";
                    
                });
            }
        }
    }

    if (persona.codigoTelefono == 'CO') {
        let imagenModal =
            window.host.includes('pepsico.medismart') ? "../../img/pepsicoCO/exclamacion-modal.jpg" :
                window.host.includes('falabella.medismart') ? "../../img/banco-falabella/exclamacion-modal.png" :
                    "../../img/metlife/check-modal.svg";
        let titulo = window.host.includes('pepsico.medismart') || window.host.includes('falabella.medismart') ? "<span class='recuerda-texto'>Recuerda :</span> Para proteger tus datos, te recomendamos cambiar tu contraseña en los ajustes de tu perfil. " :"Tratamiento de datos personales"
        let parrafo = window.host.includes('pepsico.medismart') || window.host.includes('falabella.medismart') ? "Para el uso de mi plan autorizo el tratamiento de mis datos personales conforme a la" : "Autorizo el tratamiento de datos personales conforme <br/> a la"

        if (window.host.includes('metlife.') || window.host.includes('pepsico.medismart') || window.host.includes('falabella.medismart')) {
            var agreeTerms = sessionStorage.getItem('aceptoTerminos')
            if (agreeTerms >= 1) {
                persona.aceptaTerminos = false
            }
            if (persona.aceptaTerminos) { //false
                console.log("metlife")
                var contador = ""
                contador = contador ? parseInt(contador) + 1 : 1;
                sessionStorage.setItem('aceptoTerminos', contador);
               
                if (!window.actualizarDatos) {//false
                    await Swal.fire({
                        backdrop: true,
                        html: ` <div class="container-titulo"><img src="${imagenModal}" class="check-modal" /><p class="titulo-tratamiento">${titulo}</p></div><div class="container-check" ><input type="checkbox" id="aceptaTerminos" name="aceptaTerminos" class="form-check-label"><label for="aceptaTerminos" class="fuente-accesible mensaje-tratamiento">${parrafo} <a href="https://medical.medismart.live/documentosLegalesCO/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf" target="_blank" id="terminos" class="d-none d-lg-inline-block politica">Política de Privacidad y Tratamiento de Datos</a><a href="https://medical.medismart.live/documentosLegalesCO/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf" target="_blank" class="d-inline-block d-lg-none ">Política de Privacidad y Tratamiento de Datos</a></label></div>`,
                        confirmButtonText: 'Aceptar',
                        allowOutsideClick: false,
                        focusConfirm: false,
                        allowEscapeKey: false,
                        preConfirm: () => {
                            var check = document.getElementById("aceptaTerminos")
                            if (!check.checked) {
                                Swal.showValidationMessage(`Necesita marcar casilla de verificación`)
                          
                            }
                        }
                    }).then((result) => {
                        updateAceptaTerminos(uid);
                        window.location.href = "#";
                    });
                }
            }
        }
                
        else {
            console.log("co")
            if (!persona.aceptaTerminos) {
                if (!window.actualizarDatos) {
                    await Swal.fire({
                        type: 'question',
                        backdrop: true,
                        html: '<div class="check-aceptacion"><input type="checkbox" id="aceptaTerminos" name="aceptaTerminos" class="form-check-label"><label for="aceptaTerminos" class="fuente-accesible"> Autorizo el tratamiento de mis datos y acepto la <a href="https://medical.medismart.live/documentosLegalesCO/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf" target="_blank" id="terminos" class="d-none d-lg-inline-block">Política de Tratamiento de Datos Personales</a><a href="https://medical.medismart.live/documentosLegalesCO/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf" target="_blank" class="d-inline-block d-lg-none">Política de Tratamiento de Datos Personales</a> de Seguros Mundial</label></div> ',
                        confirmButtonText: 'Aceptar',
                        allowOutsideClick: false,
                        focusConfirm: false,
                        allowEscapeKey: false,
                        preConfirm: () => {
                            var check = document.getElementById("aceptaTerminos")
                            if (!check.checked) {
                                Swal.showValidationMessage(`Necesita marcar casilla de verificación`)
                            }
                        }
                    }).then((result) => {
                        updateAceptaTerminos(uid);
                        window.location.href = "#";
                    });
                }
            }
        }
        
    }

    if (window.host.includes('prestasalud.')) {
        if (!persona.aceptaTerminos) {
            if (!window.actualizarDatos) {

                await Swal.fire({
                    type: 'question',
                    backdrop: true,
                    html: '<div class="check-aceptacion"><input type="checkbox" id="aceptaTerminos" name="aceptaTerminos" class="form-check-label"><label for="aceptaTerminos" class="fuente-accesible"> Autorizo el tratamiento de datos personales conforme a la <a href="https://medical.medismart.live/documentosLegalesEC/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medismart-Ecuador.pdf" target="_blank" id="terminos" class="d-none d-lg-inline-block">Política de Privacidad y Tratamiento de Datos</a><a href="https://medical.medismart.live/documentosLegalesPrestaSalud/aviso-de-privacidad.pdf" target="_blank" id="terminos" class="d-none d-lg-inline-block"> y Aviso de Privacidad de Datos Personales de Seguros del Pichincha</a><a href="https://medical.medismart.live/documentosLegalesEC/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medismart-Ecuador.pdf" target="_blank" class="d-inline-block d-lg-none">Política de Privacidad y Tratamiento de Datos</a><a href="https://medical.medismart.live/documentosLegalesPrestaSalud/aviso-de-privacidad.pdf" target="_blank" class="d-inline-block d-lg-none"> y Aviso de Privacidad de Datos Personales de Seguros del Pichincha </a></label></div> ',
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    focusConfirm: false,
                    allowEscapeKey: false,
                    preConfirm: () => {
                        var check = document.getElementById("aceptaTerminos")
                        if (!check.checked) {
                            Swal.showValidationMessage(`Necesita marcar casilla de verificación`)
                        }
                    }
                }).then((result) => {
                    updateAceptaTerminos(uid);
                    window.location.href = "#";
                });
            }
        }
    }

    if (idCliente == 108 && window.farmacia) document.getElementById('nombreCompleto').innerHTML = "Medicamentos";
    else if (idCliente == 108 && window.historial) {
        document.getElementById('nombreCompleto').innerHTML = "Historial de atenciones";
        $("#nombreCompleto").css("text-transform", "none");
    }
    else if (window.host.includes("saludtumundoseguro")) document.getElementById('nombreCompleto') ? document.getElementById('nombreCompleto').innerHTML = 'Agendar atención':null;
    else document.getElementById('nombreCompleto') ? document.getElementById('nombreCompleto').innerHTML = persona.nombreCompleto : null;


    document.getElementById('saludoPaciente') ? document.getElementById('saludoPaciente').innerHTML = `${persona.nombre}` : null;


    var iniciales = document.querySelector('.iniciales');
    if (document.querySelector("#fotoPerfil") != null) {
        if (persona.rutaAvatar != "") {
            document.getElementById('fotoPerfil').src = baseUrl + persona.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            document.querySelector('#fotoPerfil').classList.add('d-none');
            iniciales.innerHTML = persona.iniciales;
            iniciales.classList.remove('d-none');

            //document.getElementById('fotoPerfil').src = baseUrlWeb + '/upload/foto_perfil/' + persona.rutaAvatar;
        }
    }
};

export async function personaHome() {

    var parsedUrl = new URL(window.location.href);
    var persona = await personByUser(uid);
    document.getElementById('saludoPaciente').innerHTML = window.host.includes('masproteccionsalud.cl') ? `${persona.nombre.trim()}` : `${persona.nombre}`;
    var divMG = document.getElementById("divMG");
    //if ($("#modal-inicio-benef").length) {
    //    //if ((!persona.acceptNotice && !divMG.hidden) && idCliente != "148") {
    //    //    $('#modalAviso').modal('show');
    //    //}

    //    //if (!persona.acceptNotice)
    //    //    $('#modal-wellness').modal('show');
    //    //(!parsedUrl.hostname.includes("bo.")

    //    if (!persona.acceptNotice && !(idCliente == 148 || idCliente == 108 || idCliente == 260 || idCliente == 242 || parsedUrl.hostname.includes("masproteccionsalud.") || parsedUrl.hostname.includes("saludproteccion.") || parsedUrl.hostname.includes("prevenciononcologica.") || parsedUrl.hostname.includes("clinicamundoscotia.") || parsedUrl.hostname.includes("unabactiva.") || parsedUrl.hostname.includes("clini.") || parsedUrl.hostname.includes("tratame.") || parsedUrl.hostname.includes("saludtumundoseguro.") || parsedUrl.hostname.includes("positiva.") || parsedUrl.hostname.includes("vivetuseguro."))) {
    //        $('#modal-inicio-benef').modal('show');

    //        $("button[id=btnEntendidoBenef]").click(async function () {
    //            await updateEstadoNotice(uid);
    //        });
    //        //await updateEstadoNotice(uid);
    //        //Ocupar esta función al presionar boton del modal  await updateEstadoNotice(uid);
    //        //comentar swal, ocupar logica cambio de estado campo accpet notice
    //        /*swal.fire({
    //            html: `Desde hoy puedes acceder a nuevos servicios en Medismart, pedir exámenes a domicilio, comprar medicamentos, recibirlos en tu casa y acceder a información médica, todo en muy pocos pasos.
    //            <br><br>
    //            <p class="text-center">Úsalos</p>`,
    //            type: 'info',
    //            confirmButtonText: 'Entiendo!',
    //        }).then(async function (result) {
    //            if (result.value) {
    //                await updateEstadoNotice(uid);
    //            }

    //        });*/
    //    }

    //}
};

export async function agendar(verificaUrl) {

    var persona = await personByUser(uid);
    if (verificaUrl) {

        if (!persona.changePassword && (!url.host.includes('uoh.') || !url.host.includes('zurich.') || !url.host.includes('vivetuseguro.'))) {
            swal.fire({
                title: 'Es necesario cambiar password',
                text: "¿Quiere cambiarla ahora?",
                type: 'question',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'Sí, ir a cambiar',
                cancelButtonText: 'Cancelar'
            }).then(async function (result) {
                if (result.value) {
                    window.location.href = "/Paciente/Configuracion";
                }
                else if (result.dismiss == "cancel") {

                }

            });
        }
    }
    //input: 'checkbox',

    document.getElementById('saludoPaciente').innerHTML = persona.nombre;
    var iniciales = document.querySelector('.iniciales');
    if (document.querySelector("#fotoPerfil") != null) {
        if (persona.rutaAvatar != "") {
            document.getElementById('fotoPerfil').src = baseUrl + persona.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            iniciales.classList.remove('d-none');
            document.querySelector('#fotoPerfil').classList.add('d-none');
            iniciales.innerHTML = persona.iniciales;

            //document.getElementById('fotoPerfil').src = baseUrlWeb + '/upload/foto_perfil/' + persona.rutaAvatar;
        }
    }
};
export async function personaFotoPerfil() {
    var persona = await personByUser(uid);
    var iniciales = document.querySelector('.iniciales');
    if (document.querySelector("#fotoPerfil") != null) {
        if (persona.rutaAvatar != "") {
            document.getElementById('fotoPerfil').src = baseUrl + persona.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            iniciales.classList.remove('d-none');
            document.querySelector('#fotoPerfil').classList.add('d-none');
            iniciales.innerHTML = persona.iniciales;

            //document.getElementById('fotoPerfil').src = baseUrlWeb + '/upload/foto_perfil/' + persona.rutaAvatar;
        }
    }

};

export async function personaPaciente(idPaciente) {
    var persona = await personByUser(idPaciente);
    document.getElementById('nombreCompleto').innerHTML = "Reserva de hora a Paciente:  " + persona.nombreCompleto;

};

export async function personaAgenda() {
    var persona = await personByUser(uid);
    document.getElementById('nombreCompleto').innerHTML = "Agenda:  " + persona.nombreCompleto;

    document.getElementById('nombreProfesional').value = persona.nombreCompleto;
    document.getElementById('duracionAtencionProfesionalId').value = persona.duracionAtencionId;
    document.getElementById('duracionAtencionProfesionalMin').value = persona.duracionAtencionMin;
    document.getElementById('correoProfesional').value = persona.correo;
};


export async function datosUsuario() {


    var persona = await personByUser(uid);
    document.getElementById('nombres').value = persona.nombre;
    document.getElementById('nombrePaciente1').innerHTML = persona.nombre;
    document.getElementById('nombrePaciente2').innerHTML = persona.nombre;
    document.getElementById('apellidos').value = persona.apellidoPaterno + " " + persona.apellidoMaterno;
    document.getElementById('email').value = persona.correo;
    document.getElementById('telefono').value = persona.telefonoMovil;
    document.getElementById('rut').value = persona.identificador;
    document.getElementById('fechaNacimiento').value = persona.fNacimiento?moment(persona.fNacimiento).format('DD/MM/YYYY'):'';



};

export async function getRutUsuario() {



    var persona = await personByUser(uid);
    document.getElementById('genero').value = persona.genero;
    document.getElementById('fechaNacimiento').value = moment(persona.fNacimiento).format("YYYY-MM-DD");

    return persona.identificador;

};

export async function setCorreoUsuario() {

    var persona = await personByUser(uid);

    document.getElementById('correoUsuario').value = persona.correo;
    document.getElementById('genero').value = persona.genero;
    document.getElementById('fechaNacimiento').value = moment(persona.fNacimiento).format("YYYY-MM-DD");
    return persona.identificador;

};