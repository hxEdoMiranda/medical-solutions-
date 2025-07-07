import { EditFichaMedico, InsertNumeroLicenciaPerito } from "../apis/personas-fetch.js";

export async function init(data) {

    let page = document.getElementById('page');
    page.innerHTML = "Configuración de cuenta";
    page.setAttribute('style', '')

    let CertificadoRegistroPDF = null;

    if (data.personas.rutaAvatar != null) {
        var ruta;
        if (!data.personas.rutaAvatar.includes('Avatar.svg')) {
            ruta = baseUrl + data.personas.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            ruta = baseUrlWeb + '/upload/foto_perfil/' + data.personas.rutaAvatar;
        }
        document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";


        //var ruta = baseUrl + data.personasDatos.fotoPerfil.replace(/\\/g, '/');
        //document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
    }
    
    const inputel = document.querySelector("#personas_Telefono");
    let actualvaluetel = inputel.value
    const iti = window.intlTelInput(inputel, {
        preferredCountries: ['cl', 'co', 'ec', 'mx', 'pe', 'bo', 'br'],
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("cl"));
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
    });
    if (actualvaluetel && actualvaluetel.length > 0)
        iti.setNumber(actualvaluetel.replace("(", "").replace(")", "").replace(" ", ""));
    inputel.addEventListener("countrychange", function () {
        let val = inputel.value
        if (val.trim().startsWith("(") && val.includes(")"))
            inputel.value = val.replace("(", "").replace(")", "")
    });

    $('#formFichaMedico').validate({
        errorClass: 'text-danger',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        },
        submitHandler: async function (form, e) {

            e.preventDefault();
            $('#btnGuardar').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            var formData = new FormData(form);

            formData.append('personasDatos.AlmaMater', data.personasDatos.almaMater);
            formData.append('personasDatos.ValorAtencion', data.personasDatos.valorAtencion);
            formData.append('personasDatos.NumeroRegistro', data.personasDatos.numeroRegistro);
            formData.append('personasDatos.Estado', data.personasDatos.estado);
            formData.append('personasDatos.FechaCreacion', data.personasDatos.fechaCreacion);
            formData.append('personasDatos.FechaGraduacion', data.personasDatos.fechaGraduacion);
            formData.append('personasDatos.FechaRegistroMedico', data.personasDatos.fechaRegistroMedico);
            formData.append('personasDatos.IdDuracionAtencion', data.personasDatos.idDuracionAtencion);
            formData.append('personasDatos.IdPersona', data.personasDatos.idPersona);
            formData.append('personasDatos.IdTituloMedico', data.personasDatos.idTituloMedico);
            formData.append('personasDatos.IdUsuarioCreacion', data.personasDatos.idUsuarioCreacion);
            formData.append('personasDatos.PrefijoProf', data.personasDatos.prefijoProf);
            formData.append('personasDatos.ZonaHoraria', data.personasDatos.ZonaHoraria);
            const errorMapTelefono = ["Número de teléfo inválido", "Código de país inválido", "Número demasiado corto", "Número demasiado largo", "Número inválido"];
            if (!iti.isValidNumber()) {
                const errorCode = iti.getValidationError();
                $('#btnGuardar').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire("Error!", "campo Telefono movil, " + errorMapTelefono[errorCode], "error");
                return
            }
            let num = iti.getNumber();
            formData.set('personas.Telefono', num);

            if (!data.personasDatos.IdPuntoAtencion)
                data.personasDatos.IdPuntoAtencion = 0;

            if (!data.personasDatos.IdPrestador)
                data.personasDatos.IdPrestador = 0;

            formData.append('personasDatos.IdPrestador', data.personasDatos.IdPrestador);
            formData.append('personasDatos.IdPuntoAtencion', data.personasDatos.IdPuntoAtencion);

            formData.append('personas.Estado', data.personas.estado);
            formData.append('personas.Genero', data.personas.genero);
            formData.append('personas.Identificador', data.personas.identificador);
            let result = await EditFichaMedico(formData, uid);
            $('#btnGuardar').removeAttr('disabled').children('.spinner-border').remove();
            if (result.status !== 'NOK') {
                $('#btnGuardar').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Perfil actualizado.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {

                });
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }
    });
    document.querySelector('#certificadoPDF').onclick = async () => {

        if (data.personasDatos.certificadoRegistroPDF != null) {
            CertificadoRegistroPDF = baseUrl + data.personasDatos.certificadoRegistroPDF.replace(/\\/g, '/');
            $("#modalBody").empty();
            let embed = document.createElement('embed');
            embed.src = CertificadoRegistroPDF;
            embed.style.width = "100%";
            embed.style.height = "750px";
            document.getElementById('titleModal').innerHTML = 'Certificado de Registro'
            document.getElementById('modalBody').appendChild(embed);

            $("#kt_modal_3").modal("show");
        }
        else {
            Swal.fire("No existe Certificado de registro");
        }
    }
    document.querySelector('#certificaciones').onclick = async () => {

        let i = 0;
        let embed;
        if (data.archivos.length != 0) {
            $("#modalBody").empty();
            data.archivos.forEach(certificaciones => {
                embed + i.toString();
                embed = document.createElement('embed');
                //embed.src = "https://localhost:44363/" + certificaciones.rutaVirtual.replace(/\\/g, '/');
                embed.src = baseUrl + certificaciones.rutaVirtual.replace(/\\/g, '/');
                embed.style.width = "100%";
                embed.style.height = "750px";
                document.getElementById('modalBody').appendChild(embed);
                document.getElementById('titleModal').innerHTML = 'Certificaciones'

                i++;
            });
            $("#kt_modal_3").modal("show");
        }
        else
            Swal.fire("No existen certificaciones");
    }
}



jQuery(document).ready(function () {
    $(".kt-avatar__upload").on('click', function (event) {

        $("#cargaFoto").show();
    });
    $("#personas_FNacimiento").inputmask("99/99/9999", {
        "placeholder": "dd/mm/aaaa",
    });
    $("#personasDatos_FechaGraduacion").inputmask("99/99/9999", {
        "placeholder": "dd/mm/aaaa",
    });
    $("#personasDatos_FechaRegistroMedico").inputmask("99/99/9999", {
        "placeholder": "dd/mm/aaaa",
    });
    //$("#personas_Telefono").inputmask("mask", {
    //    "mask": "(+56) 99 999 9999"
    //});
    $("#personas_Correo").inputmask({
        mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
        greedy: false,
        onBeforePaste: function (pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace("mailto:", "");
        },
        definitions: {
            '*': {
                validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                cardinality: 1,
                casing: "lower"
            }
        }
    });
});