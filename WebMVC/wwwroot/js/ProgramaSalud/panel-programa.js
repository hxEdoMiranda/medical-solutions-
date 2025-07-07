import { putEliminarAtencion, confirmaPaciente, reagendarApp, getAgendaMedicoInicial, getMedicosProgramaSaludbyEspecialidad } from '../apis/agendar-fetch.js';
import { getHoraMedicoByCalendar, getAtencionPendienteSala, getProgramaSaludHoras } from '../apis/vwhorasmedicos-fetch.js?1';
import { enviarCitaEniax, cambioEstado } from "../apis/eniax-fetch.js";
import { comprobanteAnulacion, comprobantePaciente } from '../apis/correos-fetch.js?1';
import { putActualizarCambioEspecialista } from '../apis/programa-salud-fetch.js?1';

let baseUrlWeb = new URL(window.location.href);
let connectionBox;
let idMedico;
let cliente;
let parsedUrl = new URL(window.location.href);
let cantAgendada;
let minValidacion = 5;
let idProgramaSaludPaciente;
let idEspecialidad;
let idProgramaSaludEspecialidad;
let datosAtenciones;

export async function init(data) {
    await progresoBarras();
    console.log(data)
    datosAtenciones = data;
    async function progresoBarras() {
        const progressBars = document.getElementsByClassName('progress-bar');
        for (let i = 0; i < progressBars.length; i++) {
            const progressBar = progressBars[i];
            const progress = parseFloat(progressBar.getAttribute('data-progress'));
            const width = Math.min(progress, 100) + '%';
            progressBar.style.width = width;

            if (progress === 0) {
                progressBar.classList.add('progress-bar-empty');
            }

        }
    }

    //Limpiar modal
    $('#modalReagendar').on('hidden.bs.modal', function (e) {
        $("#listaHoras").empty();
        $("#btnConf").empty();
    });

    function formatoReagendarDateConcurrencia(fechaStr) {
        var partesFecha = fechaStr.split(" ");
        var fecha = partesFecha[0];  
        var hora = partesFecha[1]; 

        var partesFecha = fecha.split("/");
        var dia = parseInt(partesFecha[0], 10);
        var mes = parseInt(partesFecha[1], 10) - 1;
        var anio = parseInt(partesFecha[2], 10);
        var partesHora = hora.split(":");
        var hora = parseInt(partesHora[0], 10);
        var minuto = parseInt(partesHora[1], 10);
        var segundo = parseInt(partesHora[2], 10);
        return new Date(anio, mes, dia, hora, minuto, segundo);
    }

    //recurrencia calendario reagendar 
    function calcularFechasDisponiblesReagendar(especialidad, currentDate) {

        let initdate;
        let periocidad;
        let totalTopes;
        let maxCitasPorBloque;

        data.programaSaludAtencionesEspecialidad.forEach(r => {
            if (r.nombre.toLowerCase().trim() === especialidad.toLowerCase().trim()) {
                initdate = r.initDate;
                periocidad = r.periodicidad;
                totalTopes = r.topes;
                maxCitasPorBloque = r.cantidad;
            }
        });

        if (initdate != null) {

            initdate = new Date(initdate);

            const msPorDia = 24 * 60 * 60 * 1000;

            let frecuenciaEnDias;
            let inicioBloque;
            switch (periocidad) {
                case 'S':
                    frecuenciaEnDias = 7;
                    inicioBloque = new Date(initdate);
                    inicioBloque.setDate(initdate.getDate() - (initdate.getDay() + 6) % 7);
                    break;
                case 'M':
                    frecuenciaEnDias = 30;
                    inicioBloque = new Date(initdate);
                    inicioBloque.setDate(1);
                    break;
                case 'Q':
                    frecuenciaEnDias = 15;
                    inicioBloque = new Date(initdate);
                    if (inicioBloque.getDate() <= 15) {
                        inicioBloque.setDate(1);
                    } else {
                        inicioBloque.setDate(16);
                    }
                    break;
            }

            const bloques = [];
            let inicioActual = new Date(inicioBloque);

            for (let i = 0; i < totalTopes; i++) {
                const bloque = [];
                for (let j = 0; j < frecuenciaEnDias; j++) {
                    const fechaBloque = new Date(inicioActual);
                    fechaBloque.setDate(inicioActual.getDate() + j);
                    bloque.push(fechaBloque.toISOString().substr(0, 10));
                }
                bloques.push(bloque);
                inicioActual.setDate(inicioActual.getDate() + frecuenciaEnDias);
            }

            const fechaActual = new Date(currentDate);
            const bloqueActual = Math.floor((fechaActual - inicioBloque) / (frecuenciaEnDias * msPorDia));

            return { bloques, bloqueActual };

        }
        return null;
    }

     //Reagendar atencion
     $('.ps-a-reagendar').on('click', async function (event) {
         var idMedico = $(this).data('idmedico');
         var fechaConvenio = $(this).data('fecha');
         var idConvenio = $(this).data('idconvenio');
         var idAtencion = $(this).data('idatencion');
         var nombreMedico = $(this).data('nombremedico');
         let especialidad = $(this).data('especialidad');

         const dateCurrent = formatoReagendarDateConcurrencia(fechaConvenio);

         const respuesta = calcularFechasDisponiblesReagendar(especialidad, dateCurrent);
         const bloqueformato = [];
         if (respuesta != null) {
             const { bloques, bloqueActual } = respuesta;
             bloques[bloqueActual].forEach(function (fechaOriginal) {
                 var fechaObjeto = new Date(fechaOriginal);
                 var nuevaFechaFormateada = fechaObjeto.toISOString().slice(0, 19);
                 bloqueformato.push(nuevaFechaFormateada);
             });
         }
         // Llamar a la función para reagendar pasando los valores necesarios
         await dataCalendar(idConvenio, fechaConvenio, idAtencion, idMedico, bloqueformato);
         document.getElementById('nombreprofesional').innerHTML = `Dr(a) ${nombreMedico}`;
         $('#modalReagendar').modal('show');
        });

    //Cancelar atencion
    $('.ps-a-cancelar').on('click', function () {
            var idAtencion = $(this).data('idatencion');
            var cobrar = $(this).data('cobrar').toString();
            var foto = $(this).data('foto');
            var fecha = $(this).data('fecha').toString();
            var hora = $(this).data('hora');
            var nombreMedico = $(this).data('nombremedico');
            var especialidad = $(this).data('especialidad');

            if (cobrar.toLowerCase() === "true") {
                Swal.fire("Esta atención no se puede cancelar", "Para cancelar esta atención comunícate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                return;
            }
            var fechaFormateada = "";
            if (fecha) {
                fechaFormateada = moment(fecha, "DD/MM/YYYY").format("DD-MM-YYYY");
            }

            document.getElementById('fotoMedicoModal').src = foto;
            document.getElementById('nombreProfesionalModal').innerHTML = nombreMedico;
            document.getElementById('tituloMedicoModal').innerHTML = especialidad;
            document.getElementById('fechaAtencionModal').innerHTML = fechaFormateada;
            document.getElementById('horaAtencionModal').innerHTML = hora;

            if (foto.includes('Avatar.svg'))
                foto = "/img/avatar-medico.png";

            document.getElementById('imgModalAgendarCancela').src = foto;
            $(".fecha_modal").html('<i class="fal fa-calendar-alt"></i> ' + fechaFormateada + ' / ' + hora);
            $(".medico_modal").html('<b>' + nombreMedico + '</b>');
            $(".especialidad_modal").html(especialidad);

            $('#modalControlAtencionAgendadaCancela').modal('show');
            $(".btnAnulaAtencionx").show();

            $('#btnAnulaAtencionx').on('click', async function () {
                var valida = await putEliminarAtencion(idAtencion, uid);
                if (valida.status !== "NOK") {
                    $('#modalControlAtencionAgendadaCancela').modal('hide');
                    Swal.fire("¡Atención anulada!", "La atención ha sido anulada exitosamente.", "success");
                    await cambioEstado(idAtencion.toString(), "E") // E = Anulada
                    await comprobanteAnulacion(valida.atencion);
                    location.reload();
                }
                else {
                    Swal.fire('', 'No fue posible cancelar esta atención, comuníquese con mesa de ayuda', 'error');
                }

                await actualizaNumeroAtenciones();
            });

    });




    //seguimiento reagendar y cancelar
    document.addEventListener('DOMContentLoaded', () => {
        //Reagendar atencion
        $('.ps-a-reagendarSeguimiento').on('click', async function (event) {
            var idMedico = $(this).data('idmedico');
            var fechaConvenio = $(this).data('fecha');
            var idConvenio = $(this).data('idconvenio');
            var idAtencion = $(this).data('idatencion');
            var nombreMedico = $(this).data('nombremedico');
            let especialidad = $(this).data('especialidad');

            const dateCurrent = formatoReagendarDateConcurrencia(fechaConvenio);

            const respuesta = calcularFechasDisponiblesReagendar(especialidad, dateCurrent);
            const bloqueformato = [];

            if (respuesta != null) {
                const { bloques, bloqueActual } = respuesta;
                bloques[bloqueActual].forEach(function (fechaOriginal) {
                    var fechaObjeto = new Date(fechaOriginal);
                    var nuevaFechaFormateada = fechaObjeto.toISOString().slice(0, 19);
                    bloqueformato.push(nuevaFechaFormateada);
                });
            }
            // Llamar a la función para reagendar pasando los valores necesarios
            await dataCalendar(idConvenio, fechaConvenio, idAtencion, idMedico, bloqueformato);
            document.getElementById('nombreprofesional').innerHTML = `Dr(a) ${nombreMedico}`;
            $('#modalReagendar').modal('show');
        });

        //Cancelar atencion
        $('.ps-a-cancelarSeguimiento').on('click', function () {
            var idAtencion = $(this).data('idatencion');
            var cobrar = $(this).data('cobrar').toString(); // Convertir a string
            var foto = $(this).data('foto');
            var fecha = $(this).data('fecha')?.toString();
            var hora = $(this).data('hora');
            var nombreMedico = $(this).data('nombremedico');
            var especialidad = $(this).data('especialidad');

            if (cobrar.toLowerCase() === "true") {
                Swal.fire("Esta atención no se puede cancelar", "Para cancelar esta atención comunícate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                return;
            }

            var fechaFormateada = moment(fecha, "DD/MM/YYYY").format("DD-MM-YYYY");

            document.getElementById('fotoMedicoModal').src = foto;
            document.getElementById('nombreProfesionalModal').innerHTML = nombreMedico;
            document.getElementById('tituloMedicoModal').innerHTML = especialidad;
            document.getElementById('fechaAtencionModal').innerHTML = fechaFormateada;
            document.getElementById('horaAtencionModal').innerHTML = hora;

            if (foto.includes('Avatar.svg'))
                foto = "/img/avatar-medico.png";

            document.getElementById('imgModalAgendarCancela').src = foto;
            $(".fecha_modal").html('<i class="fal fa-calendar-alt"></i> ' + fechaFormateada + ' / ' + hora);
            $(".medico_modal").html('<b>' + nombreMedico + '</b>');
            $(".especialidad_modal").html(especialidad);

            $('#modalControlAtencionAgendadaCancela').modal('show');
            $(".btnAnulaAtencionx").show();

            $('#btnAnulaAtencionx').on('click', async function () {
                var valida = await putEliminarAtencion(idAtencion, uid);
                if (valida.status !== "NOK") {
                    $('#modalControlAtencionAgendadaCancela').modal('hide');
                    Swal.fire("¡Atención anulada!", "La atención ha sido anulada exitosamente.", "success");
                    await cambioEstado(idAtencion.toString(), "E") // E = Anulada
                    await comprobanteAnulacion(valida.atencion);
                }
                else {
                    Swal.fire('', 'No fue posible cancelar esta atención, comuníquese con mesa de ayuda', 'error');
                }

                await actualizaNumeroAtenciones();
            });

        });
    })



    async function setProgressCircle(progress) {
        const progressCircle = document.querySelector('.progress-circle__fill');
        progressCircle.style.transform = `rotate(${progress * 3.6}deg)`;
    }
    const porcentaje = data.porcentaje;
    await setProgressCircle(porcentaje);

    const botonAgendar = document.getElementById("agendarAtencion");
    botonAgendar?.addEventListener("click", function () {
        const url = `/programaSalud/Agenda_2?idPrograma=${data.programaSalud.id}`;
        window.location.href = url;
    });

    showTab('interconsultas');
    setActiveButton(document.getElementById('interconsultas-tab'));
    const interconsultasTab = document.getElementById("interconsultas-tab");
    const medicamentosTab = document.getElementById("medicamentos-tab");
    const examenesTab = document.getElementById("examenes-tab");

    interconsultasTab.addEventListener("click", function () {
        showTab('interconsultas');
        setActiveButton(interconsultasTab);
    });

    medicamentosTab.addEventListener("click", function () {
        showTab('medicamentos');
        setActiveButton(medicamentosTab);
    });

    examenesTab.addEventListener("click", function () {
        showTab('examenes');
        setActiveButton(examenesTab);
    });

    function showTab(tabName) {
        var tabs = document.getElementsByClassName('pcronico-detalles');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].style.display = 'none';
        }

        var selectedTab = document.getElementById(tabName);
        selectedTab.style.display = 'block';
    }

    function setActiveButton(activeButton) {
        var buttons = document.getElementsByClassName('pcronico-buttons')[0].getElementsByTagName('button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('pcronico-active-button');
        }
        activeButton.classList.add('pcronico-active-button');
    }

    idProgramaSaludPaciente = data.idProgramaSaludPaciente;


    //seguimiento
    const historialList = data.historialAtenciones;
    const agendadasList = data.proximasHorasPaciente;
    const dataSeguimiento = {};

    [...historialList, ...agendadasList].forEach(item => {
        const doctorName = item.nombreMedico;

        if (!dataSeguimiento[doctorName]) {
            dataSeguimiento[doctorName] = {
                especialidad: item.especialidad,
                historial: [],
                agendadas: []
            };
        }

        if (historialList.includes(item)) {
            dataSeguimiento[doctorName].historial.push(item);
        } else if (agendadasList.includes(item)) {
            dataSeguimiento[doctorName].agendadas.push(item);
        }
    });


    const daysOfWeek = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
   
    const seguimientoDiv = document.querySelector('.panel-seguimiento#tab2');
    let html = '';
    const doctorSessionCounters = {};

    if (Object.keys(dataSeguimiento).length === 0) {
        html = '<p>No hay datos de seguimiento disponibles.</p>';
    } else {

        for (const doctorName in dataSeguimiento) {
            const doctorData = dataSeguimiento[doctorName];
            doctorSessionCounters[doctorName] = 1;
            let urlPhoto = baseUrl;
            if (doctorData.agendadas.length > 0) {
                urlPhoto = `${urlPhoto}${doctorData.agendadas[0].fotoPerfil}`
            } else {
                data.timelineData.forEach(dt => {
                    if (doctorName === dt.nombreMedico) {
                        urlPhoto = `${urlPhoto}${dt.fotoPerfil}`;
                    }
                })


            }

            const nombreCompleto = doctorName;
            const partesNombre = nombreCompleto.split(' ');
            const nombre = partesNombre[0];
            const primerApellido = partesNombre[1];


            html += `
        <div class="caja-general-seccion mb-1 mt-4">
            <h5>${doctorData.especialidad}</h5>
            <div class="secciones-horizontal">
                <div class="caja-seccion">
                    <div class="user-seguimiento">
                        <div class="foto-user-seguimiento">
                            <img src=${urlPhoto} alt="">
                          </div>
                        <div class="data-user">
                            <div class="nombre-user ps-nombre-medico">
                                Dr. ${nombre} ${primerApellido}. 
                            </div>
                            <div class="sub-data ps-especialidad-medico mt-4">
                                ${doctorData.especialidad}
                            </div>
                        </div>
                    </div>
                </div>`;

            doctorData.historial.forEach((historia, index) => {
                const fecha = new Date(historia.inicioAtencion);
                const diaSemana = daysOfWeek[fecha.getDay()];
                const diaMes = fecha.getDate();
                const mes = months[fecha.getMonth()];
                const hora = fecha.toLocaleString('es-CL', { hour: 'numeric', minute: 'numeric', hour12: true });
                html += `
            <div class="seguimiento">
                <div class="pestana">
                    <span>Sesión ${doctorSessionCounters[doctorName]}</span>
                </div>
                <div class="info-seguimiento">
                    <div class="ps-proximas-atenciones__fechas">
                       <div style="width: max-content;"> <img src="/img/programa-salud/fa-calendar-ps-gray.svg" />${diaSemana} ${diaMes} de ${mes}</div>
                       <div> <img src="/img/programa-salud/fa-clock-ps-gray.svg" />${hora}</div>
                        <div class="estado-seguimiento">REALIZADO</div>
                    </div>
                </div>
            </div>
        `; doctorSessionCounters[doctorName]++;
            });

            doctorData.agendadas.forEach((agendada, index) => {
                const fecha = new Date(agendada.fecha);
                const diaSemana = daysOfWeek[fecha.getDay()];
                const diaMes = fecha.getDate();
                const mes = months[fecha.getMonth()];
                const hora = fecha.toLocaleString('es-CL', { hour: 'numeric', minute: 'numeric', hour12: true });
                const idAgendar = "btnAgendar" + agendada.idAtencion;

                //formatear fecha 

                const diaf = fecha.getDate();
                const mesf = fecha.getMonth() + 1;
                const añof = fecha.getFullYear();
                const horasf = fecha.getHours();
                const minutosf = fecha.getMinutes();
                const segundosf = fecha.getSeconds();
                const diaFormateado = diaf < 10 ? '0' + diaf : diaf;
                const mesFormateado = mesf < 10 ? '0' + mesf : mesf;
                const horasFormateadas = horasf < 10 ? '0' + horasf : horasf;
                const minutosFormateados = minutosf < 10 ? '0' + minutosf : minutosf;
                const segundosFormateados = segundosf < 10 ? '0' + segundosf : segundosf;
                const fechaFormateada = diaFormateado + '/' + mesFormateado + '/' + añof + ' ' + horasFormateadas + ':' + minutosFormateados + ':' + segundosFormateados;

                html += `
            <div class="seguimiento">
                <div class="pestana">
                    <span>Sesión ${doctorSessionCounters[doctorName]}</span>
                </div>
                <div class="info-seguimiento">
                    <div class="agenda-seguimiento-activa">
                        <div style="width: max-content;"><img src="/img/programa-salud/fa-calendar-ps.svg" />${diaSemana} ${diaMes} de ${mes}</div>
                        <div><img src="/img/programa-salud/fa-clock-ps.svg" />${hora}</div>
                        <div class="seguimiento-hora-agendada">
                            <div class="ahref-seguimiento">
                                <u><a href="javascript:void(0);" class="ps-a-cancelarSeguimiento" data-idatencion="${agendada.idAtencion}" data-cobrar="${agendada.cobrar}" data-foto="${agendada.fotoPerfil}" data-fecha="${fechaFormateada}"
                                   data-hora="${agendada.horaDesdeText}"
                                   data-nombremedico="${agendada.nombreMedico}"
                                   data-especialidad="${agendada.especialidad}" >Cancelar Hora</a></u>
                            </div>
                             <button class="ps-a-reagendarSeguimiento" id="${idAgendar}" data-idmedico="${agendada.idMedico}" data-cliente="${agendada.idCliente}" data-fecha="${fechaFormateada}" data-idconvenio="${agendada.idConvenio}" data-idatencion="${agendada.idAtencion}" data-nombremedico="${agendada.nombreMedico}" data-especialidad="${agendada.especialidad}" >Reagendar Hora</button>
                        </div>
                    </div>
                </div>
            </div>
        `; doctorSessionCounters[doctorName]++;
            });

            html += `   </div>
            <div class="linea-horizontal"></div>
        </div>
    `;
        }
    }
    seguimientoDiv.innerHTML = html;
}


