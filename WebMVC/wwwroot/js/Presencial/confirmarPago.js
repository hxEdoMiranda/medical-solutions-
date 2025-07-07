import { personaFotoPerfil, datosUsuario } from "../shared/info-user.js";
import { personByUser } from '../apis/personas-fetch.js';


var datosPaciente = await personByUser(uid);
document.getElementById('nameStrong').innerHTML = datosPaciente.nombreCompleto;


export async function init(atencion) {

    await personaFotoPerfil()

    await cargarInfoMedico();
    let page = document.getElementById('page');
    page.innerHTML = "Agendar atención";

  

    // Fin Busqueda inicial

    $('#volverInicio').on('click', async function (ev) {

        window.location = "/paciente/Index";
    });


}
async function cargarInfoMedico() {

    const divFotoProfesional = document.getElementById('fotoMedico')

  
    divFotoProfesional.src = baseUrlWeb + '/upload/foto_perfil/noPerfilProfesional/ManAvatar.svg';
}
