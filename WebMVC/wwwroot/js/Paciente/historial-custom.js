

export async function init() {

    await moduloInicial();
    await cargarModulos();

    $(".tag-todos").click(async function () {
        $(".contenedor-todos").show();
        $(".tag-todos").addClass("active");
        $(".tag-atencion").removeClass("active");
        $(".tag-examen").removeClass("active");
        $(".tag-smartcheck").removeClass("active");
        $(".tag-psalud").removeClass("active");
        $(".contenedor_atencion").css("display", "none");
        $(".contenedor_examen").css("display", "none");
        $(".contenedor_smartcheck").css("display", "none");
        $(".contenedor_programaSalud").css("display", "none");

        $(".tag-test").removeClass("active")
        $(".contenedor_test").css("display", "none");

        // Ordenar los elementos por fecha
        let $contenedorTodos = $('.contenedor-todos');
        let $elementosTodos = $contenedorTodos.children();

        $elementosTodos.sort(function (a, b) {
            let fechaA = new Date($(a).data('fecha'));
            let fechaB = new Date($(b).data('fecha'));
            return fechaB - fechaA;
        });

        $contenedorTodos.empty().append($elementosTodos);
    });


    $(".tag-atencion").click(async function () {
        $(".contenedor_atencion").show();
        $(".tag-atencion").addClass("active");
        $(".tag-todos").removeClass("active");
        $(".tag-examen").removeClass("active");
        $(".tag-test").removeClass("active")
        $(".tag-smartcheck").removeClass("active");
        $(".tag-psalud").removeClass("active");
        $(".contenedor-todos").css("display", "none");
        $(".contenedor_examen").css("display", "none");
        $(".contenedor_smartcheck").css("display", "none");
        $(".contenedor_programaSalud").css("display", "none");
        $(".contenedor_test").css("display", "none");
    });

    $(".tag-examen").click(async function () {
        $(".contenedor_examen").show();
        $(".tag-examen").addClass("active");
        $(".tag-atencion").removeClass("active");
        $(".tag-todos").removeClass("active");
        $(".tag-test").removeClass("active")
        $(".tag-smartcheck").removeClass("active");
        $(".tag-psalud").removeClass("active");
        $(".contenedor-todos").css("display", "none");
        $(".contenedor_atencion").css("display", "none");
        $(".contenedor_smartcheck").css("display", "none");
        $(".contenedor_programaSalud").css("display", "none");
        $(".contenedor_test").css("display", "none");
    });

    $(".tag-smartcheck").click(async function () {
        $(".contenedor_smartcheck").show();
        $(".tag-smartcheck").addClass("active");
        $(".tag-atencion").removeClass("active");
        $(".tag-examen").removeClass("active");
        $(".tag-test").removeClass("active")
        $(".tag-todos").removeClass("active");
        $(".tag-psalud").removeClass("active");
        $(".contenedor-todos").css("display", "none");
        $(".contenedor_examen").css("display", "none");
        $(".contenedor_atencion").css("display", "none");
        $(".contenedor_programaSalud").css("display", "none");
    });

    $(".tag-psalud").click(async function () {
        $(".contenedor_programaSalud").show();
        $(".tag-psalud").addClass("active");
        $(".tag-atencion").removeClass("active");
        $(".tag-examen").removeClass("active");
        $(".tag-todos").removeClass("active");
        $(".tag-smartcheck").removeClass("active");
        $(".contenedor-todos").css("display", "none");
        $(".contenedor_examen").css("display", "none");
        $(".contenedor_atencion").css("display", "none");
        $(".contenedor_smartcheck").css("display", "none");
        $(".contenedor_test").css("display", "none");
    });

    $(".tag-test").click(async function () {
        $(".contenedor_test").show();
        $(".tag-test").addClass("active");
        $(".tag-smartcheck").removeClass("active");
        $(".tag-atencion").removeClass("active");
        $(".tag-examen").removeClass("active");
        $(".tag-todos").removeClass("active");
        $(".contenedor-todos").css("display", "none");
        $(".contenedor_examen").css("display", "none");
        $(".contenedor_smartcheck").css("display", "none");
        $(".contenedor_atencion").css("display", "none");
    });

    //Gráfico puntaje
    //let puntajeSmartcheck = "calc((" + parseFloat($("#calculoSmart").val()) + "/ 100) * 100%)";
    //$("#puntoSmartcheck").css("margin-left", puntajeSmartcheck);
    //$("#puntoSmartcheckTodos").css("margin-left", puntajeSmartcheck);
    $('[id^=puntoSmartcheckTodos]').each(function () {
    let smartcheckIndex = $(this).attr("id").split("-")[1];
    let puntajeSmartcheck = "calc((" + parseFloat($("#calculoSmart-" + smartcheckIndex).val()) + "/ 100) * 100%)";
    $(this).css("margin-left", puntajeSmartcheck);
    });

    $('[id^=puntoSmartcheck]').each(function () {
        let smartcheckIndex = $(this).attr("id").split("-")[1];
        let puntajeSmartcheck = "calc((" + parseFloat($("#calculoSmart-" + smartcheckIndex).val()) + "/ 100) * 100%)";
        $(this).css("margin-left", puntajeSmartcheck);
    });
}

async function moduloInicial() {

    $(".contenedor-todos").show();
    $(".contenedor_atencion").hide();
    $(".contenedor_examen").hide();
    $(".contenedor_smartcheck").hide();
    $(".contenedor_programaSalud").hide();
    $(".contenedor_test").hide();

}

async function cargarModulos() {
    $(".contenedor-todos").show();
    $(".tag-todos").addClass("active");
    $(".tag-atencion").removeClass("active");
    $(".tag-examen").removeClass("active");
    $(".tag-smartcheck").removeClass("active");
    $(".tag-psalud").removeClass("active"); 
    $(".tag-test").removeClass("active");
}