//recurrencia en calendario
function calcularFechasDisponibles(especialidadActual) {

    let initdate;
    let periocidad;
    let totalTopes;
    let maxCitasPorBloque;
    let atencionesProximas = [];
    let atencionesRealizadas = [];


    datosAtenciones.programaSaludAtencionesEspecialidad.forEach(r => {
        if (r.nombre.toLowerCase().trim() === especialidadActual.toLowerCase().trim()) {
            initdate = r.initDate;
            periocidad = r.periodicidad;
            totalTopes = r.topes;
            maxCitasPorBloque = r.cantidad;
        }
    });


    if (initdate != null) {

        initdate = new Date(initdate);

        datosAtenciones.historialAtenciones.forEach(h => {
            if (h.especialidad.toLowerCase().trim() === especialidadActual.toLowerCase().trim()) {
                atencionesRealizadas.push(h.inicioAtencion);
            }
        });
        datosAtenciones.proximasHorasPaciente.forEach(p => {
            if (p.especialidad.toLowerCase().trim() === especialidadActual.toLowerCase().trim()) {
                atencionesProximas.push(p.fecha)
            }
        });

        initdate = new Date("Tue Sep 8 2023");

        const msPorDia = 24 * 60 * 60 * 1000;

        let frecuenciaEnDias;
        let inicioBloque;
        switch (periocidad) {
            case 'S':
                frecuenciaEnDias = 7;
                inicioBloque = new Date(initdate);
                inicioBloque.setDate(initdate.getDate() - (initdate.getDay() + 6) % 7); // Restar días para llegar al lunes
                break;
            case 'M':
                frecuenciaEnDias = 30;
                inicioBloque = new Date(initdate);
                inicioBloque.setDate(1);
                break;
            case 'Q':
                frecuenciaEnDias = 15;
                inicioBloque = new Date(initdate);
                if (inicioBloque.getDate() <= 15) {
                    inicioBloque.setDate(1);
                } else {
                    inicioBloque.setDate(16);
                }
                break;
        }

        const bloques = [];
        let inicioActual = new Date(inicioBloque);

        for (let i = 0; i < totalTopes; i++) {
            const bloque = [];
            for (let j = 0; j < frecuenciaEnDias; j++) {
                const fechaBloque = new Date(inicioActual);
                fechaBloque.setDate(inicioActual.getDate() + j);
                bloque.push(fechaBloque.toISOString().substr(0, 10));
            }
            bloques.push(bloque);
            inicioActual.setDate(inicioActual.getDate() + frecuenciaEnDias);
        }


        // Determinar el bloque actual
        const fechaActual = new Date();
        const bloqueActual = Math.floor((fechaActual - inicioBloque) / (frecuenciaEnDias * msPorDia));

        // Bloquear bloques con citas
        const citasBloqueadas = [...atencionesProximas, ...atencionesRealizadas].map(cita => cita.substr(0, 10));
        const bloquesOcupados = [];

        for (let i = 0; i < bloques.length; i++) {
            const bloque = bloques[i];
            const citasEnBloque = citasBloqueadas.filter(cita => bloque.includes(cita));
            if (citasEnBloque.length >= maxCitasPorBloque) {
                bloquesOcupados.push(i);
            }
        }

        // Encontrar el próximo bloque libre
        let proximoBloqueLibre = bloqueActual;
        while (bloquesOcupados.includes(proximoBloqueLibre)) {
            proximoBloqueLibre++;
        }

        return { bloques, bloqueActual, bloquesOcupados, proximoBloqueLibre };

    }
    return null;
}

