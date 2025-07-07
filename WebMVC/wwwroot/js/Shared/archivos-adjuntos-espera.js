import { getArchivosByIdEntidad, deleteFile } from '../apis/archivo-fetch.js';

var connectionArchivo;

(function () {
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = "ATENCIONES"
    const uid = document.querySelector('[name="uid"]').value;
    
    document.querySelector('#actualizar_archivos').onclick = async () => {
        
        dropzone.options.params = { idEntidad };
        archivoRealTime(idEntidad, codEntidad, uid);
        ActualizarArchivos(idEntidad, codEntidad, uid);
    };

    archivoRealTime(idEntidad, codEntidad, uid);

    window.addEventListener("beforeunload", function (event) {
        if (connectionArchivo.state === signalR.HubConnectionState.Connected) {
            connectionArchivo.invoke('UnsubscribeArchivo', parseInt(idEntidad), codEntidad).catch((err) => {
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
                connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                ActualizarArchivos(idEntidad, codEntidad, uid);
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
        maxFilesize: 3, // MB,
        dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 3MB',
        acceptedFiles: '.jpeg, .png, .xlsx, .docx, .pdf',
        params: {
            idEntidad,
            codEntidad,
            idUsuario: uid
        },

        init: function () {
            const dropzone = this;

            dropzone.on("queuecomplete", function () {
                ActualizarArchivos(idEntidad, codEntidad, uid, "lista_archivos");
                connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
            });

            dropzone.on("complete", function (file) {
                dropzone.removeFile(file);
            });
        }
    });
    // multiple file upload
    $('#kt_dropzone_3').dropzone({
        url: baseUrl + '/agendamientos/archivo/upload',
        paramName: "file", // The name that will be used to transfer the file
        autoProcessQueue: !0,
        addRemoveLinks: !1,
        dictRemoveFile: "Remover",
        dictCancelUpload: "Cancelar carga",
        dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
        uploadMultiple: 1,
        parallelUploads: 2,
        maxFilesize: 3, // MB,
        dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 3MB',
        acceptedFiles: '.jpeg, .png, .xlsx, .docx, .pdf',
        params: {
            idEntidad,
            codEntidad,
            idUsuario: uid
        },

        init: function () {
            
            const dropzone = this;

            dropzone.on("queuecomplete", function () {
                ActualizarArchivos(idEntidad, codEntidad, uid,"lista_archivos_espera");
                connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
            });

            dropzone.on("complete", function (file) {
                dropzone.removeFile(file);
            });
        }
    });
    $('#kt_dropzone_4').dropzone({
        url: baseUrl + '/agendamientos/archivo/upload',
        paramName: "file", // The name that will be used to transfer the file
        autoProcessQueue: !0,
        addRemoveLinks: !1,
        dictRemoveFile: "Remover",
        dictCancelUpload: "Cancelar carga",
        dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
        uploadMultiple: 1,
        parallelUploads: 2,
        maxFilesize: 3, // MB,
        dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 3MB',
        acceptedFiles: '.jpeg, .png, .xlsx, .docx, .pdf',
        params: {
            idEntidad,
            codEntidad,
            idUsuario: uid
        },

        init: function () {

            const dropzone = this;

            dropzone.on("queuecomplete", function () {
                ActualizarArchivos(idEntidad, codEntidad, uid, "lista_archivos_mobile");
                connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
            });

            dropzone.on("complete", function (file) {
                dropzone.removeFile(file);
            });

        }
    });
})();

async function ActualizarArchivos(idEntidad, codEntidad, uid, tipoLista) {
    const rol = document.querySelector('[name="rol"]').value;
    var archivos = await getArchivosByIdEntidad(idEntidad, "");
    const divListaArchivos = document.getElementById(tipoLista);
    while (divListaArchivos.firstChild)
        divListaArchivos.removeChild(divListaArchivos.firstChild);

    archivos.forEach(archivo => {
        if (archivo.codEntidadAsociada == 'ATENCIONES') {
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
                aTitle.href = `${baseUrl}${archivo.rutaVirtual}`;
                aTitle.target = "_blank";
                aTitle.setAttribute('class', 'kt-widget4__title');
                aTitle.innerHTML = archivo.nombre;
                divWidget4Info.appendChild(aTitle);
            }

            const pTexto = document.createElement('p');

            divWidget4Item.appendChild(divWidget4Pic);
            divWidget4Pic.appendChild(iconFile);
            divWidget4Item.appendChild(divWidget4Info);

            divWidget4Info.appendChild(pTexto);

            if (archivo.idUsuario === parseInt(uid) && archivo.estado != "E") {
                const divWidget4Tools = document.createElement('div');
                divWidget4Tools.setAttribute('class', 'kt-widget4__tools');
                const aBtn = document.createElement('a');
                aBtn.href = "#";
                aBtn.setAttribute('class', 'btn btn-clean btn-icon btn-sm eliminar_archivo');
                aBtn.setAttribute('style', 'position: sticky;')
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
                            connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                            aTitle.remove();
                            pTexto.remove();
                            aTitleTexto.setAttribute('class', 'kt-widget4__title');
                            aTitleTexto.setAttribute('style', 'text-decoration:line-through;margin-bottom: 0px;font-weight: 500;color: #c3c6c8;font-size: 14px;');
                            aTitleTexto.innerHTML = archivo.nombre;
                            divWidget4Info.appendChild(aTitleTexto);
                            pTexto.setAttribute('class', 'kt-widget4__text');

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
                //divWidget4Tools.appendChild(aBtn);
                //aBtn.appendChild(iDownload);
            }

            divListaArchivos.appendChild(divWidget4Item);
          

        }
    });
   
}

async function archivoRealTime(idEntidad, codEntidad, uid) {
    connectionArchivo = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/archivoshub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionArchivo.on('ActualizarArchivos', (archivoId) => {
        ActualizarArchivos(idEntidad, codEntidad, uid);
        
    });

    try {
        await connectionArchivo.start();
    } catch (err) {
        
    }

    if (connectionArchivo.state === signalR.HubConnectionState.Connected) {
        
        connectionArchivo.invoke('SubscribeArchivo', parseInt(idEntidad), codEntidad).catch((err) => {
            return console.error(err.toString());
        });
    }
}