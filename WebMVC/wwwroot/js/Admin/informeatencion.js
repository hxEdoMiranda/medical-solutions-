import { enviarInforme, enviarInformeMedico } from '../apis/correos-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js";
import { createReport, apiFarmacia, getAtencion, guardarPharol } from "../apis/atencion-fetch.js";
import { cambioEstado } from "../apis/eniax-fetch.js";
import { logPacienteViaje } from '../apis/personas-fetch.js?6';
import { getArchivosByIdEntidad, deleteFile } from '../apis/archivo-fetch.js';
export async function init(data) {

    await personaFotoPerfil();
    let page = document.getElementById('page');
    page.innerHTML = "Informe de atención";
    page.setAttribute('style', '');
    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    if (typeof(estadoEniax) != 'undefined' && estadoEniax == "False") {
        if (!data.atencion.nsp) {
			
            await cambioEstado(idAtencion.toString(), "T") // o PAC?? -- Paciente Asiste a cita, por ahora deje T --Informe Listo
            await cambioEstado(idAtencion.toString(), "PAC")
            var log = {
                IdPaciente: data.atencion.idPaciente,
                Evento: "Envio data a eniax cita terminada",
                Info: "id atencion" + data.atencion.id,
                IdAtencion: data.atencion.id
            }
            await logPacienteViaje(log);
        }
        else {
            await cambioEstado(idAtencion.toString(), "PA") // PA = Paciente Ausente
        }
    }

    initEliminarArchivo(idAtencion, uid.value);

    if ($("#btnEnviarInforme").length) {
        document.querySelector('#btnEnviarInforme').onclick = async() => {
            Swal.fire({
                title: "Enviar Informe de Atención",
                text: `¿Desea enviar el informe?`,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                confirmButtonText: "Sí, Enviar",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.value) {
                    $('#btnEnviarInforme').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
                    var result = await enviarInforme(idAtencion, baseUrlWeb);
                    await enviarInformeMedico(idAtencion, baseUrlWeb);
                    if (result.status === "OK") {
                        Swal.fire({
                            title: "Éxito!",
                            text: "Se envió el informe de forma exitosa",
                            type: "success",
                            confirmButtonText: "OK",
                        });
                    }
                    else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    }
                    $('#btnEnviarInforme').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                }
            });
        };

    }

    if ($('#kt_dropzone_2').length)
    {
        const idEntidad = idAtencion;
        const codEntidad = "ATENCIONES-PERITAJES-ADJUNTO";
        // multiple file upload
        $('#kt_dropzone_2').dropzone({
            url: baseUrl + '/agendamientos/archivo/upload',
            paramName: "file", // The name that will be used to transfer the file
            autoProcessQueue: !0,
            addRemoveLinks: !1,
            dictRemoveFile: "Remover",
            dictCancelUpload: "Cancelar carga",
            dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
            uploadMultiple: 1,
            parallelUploads: 2,
            maxFilesize: 10, // MB,
            dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 10MB',
            acceptedFiles: '.jpeg, .png, .xlsx, .docx, .pdf',
            params: {
                idEntidad,
                codEntidad,
                idUsuario: uid.value
            },

            init: function () {
                const dropzone = this;

                dropzone.on("queuecomplete", function () {
                    ActualizarArchivos(idEntidad, 'ATENCIONES', uid.value);
                });

                dropzone.on("complete", function (file) {
                    dropzone.removeFile(file);
                });
            }
        });
    }
}

