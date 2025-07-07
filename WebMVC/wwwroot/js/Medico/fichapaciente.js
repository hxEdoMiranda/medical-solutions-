

export async function init(data) {

    let page = document.getElementById('page');
    page.innerHTML = "Ficha Paciente";
    page.setAttribute('style', 'margin-left:20px;')

    cargarFicha(data.fichaPaciente);
    proximasAtenciones(data.historialAtenciones);
 
}

function cargarFicha(fichaPaciente) {
       
        const llenadoLabels = document.querySelectorAll('label');
        llenadoLabels.forEach(function (item) {
            item.innerHTML = fichaPaciente[item.id.substring(item.id.lastIndexOf('.') + 1)] ? fichaPaciente[item.id.substring(item.id.lastIndexOf('.') + 1)] : '';
       
    })
}
function proximasAtenciones(proximasHorasPaciente) {
     
    if (proximasHorasPaciente.length == 0) {
        document.querySelector('[id="pnlHistorial"]').setAttribute('style', 'display:block')
        return;
    }
}