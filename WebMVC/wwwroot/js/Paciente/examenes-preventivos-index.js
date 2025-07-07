
export async function init() {
    if ($('#btnAnura')){
        var btnAnura = document.getElementById('btnAnura');
        btnAnura.onclick = async () => {
            event.preventDefault();
            var url;
            url = window.urlSmartcheck + "?userId=" + uid + "&redirect=" + encodeURIComponent(window.location.href) + "&onCancelRedirect=" + encodeURIComponent(window.location.href);
            window.location.href = url;
        };
    }

    if ($('#btnComenzar')) {
        var btnComenzar = document.getElementById('btnComenzar');
        btnComenzar.onclick = async () => {
            event.preventDefault();
            location.href = '/ExamenesPreventivos/Restricciones';
        };
    }

};
