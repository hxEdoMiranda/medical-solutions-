var uri = '';
if (baseUrl.includes("qa.")) {
    uri = baseUrl.includes("localhost") ? "https://qa.videocall.medismart.live/jwt" : "https://qa.videocall.medismart.live/jwt";
} else {
   uri = baseUrl.includes("localhost") ? "https://qa.videocall.medismart.live/jwt" : "https://videocall.medismart.live/jwt";
}

export async function getJwtCall(idAtencion, idUsuario) {
    try {
        let response = await fetch(`${uri}/${idAtencion}/${idUsuario}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}