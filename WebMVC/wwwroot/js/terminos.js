let validationTermsCo = false;

if ($("#terminosFooter").length) {
    let terminos = document.getElementById('terminosFooter');
    terminos.onclick = async () => {
       let modalBody = document.getElementById('modalTerminosBody');
        $("#modalTerminosBody").empty();
        let embed = document.createElement('embed');
        if (location.host.includes("prevenciononcologica") || location.host.includes("masproteccionsalud")) {
            embed.src = "https://medical.medismart.live/terminoscla/TERMINOSYCONDICIONESCLA.pdf";
        } else if (validationTermsCo || window.codigoTelefono == 'CO'){
            embed.src = "https://medical.medismart.live/documentosLegalesCO/TERMINOS-Y-CONDICIONES-GENERALES-DE-FUNCIONAMIENTO-Medical-Solutions-Colombia-S.A.pdf";
        }
        else if (window.codigoTelefono == "MX") {
            embed.src = "https://medical.medismart.live/documentosLegalesMX/TerminosycondicionesMX.pdf";
        }
        else if (window.codigoTelefono == "EC") {
            embed.src = "https://medical.medismart.live/documentosLegalesEC/TERMINOS-Y-CONDICIONES-VIDEOCONSULTA-Medismart-Ecuador-SAS.pdf";
        }
        else {
            embed.src = "https://medical.medismart.live/Terminosycondiciones/TERMINOSYCONDICIONES.pdf";
        }        
        embed.style.width = "100%";
        embed.style.height = "700px";
        modalBody.appendChild(embed);
        $("#modalTerminos").modal("show");
    }

}


if ($("#politicas").length) {
    let politicas = document.getElementById('politicas');
    politicas.onclick = async () => {
        let modalBody = document.getElementById('modalPoliticasBody');
        $("#modalPoliticasBody").empty();
        let embed = document.createElement('embed');
        if (validationTermsCo || window.codigoTelefono == 'CO') {
            embed.src = "https://medical.medismart.live/documentosLegalesCO/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf";           
        }
        else if (window.codigoTelefono == "MX") {
            embed.src = "https://medical.medismart.live/documentosLegalesMX/TerminosycondicionesMX.pdf";
        }
        else if (window.codigoTelefono == "EC") {
            embed.src = "https://medical.medismart.live/documentosLegalesEC/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medismart-Ecuador.pdf";
        }
        else {
            embed.src = "https://medical.medismart.live/Terminosycondiciones/Protocolo.pdf";
        }
        embed.style.width = "100%";
        embed.style.height = "700px";
        modalBody.appendChild(embed);
        $("#modalPoliticas").modal("show");
    }
}