export async function GetListaPagos(rut) {
    try {
        const response = await fetch(`https://api.medibuslive.com/prod/teledoc/GetPagosAttentions?identificador=${rut}`);
        const pagos = await response.json();
        return pagos;
    } catch (error) {
        console.error('Error obteniendo la lista de pagos:', error);
        return [];
    }
}
