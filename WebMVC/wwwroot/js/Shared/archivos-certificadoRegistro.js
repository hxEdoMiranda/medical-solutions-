import { getArchivoUnico, deleteFisico } from '../apis/archivo-fetch.js';

(function () {
     
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidadRegistro"]').value;
    const uid = document.querySelector('[name="uid"]').value;
    $('#kt_dropzone_certificado').dropzone({
        url: baseUrl + '/agendamientos/archivo/upload',
        paramName: "file", // The name that will be used to transfer the file
        autoProcessQueue: !0,
        addRemoveLinks: !1,
        dictRemoveFile: "Remover",
        dictCancelUpload: "Cancelar carga",
        dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
        uploadMultiple: false,
        maxFiles: 1,
        parallelUploads: 1,
        acceptedFiles: ".pdf",
        maxFilesize: 10, // MB,
        dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 10MB',
        params: {
            idEntidad,
            codEntidad,
            idUsuario: uid
        },

        init: function () {
            const dropzone = this;

            dropzone.on("queuecomplete", function () {
                ActualizaArchivoRegistro(idEntidad, codEntidad, uid);
                //connection.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
            });
            dropzone.on("maxfilesexceeded", function (file) {
                this.removeAllFiles();
                this.addFile(file);
            });

            dropzone.on("complete", function (file) {
                dropzone.removeFile(file);
            });
        }
    });



    document.querySelectorAll('.eliminar_archivo_registro').forEach(a => a.onclick = (e) => {
      
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
               let elimina = await deleteFisico(element.dataset.idFile);
                
                if (elimina.status == "OK") {
                    ActualizaArchivoRegistro(idEntidad, codEntidad, uid);
                    swal.fire({
                        position: 'top-right',
                        type: 'success',
                        title: 'Archivo eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                else {
                    swal.fire({
                        position: 'top-right',
                        type: 'error',
                        title: 'No fue posible eliminar el archivo',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
              
            }
        });
        
    });

})();


async function ActualizaArchivoRegistro(idEntidad, codEntidad, uid) {

   
    var archivos = await getArchivoUnico(idEntidad, codEntidad);
    
    if (archivos) {
        $('#urlRegistro').val(archivos.rutaVirtual.replace(/\\/g, '/'));
        $("#cargaCertificado").hide();
        var el = document.getElementById('eliminarCertificadoRegistro');
        el.setAttribute('data-id-file', archivos.id);
        el.setAttribute('data-nombre', archivos.nombre);

        $('#eliminarCertificadoRegistro').show();
    } else {
        $('#urlRegistro').val('');
        $('#eliminarCertificadoRegistro').hide();
    }
    
}

