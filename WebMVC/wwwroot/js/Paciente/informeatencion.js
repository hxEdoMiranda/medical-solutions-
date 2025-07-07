import { enviarInforme, enviarInformeMedico } from '../apis/correos-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js";
(async function () {

    await personaFotoPerfil();
    let page = document.getElementById('page');
    page.innerHTML = "Informe de atención";
    page.setAttribute('style', '')

    //click boton salir 
    let btnRetorno = document.getElementById("retorno");
    btnRetorno.onclick = () => {
        retornoCanal();
    }
    if ($("#btnEnviarInforme").length) {
        document.querySelector('#btnEnviarInforme').onclick = () => {
            const idAtencion = document.querySelector('[name="Atencion.Id"]').value;

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
                    let result = await enviarInforme(idAtencion, baseUrlWeb, idCliente);
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

})();

function retornoCanal() {
    location.href = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
}