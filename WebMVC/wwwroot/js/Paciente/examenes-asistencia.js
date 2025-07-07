import { addHistorialExamenesOrientacion, getRegiones, getComunas, getExamenes } from "../apis/examenes-fetch.js?rnd=9";
import { saludoPaciente } from '../shared/info-user.js?rds=3';
import { enviarExamenesAsistencia } from '../apis/correos-fetch.js';
import { logPacienteViaje } from '../apis/personas-fetch.js';

var codigoPais = 'CL'
var max_fields = 10;
var wrapper = $(".form-group-input");
var add_button = $(".file-select");
var bloodhoundExamenes;
var bloodhoundCiudades;
var bloodhoundComunas;
var ListCodigoExamenes = [];
let region;
let comuna;
var dataLocalizacion = null;
var isMedical = 1
var query = " ";
let x = 0;
async function cargarExamenes(idInput) {
    codigoPais = window.codigoTelefono;
    //if (window.host.includes('wedoctorsmx.')) {
    //    codigoPais = 'MX';
    //}

    //else
    query = '%QUERY%';
    if (window.host.includes('clinicamundoscotia.') || window.host.includes('prevenciononcologica.') || window.host.includes('masproteccionsalud.') || window.host.includes('saludtumundoseguro.') || window.host.includes('wedoctorsmx.')) {
        isMedical = 0;
        if (codigoPais === "MX" && !window.host.includes('essilorluxottica.')) {
            if (window.host.includes('cardif.')) {
                bloodhoundExamenes = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: baseUrl + `/agendamientos/Examenes/getAsistenciaExamenes/${query}/${codigoPais}/${window.idCliente}/${isMedical}`,
                        wildcard: '%QUERY%',
                    },
                });
            } else {
                bloodhoundExamenes = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: baseUrl + `/agendamientos/Examenes/getExamenesWowMx/${query}/${codigoPais}`,
                        wildcard: '%QUERY%',
                    },
                });
            }
        } else {
            bloodhoundExamenes = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: baseUrl + `/agendamientos/Examenes/getAsistenciaExamenes/${query}/${codigoPais}/${window.idCliente}/${isMedical}`,
                    wildcard: '%QUERY%',
                },
            });
        }
    }

    $('#input_codigoExamen_' + idInput).typeahead({
        hint: false,
        highlight: true,
        minLength: 0
    }, {
        name: 'codigos',
        source: bloodhoundExamenes,
        limit: 20,
        display: function (item) {
            return item.codigo + '–' + item.nombre;
        }
    })
    if (window.host.includes('essilorluxottica.') || window.host.includes('vivetuseguro.') || window.host.includes('cardif.')) {
        var inputCodigo = $('#input_codigoExamen_' + idInput);
        inputCodigo.on('typeahead:select', function (e, datum) {
            if (ListCodigoExamenes.includes(datum.id)) {
                Swal.fire(
                    'Error seleccion',
                    'Este elemento ya esta seleccionado',
                    'info'
                )
            } else {
                var selectedOptionsContainer = $('.selected-options');
                var selectedOption = $('<div class="selected-option" data-id="' + datum.id + '">' + datum.nombre + '<span class="remove-option">×</span></div>');
                selectedOptionsContainer.append(selectedOption);
                ListCodigoExamenes.push(datum.id);
            }
            $(this).typeahead('val', ''); // Limpiar el input después de la selección

        }).on('click', function () {
            $(this).typeahead('val', '');
            $(this).typeahead('open');

        });

        $(document).on('click', '.remove-option', function () {
            var removedId = $(this).parent().data('id');
            $(this).parent().remove();
            var indice = ListCodigoExamenes.indexOf(removedId); // obtenemos el indice
            ListCodigoExamenes.splice(indice, 1);
        });
    } else {
        var inputCodigo = $('#input_codigoExamen_' + idInput);
        inputCodigo.bind("typeahead:selected", function (obj, datum, name) {
            const inputExamen = document.getElementById("input_codigoExamen_" + idInput);
            inputExamen.setAttribute('data-id', datum.id);
            ListCodigoExamenes.push(datum.id);

        });
    }



}
async function cargarCiudades() {
    var regiones = await getRegiones(codigoPais);
    var ListRegiones = $("#listaRegion");
    regiones.forEach(item => {
        ListRegiones.append('<option value="' + item.idCiudad + '">' + item.ciudad + '</option>');
    })
}