$('.ps-cambiar-profesional').on('click', function () {
    $('#cambiarPro').modal('show');
    idEspecialidad = $(this).data('idespecialidad');
    idProgramaSaludEspecialidad = $(this).data('idprogramasaludespecialidad');
});

$('#cerrarModalUno').on('click', function () {
    $('#cambiarPro').modal('hide');
});

$('#abrirSegundoModal').on('click', async function () {
    debugger
    var segundoModal = document.getElementById('segundoModal');
    var proSugeridosList = segundoModal.querySelector('.pro-sugeridos-list');

    $('#cambiarPro').modal('hide');

    var medicosDisponibles = await getMedicosProgramaSaludbyEspecialidad(idEspecialidad);
    proSugeridosList.innerHTML = '';
    medicosDisponibles.forEach(function (medico) {
        var proSugerido = document.createElement('div');
        proSugerido.className = 'pro-sugerido mb-2 mt-2';

        var fotoUser = document.createElement('div');
        fotoUser.className = 'foto-user-seguimiento';
        fotoUser.innerHTML = `<img src="${medico.fotoPerfil}" alt="" />`;

        var nombrePro = document.createElement('p');
        nombrePro.className = 'nombre-pro-sugerido';
        nombrePro.textContent = medico.nombreMedico;

        var especialidadPro = document.createElement('div');
        especialidadPro.textContent = medico.especialidad;

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.addEventListener('change', function () {
            medicosDisponibles.forEach(function (otherMedico) {
                otherMedico.checkbox.checked = false;
            });
            medico.checkbox.checked = true;
        });

        medico.checkbox = checkbox;

        proSugerido.appendChild(fotoUser);
        proSugerido.appendChild(nombrePro);
        proSugerido.appendChild(especialidadPro);
        proSugerido.appendChild(checkbox);
        proSugeridosList.appendChild(proSugerido);


    });

    $('#cambiarEspecialista').on('click', async function () {
        debugger
        var medicoSeleccionado = medicosDisponibles.find(function (medico) {
            return medico.checkbox.checked;
        });

        if (medicoSeleccionado) {
            var datosEspecialidad = {
                id: idProgramaSaludEspecialidad,
                idMedico: medicoSeleccionado.idMedico
            };
            await putActualizarCambioEspecialista(datosEspecialidad);
            Swal.fire("¡Cambio de profesional!", "Has cambiado tu profesional.", "success");
            $('#segundoModal').modal('hide');
            location.reload();
        } else {
            alert('Selecciona por favor un médico');
        }
    });

    $('#segundoModal').modal('show');
});



