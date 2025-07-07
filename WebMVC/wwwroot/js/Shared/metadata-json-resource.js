export async function MetadataLoader(dominio, controller) { //POR SI LO USAMOS
    
    var nombreDom = "";
    switch (dominio) {
        case 108:
            nombreDom = "default";
            break;
        case 148:
            nombreDom = "default";
            break;
        case 176:
            nombreDom = "default";
            break;
        case 158:
            nombreDom = "default";
            break;
        case 204:
            nombreDom = "claro";
            break;
        case 0:
            nombreDom = "default";
            break;
        default:
            nombreDom = "default";
    }



    if (nombreDom === "default") {
        $(function () {
            $('body').addClass('loaded');
        });
    } else {
        $.getJSON("~/../../resources/JsonMD_" + nombreDom + ".json" +"?rnd=${@NumeroRandom.GetRandom()}", function (data) {
            let resource = data[controller]
            $.each(resource[0], function (index, value) {
                if ($("[metadata=" + index + "]")[0] && $("[metadata=" + index + "]")) {
                    $("[metadata=" + index + "]")[0].innerText = value;
                    //document.querySelector('[metadata]').classList.remove('d-none')

                }
            });
            $(function () {
                $('body').addClass('loaded');
            });
        });
    }
    

}