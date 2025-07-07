import { getArchivosByIdEntidad, deleteFile } from '../apis/archivo-fetch.js';

var rutaDescarga = `${baseUrl}/agendamientos/archivo/DescargarArchivo?id=`;
(function() {
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidad"]').value;
    const uid = document.querySelector('[name="uid"]').value;
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

    var KTDropzoneDemo = function () {
        var demo0 = function () {
        // multiple file upload
        $('#kt_dropzone_0').dropzone({
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
            acceptedFiles: 'image/*, application/pdf',
            params: {
                idEntidad,
                codEntidad,
                idUsuario: uid
            },
            init: function () {

                const dropzone = this;

                dropzone.on("queuecomplete", function () {
                    ActualizarArchivos(idEntidad, codEntidad, uid);
                });

                dropzone.on("complete", function (file) {
                    dropzone.removeFile(file);
                });

            }
        });
    }
        return {
            // public functions
            init: function () {
                demo0();
            }
        };
    }();
    KTUtil.ready(function () {
        KTDropzoneDemo.init();
    });
    async function ActualizarArchivos(idEntidad, codEntidad, uid, tipoLista) {
        //
        const rol = "Paciente";
        var archivos = await getArchivosByIdEntidad(idEntidad, "");
        const divListaArchivos = document.getElementById('lista_archivos');
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
                    var rutaDes = `${rutaDescarga}${archivo.idenc}`;
                    aTitle.href = rutaDes;
                    aTitle.target = "_blank";
                    aTitle.setAttribute('class', 'kt-widget4__title');
                    aTitle.setAttribute('style', 'font-size: 10px;');
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
                    aBtn.setAttribute('class', 'btn btn-sm eliminar_archivo');
                    aBtn.setAttribute('style', 'position: sticky;')
                    aBtn.setAttribute('data-id-file', archivo.id);

                    aBtn.onclick = async () => {
                        await deleteFile(archivo.id);
                        divWidget4Item.remove()
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Archivo eliminado',
                            showConfirmButton: false,
                            timer: 1500
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
})();

