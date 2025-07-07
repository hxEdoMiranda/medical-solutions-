import { getArchivoUnico, deleteFile } from '../apis/archivo-fetch.js';

(function () {
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidad"]').value;
    const uid = document.querySelector('[name="uid"]').value;
    $('#kt_dropzone_fotoavatar').dropzone({
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
        acceptedFiles: ".jpeg,.jpg,.png,.gif",
        dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 10MB',
        params: {
            idEntidad,
            codEntidad,
            idUsuario: uid
        },
        thumbnail: function (file, dataUrl) {
            file.acceptDimensions();
        },
        accept: function (file, done) {
            file.acceptDimensions = done;
            file.rejectDimensions = function () { done("Image width or height too big."); };
        },
        init: function () {
            const dropzone = this;
            dropzone.on("queuecomplete", function () {
                ActualizarFotoAvatar(idEntidad, codEntidad, uid);
            });
            dropzone.on("complete", function (file) {
                dropzone.removeFile(file);
            });
        }
    });
})();


async function ActualizarFotoAvatar(idEntidad, codEntidad, uid) {

    

     
    var archivos = await getArchivoUnico(idEntidad, codEntidad);
    //var ruta = baseUrl + archivos[archivos.length - 1].rutaVirtual.replace(/\\/g, '/');
    if (archivos.rutaVirtual != null && archivos.rutaVirtual != "") {
        var ruta;
        document.getElementById('lblFoto').innerHTML = true;
        if (archivos.rutaVirtual != "AvatarMan.jpg" && archivos.rutaVirtual != "AvatarWoman.jpg") {
            ruta = baseUrl + archivos.rutaVirtual.replace(/\\/g, '/');
            document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
        }
        else {
            ruta = 'https://medical.medismart.live/upload/foto_perfil/noPerfil/' + archivos.rutaVirtual;
            document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
        }



        //var ruta = baseUrl + data.personasDatos.fotoPerfil.replace(/\\/g, '/');
        //document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
    }
   
 $("#cargaFoto").hide();
}

