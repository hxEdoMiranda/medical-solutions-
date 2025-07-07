export async function getParametro(family) {
    try {
        let response = await fetch(`/Parametro/GetByFamily?family=${family}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}

export async function getParametroByFamiliaPadre(familiaPadre, idPadre) {
    try {
        let response = await fetch(`/Parametro/GetByFamiliaPadre?familiaPadre=${familiaPadre}&idPadre=${idPadre}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}