export async function init() {
    if ($("#btnCallAsistencia").length) {
        let btnCallAsistencia = document.getElementById('btnCallAsistencia');
        btnCallAsistencia.onclick = async () => {
            window.location.href = 'tel:' + window.num
        }
    }
}
