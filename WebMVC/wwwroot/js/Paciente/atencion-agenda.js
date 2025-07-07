import { personaFotoPerfil } from "../shared/info-user.js";
import { inicioAtencionPaciente, putActualizarTriage } from '../apis/atencion-fetch.js';
import { logPacienteViaje } from '../apis/personas-fetch.js';


export async function init(data) {
    const idEntidad = document.querySelector('[name="idEntidad"]').value;
    const codEntidad = document.querySelector('[name="codEntidad"]').value;
    const uid = document.querySelector('[name="uid"]').value;
    await personaFotoPerfil();
    let page = document.getElementById('page');

    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencionPacienteCall == null) {
        await inicioAtencionPaciente(data.atencion.id);
    }
    //nombre medico header chat;
    document.getElementById("headName").innerHTML = data.atencion.nombreMedico;

    page.innerHTML = "Atención con Dr." + data.atencion.nombreMedico;

    document.querySelector("#especialidad").innerHTML = data.atencion.especialidad;

    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;

    //click boton salir 
    if ($("#retorno").length) {
        let btnRetorno = document.getElementById("retorno");
        btnRetorno.onclick = async () => {
            var evento = "Paciente abandona atención salir layout";
            await grabarLog(idAtencion, evento);
            window.onbeforeunload = false;
            location.href = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
        }
    }



    $("#divChat").show();
    document.getElementById("btnSalirVC").onclick = async () => {
        var log = {
            IdPaciente: uid,
            Evento: "Paciente abandona atención",
            IdAtencion: parseInt(data.atencion.id)
        }
        await logPacienteViaje(log);
        var urlSalir = `/Paciente/Index`;
        if (data.atencion.idCliente === 1) {
            urlSalir = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
        }

        window.onbeforeunload = false;
        window.location = urlSalir;

    }

    //boton web
    if ($("#btnConfirmar").length) {
        var buttonConfirmar = document.getElementById("btnConfirmar");
        buttonConfirmar.addEventListener("click", async function (event) {

            event.preventDefault();
            $('#btnConfirmar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            let valida = await guardarAtencion(parseInt(idAtencion));
            
            if (valida !== 0) {
                $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                Swal.fire("Ok", "Datos guardados.", "success");
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
        });
    }

    //boton mobile
    if ($("#btnConfirmar2").length) {
        var buttonConfirmar = document.getElementById("btnConfirmar2");
        buttonConfirmar.addEventListener("click", async function (event) {

            event.preventDefault();
            $('#btnConfirmar2').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            let valida = await guardarAtencion(parseInt(idAtencion));

            if (valida !== 0) {
                $('#btnConfirmar2').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                Swal.fire("Ok", "Datos guardados.", "success");
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmar2').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
        });
    }
    if ($("#hs-g").length) {
        var btnIngresar = document.getElementById("hs-g");
        btnIngresar.onclick = () => {
            OcultarSala();
        }
    }

    if ($("#ingreso-m").length) {
        var btnIngresar = document.getElementById("ingreso-m");
        btnIngresar.onclick = () => {
            OcultarSala();
        }
    }

};

function OcultarSala() {
    if ($(".sala-espera-mobile").length) {
        document.querySelector(".sala-espera-mobile").setAttribute('class', 'd-none');
    }
    document.getElementById("cont-vc").setAttribute('class', 'kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid medismart-atencion')
    document.querySelector(".sala-espera").setAttribute('class', 'd-none');
}
async function guardarAtencion(idAtencion) {
    let triageObservacion = "";
    let antecedentesMedicos = "";

    if (document.querySelector('[name="triageObservacion"]').value != "") {
        triageObservacion = document.querySelector('[name="triageObservacion"]').value
    }
    else if (document.querySelector('[name="triageObservacionMobile"]').value != "") {
        triageObservacion = document.querySelector('[name="triageObservacionMobile"]').value
    }

    if (document.querySelector('[name="antecedentesMedicos"]').value != "") {
        antecedentesMedicos = document.querySelector('[name="antecedentesMedicos"]').value
    }
    else if (document.querySelector('[name="antecedentesMedicosMobile"]').value) {
        antecedentesMedicos = document.querySelector('[name="antecedentesMedicosMobile"]').value
    }
    let atencion = {
        id: parseInt(idAtencion),
        triageObservacion: triageObservacion,
        antecedentesMedicos: antecedentesMedicos,
        idPaciente: uid,
        SospechaCovid19: false
    };
    let resultado = await putActualizarTriage(atencion);

    if (resultado.status === 'NOK') {
        return 0;
    }
    else {
        return resultado;
    }


}

async function grabarLog(idAtencion, evento, info) {
    var log = {
        IdPaciente: uid,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
}

// TODO: cambiar a desconectar de la sesion o algo relevante que deba hacer el paciente en la db
function guardarFinalizarAtencion() {
    return true;
}