$('.ps-agendar').on('click', function () {
    debugger
    var idMedico = $(this).data('idmedico');
    var idEspecialidad = $(this).data('idespecialidad');
    var nombreEspecialidad = $(this).data('especialidad');

    // Calcular la fecha del día siguiente
    var fechaHoy = new Date();
    var fechaManana = new Date(fechaHoy);
    fechaManana.setDate(fechaHoy.getDate() + 1);

    // Obtener el idProgramaSaludPaciente como un entero
    var idProgramaSaludPaciente = parseInt(window.idProgramaSaludPaciente);

    var queryParams = {
        idMedico: idMedico,
        fechaPrimeraHora: formatDate(fechaManana), // Formatear la fecha
        m: 1,
        r: 2,
        c: 26,
        especialidad: idEspecialidad,
        tipoatencion: 'suscripcion',
        isProgramaSalud: true,
        idPrograma: idPrograma
    };

    //set de bloque concurrencia
    const respuestaConcurrencia = calcularFechasDisponibles(nombreEspecialidad);
    let bloqueformato = [];

    if (respuestaConcurrencia != null) {
        const { bloques, bloqueActual, bloquesOcupados, proximoBloqueLibre } = respuestaConcurrencia;
        bloques[proximoBloqueLibre].forEach(function (fechaOriginal) {
            var fechaObjeto = new Date(fechaOriginal);
            var nuevaFechaFormateada = fechaObjeto.toISOString().slice(0, 19);
            bloqueformato.push(nuevaFechaFormateada);
        });
    }
    localStorage.setItem("concurrencia", JSON.stringify({ bloquelibre: bloqueformato }));
    debugger

    var queryString = $.param(queryParams);
    if (idEspecialidad == 33) {
        var url = "Agenda_2?" + queryString;
    }
    else {
        var url = "Agenda_2?" + queryString;
    }

    window.location.href = url;
});

