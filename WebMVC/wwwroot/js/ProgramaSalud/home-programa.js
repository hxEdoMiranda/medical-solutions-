import { ingresoProgramaSalud } from '../apis/programa-salud-fetch.js' 



export async function init() {

   var UrlTerminosyCondiciones = "/tcProgramaSalud/ProgramaCronico/TERMINOSYCONDICIONES.pdf";  

    document.getElementById("btnInscribir").onclick = async () => {

        var check = document.getElementById("checkInscripcionPrograma");
        if (!check.checked) {
            Swal.fire({
                title: `Es necesario que aceptes los términos y condiciones para acceder a la atención.`,
                text: "",
                type: "question",
                showCancelButton: true,
                cancelButtonColor: 'rgb(190, 190, 190)',
                confirmButtonColor: '#3085d6',
                cancelButtonStyle: 'position:absolute; right:45px',
                customClass: 'swal-wide',
                reverseButtons: true,
                cancelButtonText: "No acepto y deseo salir",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Entendido"
            }).then(async (result) => {
                if (!result.value) {
                    location.href = "/"
                }
            });
            return;
        }

        var result = await ingresoProgramaSalud(idProgramaSalud, idCliente, uid);
        if (result.status == "OK")
            location.href = `/ProgramaSalud/Cuestionario?tipo=${idProgramaSalud}`;
    }

    let terminos = document.getElementById('terminosps');
    terminos.onclick = async () => {
        let modalBody = document.getElementById('modalBody');
        $("#modalBody").empty();
        let embed = document.createElement('embed');
        embed.src = UrlTerminosyCondiciones;
        embed.style.width = "100%";
        embed.style.height = "700px";
        modalBody.appendChild(embed);
        $("#modalTerminosps").modal("show");
    }


   
};