async function ActualizarArchivos(idEntidad, codEntidad = '', uid) {
    const rutaDescarga = `${baseUrl}/agendamientos/archivo/DescargarArchivo?id=`;
    const archivos = await getArchivosByIdEntidad(idEntidad, codEntidad);
    const aHtml = [];

    aHtml.push('<div class="legend-resumen">Archivos de la Atenci&oacute;n</div>');

    for (const archivo of archivos) {
        aHtml.push('<div class="archivos-atencion">');
            aHtml.push('<ul>');
                if (archivo.estado != "E" && archivo.codEntidadAsociada != "ATENCIONES-PERITAJES" && archivo.codEntidadAsociada != "ATENCIONES-PERITAJES-NSP" && archivo.codEntidadAsociada != "ATENCIONES-PERITAJES-ADJUNTO")
                {
                    aHtml.push('<li>');
                        aHtml.push('<div class="tipo-archivo">');
                            aHtml.push(archivo.Nombre);
                        aHtml.push('</div>');
                        aHtml.push(`<button onclick="location.href='${rutaDescarga}${archivo.idenc}'" class="btn-archivo">`);
                            aHtml.push('<i class="fal fa-file-pdf"></i>');
                        aHtml.push('</button>');
                    aHtml.push('</li>');
                }
                else if (archivo.codEntidadAsociada == "ATENCIONES-PERITAJES" || archivo.codEntidadAsociada == "ATENCIONES-PERITAJES-NSP" || archivo.codEntidadAsociada == "ATENCIONES-PERITAJES-ADJUNTO")
                {
                    aHtml.push('<li>');
                        aHtml.push('<div class="tipo-archivo">');
                            aHtml.push(archivo.nombre);
                        aHtml.push('</div>');
                        aHtml.push('<div class="btn-group" role="group">');
                            aHtml.push(`<button onclick="location.href='${rutaDescarga}${archivo.idenc}'" class="btn-archivo" style=" background-color: transparent;  border-radius: 4px;  color: #285394;">`);
                                aHtml.push('<i class="fal fa-file-word"></i>');
                            aHtml.push('</button>');
                        if (archivo.idUsuario == parseInt(uid) && archivo.codEntidadAsociada == "ATENCIONES-PERITAJES-ADJUNTO") {
                            aHtml.push(`<button data-id="${archivo.id}" data-nombre="${archivo.nombre}" class="btn-archivo eliminar-archivo" style="background-color: transparent; border-radius: 4px;">`);
                                aHtml.push('<i class="fal fa-trash-alt"></i>');
                            aHtml.push('</button>');
                        }
                        aHtml.push('</div>');
                    aHtml.push('</li>');
                }
                else
                {
                    aHtml.push('<li>');
                        aHtml.push('<div class="tipo-archivo">');
                            aHtml.push(archivo.nombre);
                        aHtml.push('</div>');
                        aHtml.push('<button class="btn-archivo">');
                            aHtml.push('<i class="fal fa-file-pdf"></i>');
                        aHtml.push('</button>');
                    aHtml.push('</li>');
                }
            aHtml.push('</ul>');
            aHtml.push('<p class="kt-widget4__text">');
                aHtml.push(`${archivo.nombreCompleto} - ${archivo.fechaMedico.toString()}`);
            aHtml.push('</p>');
        aHtml.push('</div>');
    }

    if (archivos.length == 0) {
        aHtml.push('<div id="pnlArchivos" class="align-self-center" style="display:block">');
            aHtml.push('<div class="row">');
                aHtml.push('<div class="col-lg-12 kt-align-center">');
                    aHtml.push('<img src="/metronic_demo7/assets/media/sinResultado.PNG" />');
                aHtml.push('</div>');
            aHtml.push('</div>');
            aHtml.push('<div class="row">');
                aHtml.push('<div class="col-lg-12 text-center" >');
                    aHtml.push('<h5>No existen archivos asociados a esta atención.</h5>');
                aHtml.push('</div>');
            aHtml.push('</div>');
        aHtml.push('</div>');
    }

    // Limpiar listado
    $(".columna-archivos").empty();
    $(".columna-archivos").html(aHtml.join(''));

    initEliminarArchivo(idEntidad, uid);
}

function initEliminarArchivo(idEntidad, uid) {
    $('.columna-archivos .eliminar-archivo').off().click(function () {
        const id = $(this).data('id');
        const nombre = $(this).data('nombre');

        swal.fire({
            title: 'Eliminar archivo',
            text: nombre,
            type: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, elimínalo'
        }).then(async function (result) {
            if (result.value) {
                Swal.showLoading()
                await deleteFile(id);
                await ActualizarArchivos(idEntidad, 'ATENCIONES', uid);
                Swal.hideLoading()
                swal.fire({
                    position: 'top-right',
                    type: 'success',
                    title: 'Archivo eliminado',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
}