// Función para formatear la fecha como "YYYY-MM-DDTHH:mm:ss"
function formatDate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate + 'T00:00:00';
}

async function dataCalendar(idConvenio, fecha, idAtencion, idMedico, bloquedates = []) {
    var rangoIni;
    var rangoFin;
    var ultimaHoraLista;
    var spanSelectorHorasR;
    var spanSelectorHorasL;
    var seleccion = false;
    var idMedicoHoraSeleccionada = 0;
    var idMedicoSeleccionada = 0;
    var idBloqueHoraSeleccionada = 0;
    var fechaSeleccionSeleccionada = "";
    var horaSeleccionada = "";

    var fechaSeleccion = moment();


    //limpieza
    document.getElementById("btnHorario").innerHTML = "";
    document.getElementById("btnConf").innerHTML = "";
    document.getElementById('rowDatePicker').innerHTML = "";


    let btnMañana = document.createElement("button")
    btnMañana.setAttribute("id", "btnManana");
    btnMañana.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-am mr-3");
    btnMañana.innerHTML = "Mañana"
    document.getElementById("btnHorario").appendChild(btnMañana);


    let btnTarde = document.createElement("button")
    btnTarde.setAttribute("id", "btnTarde");
    btnTarde.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-pm");
    btnTarde.innerHTML = "Tarde"

    document.getElementById("btnHorario").appendChild(btnTarde);

    let buttonInside = document.createElement("button");
    buttonInside.setAttribute("id", "btnConfirmarHora");
    buttonInside.setAttribute('class', 'btn btn-success btn-sm');
    buttonInside.innerHTML = "Confirmar Hora";
    document.getElementById("btnConf").appendChild(buttonInside);

    let row = document.getElementById('rowDatePicker');
    let drop = document.createElement('div');
    drop.setAttribute('class', 'cont-datepicker');
    drop.setAttribute('id', 'kt_datepicker_6');
    row.appendChild(drop);
    var fechaSeleccionEstatica = moment();
    var fechaSeleccion = moment();

    $('#kt_datepicker_6').datepicker('setDate', fechaSeleccion._d).datepicker('fill');
    //$('.new').hide() //oculta los días del mes siguiente, con la clase.new
    await pintaCalendar();

    async function pintaCalendar() {
        //obtener la data de los dias con la fecha seleccionada desde calendario
        var diasConAgenda = await getHoraMedicoByCalendar(idMedico, moment(fechaSeleccion).format('YYYYMMDD'), idConvenio, moment(fechaSeleccionEstatica).format('YYYYMMDD'), uid);
        document.querySelectorAll('.day').forEach(el => {
            el.classList.remove('active')
            el.classList.remove('today')
        })
        if (bloquedates.length > 0) {
            diasConAgenda.forEach(itemDias => {
                var dia = itemDias.info;
                var mes = itemDias.fecha;
                if (moment(mes).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD")) {
                    if (bloquedates.includes(mes)) {
                        comparaDias(dia, mes)
                    }
                }
            })
        } else {
            diasConAgenda.forEach(itemDias => {
                var dia = itemDias.info;
                var mes = itemDias.fecha;
                if (moment(mes).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD")) {
                        comparaDias(dia, mes)
                    }
            })
        }
        document.querySelectorAll('.day').forEach(el => {
            /*en caso de cualquier inconveniente volver a una version anterior del calendario, y ocultar los días nuevos con la clase .new, los dias con clase
             .old, no se pueden ocultar ya que se pierde el orden en las columnas.*/
            //todo dia del calendario que en el paso de comparacion haya quedado distinto a activo, ya sea porque no cayo en el dia con horas, quedara desactivado
            if (!el.getAttribute('class').includes('active')) {
                el.classList.add('disabled');
            }
            if (el.classList.contains('active') && el.innerHTML == new Date().getDate()) {
                el.classList.add('today');
            } else {
                el.classList.remove('today');
            }
            //el dia actual siempre quedara activo por defecto
            /*if (el.getAttribute('class').includes('today')) {
                el.classList.remove('disabled');
                el.classList.add('active');
            }*/
        })
    }
    function comparaDias(dia, mes) {
        document.querySelectorAll('.day').forEach(item => {
            var a = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("YYYY"); //año fecha seleccionada
            var ac = moment(mes).format('YYYY'); // año compara, desde fecha de bd

            var m = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("MM"); //mes fecha seleccionada
            var mc = moment(mes).format('MM'); //mes fecha desde bd
            if (dia == item.innerHTML && m == mc && a == ac) {
                /*solo se pintan los dias que pertenezcan al dia, 
                mes y año de la fecha que se selecciono, los demas dias quedan desactivados en el siguiente paso*/
                if (!item.getAttribute('class').includes('new') && !item.getAttribute('class').includes('old')) {
                    var d = moment().format('D');
                    if (item.innerHTML == d && m == moment().format("MM") && a == moment().format("YYYY")) {
                        item.classList.add('today');
                    }
                    item.classList.add('active');
                }

            }

        })
    }


    let initValue = 0;

    var horario = true;


    // Busqueda inicial
    var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
    var agendaMedico = await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"), idMedico, horario, true, idConvenio, uid);

    //await cargarInfoMedico(dataMedico);
    document.getElementById('listaHoras').innerHTML = "";

    try {
        var agendaIterar = agendaMedico.slice(initValue, 4);
        if (agendaMedico.length)
            rangoHora(agendaMedico);
        await cargaTituloHorario(agendaIterar[0]);

        agendaIterar.forEach(iterarAgendas);
    } catch (e) {
    }



    // Fin Busqueda inicial

    $('#btnManana').on('click', async function (ev) {
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        reloadData(true);
    });

    $('#btnTarde').on('click', async function (ev) {
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        reloadData(false);
        // await pintaCalendar();
    });

    $('#kt_datepicker_6').datepicker().on('changeDate', async function (ev) {

        //reseteamos parametros seleccionados
        document.querySelectorAll('.day').forEach(el => {
            el.classList.remove('active')
            el.classList.remove('today')
        })
        seleccion = false;
        idMedicoHoraSeleccionada = 0;
        idMedicoSeleccionada = 0;
        idBloqueHoraSeleccionada = 0;
        fechaSeleccionSeleccionada = "";
        horaSeleccionada = "";
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();

        reloadData(horario);
        await pintaCalendar();
    });

    $('#kt_datepicker_6').datepicker().on('changeMonth', async function (ev) {
        //reseteamos parametros seleccionados
        seleccion = false;
        idMedicoHoraSeleccionada = 0;
        idMedicoSeleccionada = 0;
        idBloqueHoraSeleccionada = 0;
        fechaSeleccionSeleccionada = "";
        horaSeleccionada = "";
        fechaSeleccion = moment(moment(ev.date).format("YYYY-MM-DD HH:mm:ss")).startOf('month').format("YYYY-MM-DD HH:mm:ss");
        await pintaCalendar();
    });

    function filtrarHorarios(agendaMedico, manana, tipoHorario = 0) {
        return agendaMedico
	/*.filter(item => {
            const hora = moment(item.horaDesdeText, 'HH:mm');
            const esHorarioManana = hora.isBefore(moment('12:00', 'HH:mm'));
            return manana === esHorarioManana
        });*/
    }

    async function reloadData(manana) {
        horario = manana;
        initValue = 0;
        var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        agendaMedico = await getProgramaSaludHoras(idMedico, moment(fechaSeleccion).format('YYYYMMDD'), 26, moment(fechaSeleccionEstatica).format('YYYYMMDD'), uid);
        document.getElementById('listaHoras').innerHTML = "";
        const horariosFiltrados = filtrarHorarios(agendaMedico, manana);
        const agendaIterar = horariosFiltrados.slice(initValue, 4);
        if (agendaIterar.length) {
            rangoHora(agendaIterar);
            await cargaTituloHorario(agendaIterar[0]);
            agendaIterar.forEach(iterarAgendas);
        } else {
            MensajeSinHoras();
        }
    }

    async function MensajeSinHoras() {


        document.getElementById("headerSeleccion").innerHTML = "";

        let divDataHorario = document.createElement('div');
        divDataHorario.classList.add('data-horario');


        let spanTituloDataHorario = document.createElement('span');
        spanTituloDataHorario.classList.add('titulo-data-horario');
        spanTituloDataHorario.innerHTML = "No hay horas disponibles en este momento. Vuelva a intentarlo";
        divDataHorario.appendChild(spanTituloDataHorario);

        document.getElementById("headerSeleccion").appendChild(divDataHorario);
    }
    async function cargaTituloHorario(medico) {
        document.getElementById("headerSeleccion").innerHTML = "";

        let divDataHorario = document.createElement('div');
        divDataHorario.classList.add('data-horario');
        divDataHorario.classList.add('col-lg-8');

        let spanTituloDataHorario = document.createElement('div');
        spanTituloDataHorario.classList.add('titulo-data-horario');

        spanTituloDataHorario.innerHTML = "Agenda " + medico.textoHorario + " " + moment(fechaSeleccion).format("DD-MM-YYYY");

        let rangoHorario = document.createElement('div');
        rangoHorario.classList.add('rango-horario');


        rangoHorario.innerHTML = `De ${rangoIni} Hrs. a ${rangoFin} hrs.`


        divDataHorario.appendChild(spanTituloDataHorario);
        spanTituloDataHorario.appendChild(rangoHorario);

        let divHorario = document.createElement('div');
        divHorario.classList.add('horario');

        spanSelectorHorasL = document.createElement('span');
        spanSelectorHorasL.classList.add('selector-horas');
        spanSelectorHorasL.classList.add('mr-2');

        let spanIconoL = document.createElement('i');
        spanIconoL.classList.add('fas');
        spanIconoL.classList.add('fa-chevron-circle-left');
        spanSelectorHorasL.appendChild(spanIconoL);

        spanSelectorHorasL.addEventListener("click", async function () {

            initValue = initValue - 4;
            if (initValue < 0) {

                initValue = 0;
                spanSelectorHorasL
            }

            document.getElementById('listaHoras').innerHTML = "";

            var agendaIterar = agendaMedico.slice(initValue, initValue + 4);


            await cargaTituloHorario(agendaIterar[0]);


            agendaIterar.forEach(iterarAgendas);
        });

        divHorario.appendChild(spanSelectorHorasL);



        let spanHoraTop = document.createElement('span');
        spanHoraTop.classList.add('hora-top');
        spanHoraTop.setAttribute("id", "spanHoraTop");
        spanHoraTop.innerHTML = moment(moment(fechaSeleccion).format("YYYY-MM-DD" + "T" + medico.horaDesdeText)).startOf('hour').format("HH:mm");
        divHorario.appendChild(spanHoraTop);


        spanSelectorHorasR = document.createElement('span');
        spanSelectorHorasR.classList.add('selector-horas');

        let spanIcono = document.createElement('i');
        spanIcono.classList.add('fas');
        spanIcono.classList.add('fa-chevron-circle-right');
        spanSelectorHorasR.appendChild(spanIcono);

        spanSelectorHorasR.addEventListener("click", async function () {
            initValue = initValue + 4;
            if (initValue > (agendaMedico.length - 4)) {
                initValue = agendaMedico.length - 4;
            }
            document.getElementById('listaHoras').innerHTML = "";

            var agendaIterar = agendaMedico.slice(initValue, initValue + 4);
            await cargaTituloHorario(agendaIterar[0]);


            agendaIterar.forEach(iterarAgendas);

        });

        divHorario.appendChild(spanSelectorHorasR);

        document.getElementById("headerSeleccion").appendChild(divDataHorario);
        document.getElementById("headerSeleccion").appendChild(divHorario);
    }

    async function iterarAgendas(medico, index, array) {

        let liHoraMedico = document.createElement('li');
        liHoraMedico.classList.add('hora');

        if (medico.nombrePaciente === "Disponible" || medico.estadoAtencion == "E") {
            if (idMedicoHoraSeleccionada.toString() === medico.idMedicoHora.toString())
                liHoraMedico.classList.add('seleccionado');
            else
                liHoraMedico.classList.add('disponible');
        }


        else
            liHoraMedico.classList.add('ocupado');


        liHoraMedico.setAttribute('data-idMedicoHora', medico.idMedicoHora);
        liHoraMedico.setAttribute('data-idMedico', medico.idMedico);
        liHoraMedico.setAttribute('data-idBloqueHora', medico.idBloqueHora);
        if (medico.nombrePaciente == "Disponible")
            liHoraMedico.setAttribute('data-estado', medico.nombrePaciente);
        else if (medico.estadoAtencion == "E")
            liHoraMedico.setAttribute('data-estado', "Disponible");
        liHoraMedico.setAttribute('data-horaText', medico.horaDesdeText);

        let spanHoraMedico = document.createElement('span');
        spanHoraMedico.classList.add('detalle-hora');
        spanHoraMedico.innerHTML = medico.horaDesdeText;

        //quitar flecha izquiera cuando la hora de inicio de la lista sea igual a la primera hora de atención del medico
        if (medico.horaDesdeText == agendaMedico[0].horaDesdeText) {
            spanSelectorHorasL.setAttribute("style", "display:none;")
        }

        //quitar flecha derecha cuando la ultima hora de la lista sea igual a la ultima hora de atención del médico.
        if (medico.horaDesdeText == agendaMedico[agendaMedico.length - 1].horaDesdeText) {
            spanSelectorHorasR.setAttribute("style", "display:none;")
        }
        else {
            spanSelectorHorasR.setAttribute("style", "display:block;")

        }
        liHoraMedico.appendChild(spanHoraMedico);


        let spanEstado = document.createElement('span');
        spanEstado.classList.add('estado-hora');

        let smallEstado = document.createElement('small');
        smallEstado.classList.add('estado-hora');

        if (idMedicoHoraSeleccionada.toString() === medico.idMedicoHora.toString())
            smallEstado.innerHTML = "Seleccionado";
        else if (medico.estadoAtencion == "E")
            smallEstado.innerHTML = "Disponible";
        else
            smallEstado.innerHTML = medico.nombrePaciente;



        spanEstado.appendChild(smallEstado);
        liHoraMedico.appendChild(spanEstado);


        liHoraMedico.addEventListener("click", async function () {

            var targetElement = event.target || event.srcElement;
            var liHora = targetElement.closest('.hora');
            var idMedicoHora = liHora.getAttribute('data-idMedicoHora');
            var idMedico = liHora.getAttribute('data-idMedico');
            var idBloqueHora = liHora.getAttribute('data-idBloqueHora');
            var estado = liHora.getAttribute('data-estado');
            var horaText = liHora.getAttribute('data-horaText');


            if (estado === "Disponible") {
                var fechaSeleccion = moment($("#kt_datepicker_6").data('datepicker').getDate())
                    .format("YYYY-MM-DD HH:mm:ss");


                document.querySelectorAll('.seleccionado').forEach(function (li) {
                    li.classList.remove('seleccionado');
                    li.classList.add('disponible');
                });

                document.querySelectorAll('.estado-hora > small').forEach(function (small) {
                    if (small.innerHTML !== "Ocupado")
                        small.innerHTML = "Disponible";

                });


                liHora.classList.remove("disponible");
                liHora.classList.add('seleccionado');


                liHora.querySelectorAll('.estado-hora > small').forEach(function (small) {

                    small.innerHTML = "Seleccionado";

                });
                idMedicoHoraSeleccionada = idMedicoHora;
                idMedicoSeleccionada = idMedico;
                idBloqueHoraSeleccionada = idBloqueHora;
                fechaSeleccionSeleccionada = fechaSeleccion;
                horaSeleccionada = horaText;
                seleccion = true;
            } else {
                Swal.fire("", "Horario no disponible", "warning");
            }
        });


        document.getElementById('listaHoras').appendChild(liHoraMedico);


    }
    async function guardarAtencion(idMedico, idBloqueHora, fechaSeleccion, idMedicoHora, uid) {
        let clientId = parseInt(idCliente);
        //Verificamos si existe atencion
        debugger;
        let agendar = {
            id: parseInt(idAtencion),
            idBloqueHora: parseInt(idBloqueHora),
            fechaText: fechaSeleccion,
            triageObservacion: '',
            antecedentesMedicos: '',
            idPaciente: uid,
            SospechaCovid19: false,
            IdMedicoHora: parseInt(idMedicoHora),
            IdCliente: clientId ? clientId : 0,
            idProgramaSalud: parseInt(window.idProgramaSaludPaciente),
            isProgramaSalud: true
        };




        let resultado = await reagendarApp(agendar, idMedico, uid);

        if (resultado.err == 1) {
            return 1;
        }
        else if (resultado.err == 2) {
            return 2;
        }
        else {

            return resultado;
        }


    }

    document.getElementById("btnConfirmarHora").addEventListener("click", async function () {
        if (!seleccion) {
            Swal.fire("", "Debe seleccionar una hora", "warning");
            return;
        } else {
            $('#btnConfirmarHora').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            //Swal.fire("",idMedicoHoraSeleccionada + idAtencion+ idBloqueHoraSeleccionada,"question")

            let valida = await guardarAtencion(idMedicoSeleccionada,
                idBloqueHoraSeleccionada,
                moment(fechaSeleccion).format("DD-MM-YYYY"),
                idMedicoHoraSeleccionada,
                uid);
            if (valida.err == 1) {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
            else if (valida.err == 2) {
                Swal.fire("Error!", "Esta hora ya fue tomada, favor seleccionar otra hora", "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
            else if (valida.err == 3) {
                Swal.fire("Error!", valida.msg, "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }

            else {
                // document.querySelector(".fecha" + idAtencion).innerHTML = moment(fechaSeleccion).format("DD/MM/YYYY")
                // document.querySelector(".hora" + idAtencion).innerHTML = horaSeleccionada;
                $(".fechaHora_" + idAtencion).html(moment(fechaSeleccion).format("DD/MM/YYYY") + ' | ' + horaSeleccionada);

                await comprobantePaciente(baseUrlWeb, valida.atencionModel);
                if (!window.host.includes('unabactiva.') &&
                    !window.host.includes('activa.unab.') &&
                    !window.host.includes('achs.') &&
                    !window.host.includes('uoh')) {
                    //await enviarCitaEniax(valida.infoAtencion.idAtencion);
                    await cambioEstado(idAtencion, "E") // E = Anulada
                }
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                $('#modalReagendar').modal('hide');
                Swal.fire("Hora Reagendada", `Tú hora ha sido reagendada para el día  ${moment(fechaSeleccion).format("DD/MM/YYYY")} a las ${horaSeleccionada} hrs.`, "success")
                location.reload();
            }



        }


    });
    function rangoHora(agendaMedico) {
        rangoIni = agendaMedico[0].horaDesdeText
        rangoFin = agendaMedico[agendaMedico.length - 1].horaDesdeText;
    }

}