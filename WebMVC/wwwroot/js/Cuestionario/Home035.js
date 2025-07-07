import { ValidaGuardaEmpresaxUsuario, PermisoComentarioEmpresa } from '../apis/nom035-fetch.js';

export async function init(infoPaciente) {

    showTabInIdCliente()
    
    $('#SiguienteHome').on('click', async function (ev) {
        ///$('#content').html(' <div class="d-flex justify-content-center bakg_loading"><div class="spinner-border" role="status"><span class="sr-only">Un momento por favor...</span></div></div>');
        var response = await ValidaGuardaEmpresaxUsuario(infoPaciente.id);

        window.location = "/Cuestionario/RegistroDatosPaciente";
        ///$('#content').fadeIn(0).html("");
    });

}

export async function showTabInIdCliente() {
    let id_Cliente = await PermisoComentarioEmpresa();

    console.log('idCLIENTE DESDE SHOWTABIN', id_Cliente)

    return id_Cliente
}
  


