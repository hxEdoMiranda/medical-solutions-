import { getArchivosByIdEntidad, deleteFisico } from '../apis/archivo-fetch.js';

(function () {
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidadCertificaciones"]').value;
    const uid = document.querySelector('[name="uid"]').value;
    $('#kt_dropzone_certificaciones').dropzone({
        url: baseUrl + '/agendamientos/archivo/upload',
        paramName: "file", // The name that will be used to transfer the file
        autoProcessQueue: !0,
        addRemoveLinks: !1,
        dictRemoveFile: "Remover",
        dictCancelUpload: "Cancelar carga",
        dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
        uploadMultiple: 1,
        parallelUploads: 2,
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
                ActualizarCertificaciones(idEntidad, codEntidad, uid);
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

    document.querySelectorAll('.eliminar_archivo_certificacion').forEach(a => a.onclick = (e) => {
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

                await deleteFisico(element.dataset.idFile);


                ActualizaArchivoRegistro(idEntidad, codEntidad, uid);
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

})();

async function ActualizarCertificaciones(idEntidad, codEntidad, uid) {

    $("#cargaCertificaciones").hide();
}


function eliminarArchivoCert( id) {
     
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidadCertificaciones"]').value;
    const uid = document.querySelector('[name="uid"]').value;
    swal.fire({
        title: 'Eliminar archivo',
        text: "",
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, elimínalo'
    }).then(async function (result) {
        if (result.value) {

            await deleteFisico(id);


            ActualizaArchivoRegistro(idEntidad, codEntidad, uid);
            swal.fire({
                position: 'top-right',
                type: 'success',
                title: 'Archivo eliminado',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


async function GetArchivos(idEntidad, codEntidad) {

    var archivos = await getArchivosByIdEntidad(idEntidad, codEntidad);
    let i = 0;
    let embed;
    
    if (archivos.length != 0) {
        $("#modalBody").empty();
        archivos.forEach(certificaciones => {
            //embed + i.toString();

            var xmlButton = '<div><div class="row"><div class="col-lg-12 col-x-12 pull-right">Eliminar Certificación<button class="btn btn-clean btn-icon btn-sm" onclick="eliminarArchivoCert('+ certificaciones.id+')" data-id-file="' + certificaciones.id + '" data-nombre="' + certificaciones.nombre + '"><i class="flaticon-delete"></i></button></div></div></div>';
            var doc = new DOMParser().parseFromString(xmlButton, "text/xml");
            embed = document.createElement('embed');
            embed.src = baseUrl + certificaciones.rutaVirtual.replace(/\\/g, '/');
            embed.style.width = "100%";
            embed.style.height = "750px";
            document.getElementById('modalBody').appendChild(doc.firstChild.firstChild);
            document.getElementById('modalBody').appendChild(embed);
            document.getElementById('titleModal').innerHTML = 'Certificaciones'

            i++;
        });
        $("#kt_modal_3").modal("show");
    } else
        $("#cargaCertificaciones").toggle();
}


$('#certificaciones').click(function () {
    
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidadCertificaciones"]').value;
    GetArchivos(idEntidad, codEntidad);

});


