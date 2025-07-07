import { getArchivosByIdEntidad, deleteFile } from '../apis/archivo-fetch.js';

var connection;
var rutaDescarga = `${baseUrl}/agendamientos/archivo/DescargarArchivo?id=`;
(function () {
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidad"]').value;
    const uid = document.querySelector('[name="uid"]').value;
    document.querySelector('#actualizar_archivos').onclick = async () => {
        ActualizarArchivos(idEntidad, codEntidad, uid);
    };

    archivoRealTime(idEntidad, codEntidad, uid);

    window.addEventListener("beforeunload", function (event) {
        if (connection.state === signalR.HubConnectionState.Connected) {
            connection.invoke('UnsubscribeArchivo', parseInt(idEntidad), codEntidad).catch((err) => {
                return console.error(err.toString());
            });
        }
    });

    document.querySelectorAll('.eliminar_archivo').forEach(a => a.onclick = (e) => {
        let element = e.target;
        if (!e.target.dataset.idFile) element = e.target.parentElement;
        swal.fire({
            title: 'Eliminar archivo',
            text: element.dataset.nombre,
            type: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, elimínalo'
        }).then(async function (result) {
            if (result.value) {

                await deleteFile(element.dataset.idFile);
                connection.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                ActualizarArchivos(idEntidad, codEntidad, uid);
                mostrarMensajeExito = false;
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
        maxFilesize: 5,
        dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 5MB',
        acceptedFiles: '.jpeg, .jpg, .png, .pdf',
        params: {
            idEntidad,
            codEntidad,
            idUsuario: uid
        },

        init: function () {
            const dropzone = this;
            let mostrarMensajeExito = true;

            dropzone.on("error", function (file, message) {
                if (file.size > dropzone.options.maxFilesize * 1024 * 1024) {
                    // Mostrar Swal solo si el archivo supera el tamaño máximo
                    mostrarMensajeExito = false;
                    Swal.fire({
                        position: 'top-right',
                        type: 'warning',
                        title: 'Su archivo pesa más de 5 MB o formato no corresponde',
                        showConfirmButton: true,
                       
                    });
                    dropzone.removeFile(file);
                }
            });

            dropzone.on("queuecomplete", function () {
                ActualizarArchivos(idEntidad, codEntidad, uid);
                connection.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                if (mostrarMensajeExito) {
                    Swal.fire({
                        position: 'top-right',
                        type: 'success',
                        title: 'Archivo adjuntado correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                mostrarMensajeExito = true;
            });

            dropzone.on("complete", function (file) {
                dropzone.removeFile(file);
            });
        }
    });
})();

async function ActualizarArchivos(idEntidad, codEntidad, uid) {
    const rol = document.querySelector('[name="rol"]').value;
    var archivos = await getArchivosByIdEntidad(idEntidad, "");

    const divListaArchivos = document.getElementById('lista_archivos');
    while (divListaArchivos.firstChild)
        divListaArchivos.removeChild(divListaArchivos.firstChild);

    archivos.forEach(archivo => {
        if (archivo.codEntidadAsociada == codEntidad) {
            
            const divWidget4Item = document.createElement('div');
            divWidget4Item.setAttribute('class', 'kt-widget4__item');
            const divWidget4Pic = document.createElement('div');
            divWidget4Pic.setAttribute('class', 'kt-widget4__pic kt-widget4__pic--icon');
            const iconFile = document.createElement('i');
            iconFile.setAttribute('class', 'flaticon-doc');
            iconFile.setAttribute('style', 'font-size: 2.5rem;');
            const divWidget4Info = document.createElement('div');
            divWidget4Info.setAttribute('class', 'kt-widget4__info');
            const aTitleTexto = document.createElement('p');
            const aTitle = document.createElement('a');
            if (archivo.estado == "E") {
                aTitleTexto.setAttribute('class', '');
                aTitleTexto.setAttribute('style', 'text-decoration:line-through;margin-bottom: 0px;font-weight: 500;color: #c3c6c8;font-size: 14px;');
                aTitleTexto.innerHTML = archivo.nombre;
                divWidget4Info.appendChild(aTitleTexto);
            } else {
                var rutaDes = archivo?.ruta.includes("https") ? archivo.ruta :`${rutaDescarga}${archivo.idenc}`;
                aTitle.href = rutaDes;
                aTitle.target = "_blank";
                aTitle.setAttribute('class', 'kt-widget4__title');
               aTitle.innerHTML = archivo.nombre;
                divWidget4Info.appendChild(aTitle);
            }
            
            const pTexto = document.createElement('p');

                pTexto.setAttribute('class', 'kt-widget4__text');
                if (rol == "Paciente") {
                    
                    pTexto.innerHTML = `${archivo.nombreCompleto} - ${moment(archivo.fechaPaciente).format('DD/MM/YYYY HH:mm:ss')}`;
                }
                else {
                    pTexto.innerHTML = `${archivo.nombreCompleto} - ${moment(archivo.fechaMedico).format('DD/MM/YYYY HH:mm:ss')}`;
                }
                divWidget4Item.appendChild(divWidget4Pic);
                divWidget4Pic.appendChild(iconFile);
                divWidget4Item.appendChild(divWidget4Info);
                
                divWidget4Info.appendChild(pTexto);
           
            if (archivo.idUsuario === parseInt(uid) && archivo.estado !="E") {
                const divWidget4Tools = document.createElement('div');
                divWidget4Tools.setAttribute('class', 'kt-widget4__tools');
                const aBtn = document.createElement('a');
                aBtn.href = "#";
                aBtn.setAttribute('class', 'btn btn-clean btn-icon btn-sm eliminar_archivo');
                aBtn.setAttribute('data-id-file', archivo.id);
                aBtn.onclick = async () => {
                    swal.fire({
                        title: 'Eliminar archivo',
                        text: archivo.nombre,
                        type: 'warning',
                        showCancelButton: true,
                        reverseButtons: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Sí, elimínalo'
                    }).then(async function (result) {
                        if (result.value) {
                            await deleteFile(archivo.id);
                            connection.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                            aTitle.remove();
                            pTexto.remove();
                            aTitleTexto.setAttribute('class', 'kt-widget4__title');
                            aTitleTexto.setAttribute('style', 'text-decoration:line-through;margin-bottom: 0px;font-weight: 500;color: #c3c6c8;font-size: 14px;');
                            aTitleTexto.innerHTML = archivo.nombre;
                            divWidget4Info.appendChild(aTitleTexto);
                            pTexto.setAttribute('class', 'kt-widget4__text');

                            if (rol == "Paciente") {
                                
                                pTexto.innerHTML = `${archivo.nombreCompleto} - ${moment(archivo.fechaPaciente).format('DD/MM/YYYY HH:mm:ss')}`;
                            }
                            else {
                                pTexto.innerHTML = `${archivo.nombreCompleto} - ${moment(archivo.fechaMedico).format('DD/MM/YYYY HH:mm:ss')}`;
                            }
                           
                            divWidget4Info.appendChild(pTexto);
                            divWidget4Tools.remove();
                            swal.fire({
                                position: 'top-right',
                                type: 'success',
                                title: 'Archivo eliminado',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                };
                const iDownload = document.createElement('i');
                iDownload.setAttribute('class', 'flaticon-delete');
                divWidget4Item.appendChild(divWidget4Tools);
                divWidget4Tools.appendChild(aBtn);
                aBtn.appendChild(iDownload);
            }

            divListaArchivos.appendChild(divWidget4Item);
        }
    });
}

async function archivoRealTime(idEntidad, codEntidad, uid) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/archivoshub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connection.on('ActualizarArchivos', (archivoId) => {
        ActualizarArchivos(idEntidad, codEntidad, uid);
        var options = {
            autoClose: true,
            progressBar: true,
            enableSounds: true,
            transition: "slideUpFade",
            sounds: {
                info: "/Toasty.js-master/dist/sounds/info/1.mp3",
                // path to sound for successfull message:
                success: "/Toasty.js-master/dist/sounds/success/1.mp3",
                // path to sound for warn message:
                warning: "/Toasty.js-master/dist/sounds/info/1.mp3",
                // path to sound for error message:
                error: "/Toasty.js-master/dist/sounds/info/1.mp3",
            },
        };

        var toast = new Toasty(options);
        toast.configure(options);

        var notificacion = true;
        const rol = document.querySelector('[name="rol"]').value;
        if (rol == "Paciente" && document.getElementById("cont-vc").getAttribute('class').includes("d-none")) {
            notificacion = false;
        }

        if (!$("#divArchivos").is(":visible") && notificacion) {
            toast.success("Hay un nuevo archivo adjunto");
        }
     });

    try {
        await connection.start();
    } catch (err) {
        
    }    

    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('SubscribeArchivo', parseInt(idEntidad), codEntidad).catch((err) => {
            return console.error(err.toString());
        });
    }
}