var btnExamCancel = document.getElementById("btnExamCancel");
    btnExamCancel?.addEventListener("click", async function () {
        try {
            const formData = {
                IdPaciente: window.uid,
                Evento: "NO EXAMEN",
                Info: "Cancelacion de examen",
                IdCliente: parseInt(window.idCliente)
            }
            const resultado = await logPacienteViaje(formData);
            if (resultado.status == "OK") {
                location.href = location.origin + "/AsistenciaTomaExamenes/CancelacionExamenes"
            }
        } catch { }

        
    })

async function cargarComunas(codigo) {
    var comuna = await getComunas(codigo, codigoPais);
    var ListComunas = $("#listaComunas");
    ListComunas.find('option').remove().end().append('<option value="0">Seleccionar...</option>');
    comuna.forEach(item => {
        ListComunas.append('<option value="' + item.idComunas + '">' + item.comuna + '</option>');
    })
}

export async function init(data) {
    saludoPaciente();
    cargarExamenes(0);
    cargarCiudades();

    var region = document.getElementById("listaRegion");
    if (region && region != null) {
        region.onchange = async () => {
            if (region.value > 0) {
                await cargarComunas(region.value);
            }
        }
    }

    //var x = 1;
    $(add_button).click(function (e) {
        e.preventDefault();
        if (x < max_fields) {
            if (window.host.includes("vivetuseguro.")) {

                let inputCodigoExamen = $('#input_codigoExamen_' + x);
                if (inputCodigoExamen.length) {
                    let valorInput = inputCodigoExamen.val().trim();
                    if (valorInput !== '') {
                        $('#listaTipoExamen').append('<li>' + valorInput + ' <a onclick="eliminarInput(' + x + ')" href="#" class="remove_field">Eliminar</a></li>');

                        // Limpia el input
                        inputCodigoExamen.val('');
                    }
                }
            } else {
                $(wrapper).append('<div id="divExamen_' + x + '" class="typeahead"><input class="form-control" placeholder="Buscar por palabra clave" id="input_codigoExamen_' + x + '" type="text" dir="ltr"> <a onclick="eliminarInput(' + x + ')" href="#" class="remove_field">Eliminar</a></div ><ul id="listaTipoExamen"></ul>');
                //$(wrapper).append('<div class="typeahead" id="divExamen_' + x + '"> <select class= "form-control" id = "listaExamenesScotia_'+x+'" name = "regiones" > <option value="0">Seleccionar...</option></select ></div >');
            }
            cargarExamenes(x);
            x++;
        } else {
            alert('You Reached the limits')
        }
    });


    if ($("#btnAsistencia").length) {
        let btnAsistencia = document.getElementById('btnAsistencia');

        btnAsistencia.onclick = async () => {
            let region = $('#listaRegion').find(":selected").val() ?? "0";
            let comuna = $('#listaComunas').find(":selected").val() ?? "0";

            if (region == "0" || comuna == "0") {
                Swal.fire({
                    title: '!Debes seleccionar una región y comuna!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', '', 'success')
                    } else if (result.isCancel) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
                return false;
            }
            var especialidad = 'orientacion';
            if (window.host)
                especialidad = 'examenes'
            if (!window.host.includes('essilorluxottica.')) {
                ListCodigoExamenes = [];
                var i = 0;
                while (document.getElementById('input_codigoExamen_' + i)) {

                    let examenValue = document.getElementById('input_codigoExamen_' + i).getAttribute('data-id');
                    if (examenValue)
                        ListCodigoExamenes.push(parseInt(examenValue));
                    i++;
                }
            }
            if (ListCodigoExamenes.length < 1) {
                Swal.fire({
                    title: '!Debes seleccionar al menos un exámen!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                })

                return false;
            }
            let examenes = {
                IdUsuario: window.uid,
                Ciudad: parseInt(region),
                Comuna: parseInt(comuna),
                Examenes: ListCodigoExamenes
            };
            await addHistorialExamenesOrientacion(examenes);

            window.location.href = '/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=' + especialidad;
        }
    }

    if ($("#btnCallAsistencia").length) {
        let btnCallAsistencia = document.getElementById('btnCallAsistencia');


        btnCallAsistencia.onclick = async () => {
            let region = $('#listaRegion').find(":selected").val() ?? "0";
            let comuna = $('#listaComunas').find(":selected").val() ?? "0";

            if (region == "0" || comuna == "0") {
                Swal.fire({
                    title: '!Debes seleccionar una región y comuna!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', '', 'success')
                    } else if (result.isCancel) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
                return false;
            }
            if (!window.host.includes('essilorluxottica.') && !window.host.includes('cardif.')) {
                ListCodigoExamenes = [];
                var i = 0;
                while (document.getElementById('input_codigoExamen_' + i)) {

                    let examenValue = document.getElementById('input_codigoExamen_' + i).getAttribute('data-id');
                    if (examenValue)
                        ListCodigoExamenes.push(parseInt(examenValue));
                    i++;
                }
            }
            if (ListCodigoExamenes.length < 1) {
                Swal.fire({
                    title: '!Debes seleccionar al menos un exámen!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                })

                return false;
            }
            let examenes = {
                id: 0,
                IdUsuario: window.uid,
                Ciudad: parseInt(region),
                Comuna: parseInt(comuna),
                Examenes: ListCodigoExamenes
            };
            await addHistorialExamenesOrientacion(examenes);
            window.location.href = 'tel:' + window.num
        }
    }

    if ($("#btnAgendar").length) {
        let btnAgendar = document.getElementById('btnAgendar');


        btnAgendar.onclick = async () => {
            let region = $('#listaRegion').find(":selected").val() ?? "0";
            let comuna = $('#listaComunas').find(":selected").val() ?? "0";

            if (region == "0" || comuna == "0") {
                Swal.fire({
                    title: '!Debes seleccionar una región y comuna!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', '', 'success')
                    } else if (result.isCancel) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
                return false;
            }
            if (!window.host.includes('essilorluxottica.') && !window.host.includes('cardif.')) {
                ListCodigoExamenes = [];
                var i = 0;
                while (document.getElementById('input_codigoExamen_' + i)) {

                    let examenValue = document.getElementById('input_codigoExamen_' + i).getAttribute('data-id');
                    if (examenValue)
                        ListCodigoExamenes.push(parseInt(examenValue));
                    i++;
                }
            }
            if (ListCodigoExamenes.length < 1) {
                Swal.fire({
                    title: '!Debes seleccionar al menos un exámen!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                })

                return false;
            }

            let examenes = {
                id: 0,
                IdUsuario: window.uid,
                Ciudad: parseInt(region),
                Comuna: parseInt(comuna),
                Examenes: ListCodigoExamenes,
                IdEmpresa: parseInt(idCliente)
            };
            var result = await addHistorialExamenesOrientacion(examenes);
            if (result.status == "OK") {
                await enviarExamenesAsistencia(result.idHistorial, uid);
                window.location.href = '/AsistenciaTomaExamenes/ReservaExitosa';
            }
        }
    }

    if ($("#buttonPagos").length) {
        let btnPagos = document.getElementById('buttonPagos');
        btnPagos.onclick = async () => {
            let region = $('#listaRegion').find(":selected").val() ?? "0";
            let comuna = $('#listaComunas').find(":selected").val() ?? "0";
            let idHistorialExamen = 0;
            let redirectUrl = "";
            debugger
            if (region == "0" || comuna == "0") {
                Swal.fire({
                    title: '!Debes seleccionar una región y comuna!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', '', 'success')
                    } else if (result.isCancel) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
                return false;
            }
            if (ListCodigoExamenes.length < 1) {
                Swal.fire({
                    title: '!Debes seleccionar al menos un exámen!',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                })

                return false;
            }
            debugger
            let examenes = {
                id: 0,
                IdUsuario: window.uid,
                Ciudad: parseInt(region),
                Comuna: parseInt(comuna),
                Examenes: ListCodigoExamenes,
                IdEmpresa: parseInt(idCliente),
                WowMx: true
            };
            var result = await addHistorialExamenesOrientacion(examenes);
            if (result.status == "OK") {
                idHistorialExamen = result.idHistorial;
                redirectUrl = '/ResumenExamenesPago?idHistorialExamenAtencion=' + idHistorialExamen;
                window.location.href = redirectUrl;
            }
            else {
                Swal.fire({
                    title: 'Se ha producido un error al guardar los examenes.',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true
                })
                return false;
            }
            //region = parseInt(region);
            //comuna = parseInt(comuna);
            //let examenes = ListCodigoExamenes.join(',');   
        }
    }

    function eliminarInput(index) {
        $('#divExamen_' + index).remove();

        if (window.host.includes("vivetuseguro")) {
            // Si el host contiene "vivetuseguro", también elimina el elemento de la ul
            let ul = $('#listaTipoExamen');
            if (ul.children().length > 0) {
                ul.children().eq(index).remove();
            }
        }
    }
}
