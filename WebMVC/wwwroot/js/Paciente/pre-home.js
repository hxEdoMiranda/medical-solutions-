
import { cambioIdCliente } from '../apis/personas-fetch.js?7';

export async function init(data) {

    for (let i = 0; i < data.length; i++) {

        if ($("#id-pre-home-" + i).length) {
            let btn = document.getElementById("id-pre-home-" + i);
            let idCliente = data[i].idCliente;

            if( window.host.includes("didi.wedoctorsmx"))
            {
                btn.onclick = async () => {
                    location.href = `/Paciente/FacturacionSuscripcion?IdEmpresa=${idCliente}`;
                }
            }
            else {

                btn.onclick = async () => {

                    await cambioIdCliente(idCliente);
                    location.href = '/';
                    //'#modalPronto').modal('show');
                }

            }
        }
    }

}
