
import { getArchivoUnico, deleteFile } from '../apis/archivo-fetch.js';


(function () {
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidadFirmaMedico"]').value;
    const uid = document.querySelector('[name="uid"]').value;

    var cropper;
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone('#kt_dropzone_firmamedico',
        {
            autoProcessQueue: false,
            dictDefaultMessage: "",
            url: baseUrl + '/agendamientos/archivo/upload',
            thumbnailWidth: 100,
            thumbnailHeight: 100,
            maxFiles: 1,
            init: function () {
                this.on("queuecomplete", function () {
                ActualizarFirmaMedico(idEntidad, codEntidad, uid);
            });
                this.on("complete", function (file) {
                myDropzone.removeFile(file);
            });
                this.on("sending",
                    function (file, xhr, formData) {
                        formData.append("codEntidad", codEntidad);
                        formData.append("idEntidad", idEntidad);
                        formData.append("idUsuario", uid);
                    });
            }
        }
    );

    ///////////////////////
    // transform cropper dataURI output to a Blob which Dropzone accepts
    var modalTemplate = '' +
        '<div class="modal fade" tabindex="-1" role="dialog">' +
        '<div class="modal-dialog modal-lg" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        //'<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>' +
        '<h4 class="modal-title">Ajustar Imagen</h4>' +
        '</div>' +
        '<div class="modal-body" align="center">' +
        '<div class="row">' +
        '<div class="col-md-12 ">' +
        '<div class="image-container" style="width: 100%; height: 100%;"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>' +
        '<button type="button" class="btn btn-primary crop-upload">Subir</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '';

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
    }

    myDropzone.on('thumbnail',
        function (file) {
            if (file.cropped) {
                return;
            }
            var cachedFilename = file.name;
            myDropzone.removeFile(file);

            var $cropperModal = $(modalTemplate);
            var $uploadCrop = $cropperModal.find('.crop-upload');
            var $img = $('<img id="image" />');
            var reader = new FileReader();
            reader.onloadend = function () {
                // 
                var minCroppedWidth = 400;
                var minCroppedHeight = 200;
                var maxCroppedWidth = 400;
                var maxCroppedHeight = 200;
                $cropperModal.find('.image-container').html($img);
                $img.attr('src', reader.result);
                cropper = new Cropper($img[0],
                    {
                        dragMode: 'move',
                        aspectRatio: 2 / 1,
                        restore: false,
                        autoCropArea: 1,
                        guides: false,
                        center: false,
                        highlight: true,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        
                        toggleDragModeOnDblclick: false,
                        minContainerWidth: minCroppedWidth,
                        minContainerHeight: minCroppedHeight,
                        maxCroppedHeight: maxCroppedHeight,
                        maxCroppedWidth: maxCroppedWidth


                    });
            };

            reader.readAsDataURL(file);
            var canvas;
            $cropperModal.modal('show');
            $uploadCrop.on('click',
                function () {

                    canvas = cropper.getCroppedCanvas({
                        width: 400,
                        height: 200,
                    });

                    var blob = canvas.toDataURL();
                    // 
                    var newFile = dataURItoBlob(blob);
                    newFile.cropped = true;
                    newFile.name = cachedFilename;
                    myDropzone.addFile(newFile);
                    myDropzone.processQueue();
                    $cropperModal.modal('hide');
                });
        });


    function getFileExtension(filename) {
        var a = filename.split(".");
        if (a.length === 1 || (a[0] === "" && a.length === 2)) {
            return "";
        }
        return a.pop();
    }


    //$('#kt_dropzone_firmamedico').dropzone({
    //    url: baseUrl + '/agendamientos/archivo/upload',
    //    paramName: "file", // The name that will be used to transfer the file
    //    autoProcessQueue: !0,
    //    addRemoveLinks: !1,
    //    dictRemoveFile: "Remover",
    //    dictCancelUpload: "Cancelar carga",
    //    dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
    //    uploadMultiple: 1,
    //    parallelUploads: 2,
    //    maxFilesize: 10, // MB,
    //    acceptedFiles: ".png,.gif",
    //    dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 10MB',
    //    params: {
    //        idEntidad,
    //        codEntidad,
    //        idUsuario: uid
    //    },
    //    thumbnail: function (file, dataUrl) {
    //        file.acceptDimensions();
    //    },
       
    //    accept: function (file, done) {
    //        file.acceptDimensions = done;
    //        file.rejectDimensions = function () { done("Image width or height too big."); };
    //    },
    //    init: function () {
    //        const dropzone = this;
    //        dropzone.on("queuecomplete", function () {
    //            ActualizarFirmaMedico(idEntidad, codEntidad, uid);
    //        });
    //        dropzone.on("complete", function (file) {
    //            dropzone.removeFile(file);
    //        });
    //    }
    //});
})();


async function ActualizarFirmaMedico(idEntidad, codEntidad, uid) {

   

     
    var archivos = await getArchivoUnico(idEntidad, codEntidad);
    //var ruta = 'https://localhost:44363/'+ archivos[archivos.length - 1].rutaVirtual.replace(/\\/g, '/');
    var ruta = baseUrl + archivos.rutaVirtual.replace(/\\/g, '/');
    document.getElementById('divFirma').style.backgroundImage = "url(" + ruta + ")";

    $("#cargaFirma").hide();
}



