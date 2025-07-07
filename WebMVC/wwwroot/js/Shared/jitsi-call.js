import { getJwtCall } from '../apis/jitsi-fetch.js?1';
import { getAtencion } from '../apis/atencion-fetch.js';

const isUnabSettings = window.location.href.includes('unabactiva.') || window.location.href.includes('uoh.');

(async function () {
    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    var jwtCall = await getJwtCall(parseInt(idAtencion), uid)
    let hangup = '';
    if (isUnabSettings && jwtCall.rol == "Paciente")
        hangup = 'hangup';
    let displayName = (jwtCall.nombre ?? '') != '' && (jwtCall.rol ?? '') != '' ? `${jwtCall.nombre} - ${jwtCall.rol}` : `Atención ${idAtencion}`;
    const api = new JitsiMeetExternalAPI("meet.medismart.live", {
        roomName: jwtCall.roomName,
        parentNode: document.querySelector('#videoJitsi'),
        //jwt: jwtCall.token,
        interfaceConfigOverwrite: { LANG_DETECTION: false, MOBILE_APP_PROMO: false, },
        userInfo: {
            displayName: 'Atencion' + idAtencion
        },
        configOverwrite: {
            disableDeepLinking: true,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            readOnlyName: true,
            defaultLanguage: 'es',
            toolbarButtons: [
                'camera',
                //'chat',
                'closedcaptions',
                'desktop',
                'download',
                'embedmeeting',
                'etherpad',
                //'feedback',
                'filmstrip',
                'fullscreen',
                hangup,
                'help',
                //'invite',
                'livestreaming',
                'microphone',
                'mute-everyone',
                'mute-video-everyone',
                //'participants-pane',
                'profile',
                'raisehand',
                //'recording',
                //'security',
                'select-background',
                'settings',
                //'shareaudio',
                //'sharedvideo',
                //'shortcuts',
                'stats',
                'tileview',
                'toggle-camera',
                'videoquality',
                '__end'
            ],

        },
    });
    api.on('participantLeft', async (arg) => {


        var infoName = api.getParticipantsInfo()[0].displayName;
        var estadoAtencion = await getAtencion(idAtencion);
        if (estadoAtencion.estado == "T") {
            var momentoWow = $("#momentoWow").val();
            var codigoTelefono = $("#codigoTelefono").val();

            var urlInformeWow = `/ResumenAtencionCustom?idAtencion=${idAtencion}`;

            if (estadoAtencion.isProgramaSalud && estadoAtencion.horaMedico.idEspecialidad == 33) {
                urlInformeWow = `/programaSalud/ConfirmacionInterconsulta?idAtencion=${idAtencion}`
                $("#modalFinalizarAtencionWOW").modal("show");
                setTimeout(async () => {
                    window.onbeforeunload = false;
                    location.href = urlInformeWow;
                }, "5000");
            }
            else if (momentoWow === "True" && codigoTelefono == "CL") {
                $("#modalFinalizarAtencionWOW").modal("show");
                setTimeout(async () => {
                    window.onbeforeunload = false;
                    location.href = urlInformeWow;
                }, "5000");
            }
            else {
                var urlInforme = `/InformeAtencion/${idAtencion}`;
                swal.fire({
                    title: 'La Atención ha finalizado',
                    text: 'Serás redireccionado de forma automática al informe de atención',
                    type: 'success',
                    reverseButtons: true,
                    confirmButtonText: 'Ok'
                }).then(async function (result) {
                    window.onbeforeunload = false;
                    location.href = urlInforme;
                });
            }
        }


    });

})();