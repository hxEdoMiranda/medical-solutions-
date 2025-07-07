let urlWeb = new URL(window.location.href);

let baseUrlSls = (urlWeb.hostname.includes("localhost") || urlWeb.hostname.includes("qa")) ? "https://api.medibuslive.com/dev" : "https://api.medibuslive.com/prod";
let redirectUrl = (urlWeb.hostname.includes("localhost") || urlWeb.hostname.includes("qa")) ? "https://dev.hanufit.com/partners/medismart/callback/autologin?section=hanu-home&origin_url="+encodeURIComponent(window.location.href)+"&token=" : "https://app.hanufit.com/partners/medismart/callback/autologin?section=hanu-home&origin_url="+encodeURIComponent(window.location.href)+"&token=";

import { personByUser } from "./personas-fetch.js";

export async function getToken(userId) {
    const userData = await personByUser(userId);
    console.log(userData);
    try {
        let response = await fetch(`${baseUrlSls}/wellness/token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "external_id": userData.identificador,
                "first_name": userData.nombre ?? null,
                "last_name": userData.apellidoPaterno ?? null,
                "email": (!userData.correo || !userData.correo.replace(/\s+/g, '')) ? null : userData.correo,
                "gender": userData.genero ?? null
            })
        });
        let result = await response.json();
        if (response.ok && response.status === 200) {
            return {
                ok: true,
                title: "Exito",
                subtitle: "Exito",
                data: {
                    redirectUrl: redirectUrl + result.data.token
                }
            }

        } else {
            return {
                ok: false,
                title: "Error",
                subtitle: "Ocurrió un error",
                data: null
            }
        }
    } catch (error) {
        console.error('Error [POST]: getToken', error);
    }
}