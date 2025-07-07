import { InsertProgramaSaludCuestionarioPittsburg, ProgramaSaludCuestionario } from '../apis/programa-salud-fetch.js'


const validInput = (input, funcionInvalid) => {
    input?.addEventListener("change", () => {
        input.classList.remove("ps-is-invalid");
        if (funcionInvalid(input))
            input.classList.add("ps-is-invalid");
    })
}
export async function init() {

    var siguientePs = document.getElementById("SiguientePs");
    console.log(siguientePs)

    validInput(document.getElementById("inputEdad"), ({value:edad}) => (edad === "" || isNaN(edad) || parseInt(edad) < 1 || parseInt(edad) > 150));
    validInput(document.getElementById("psCuestionario1__Peso"), ({ value: peso }) => (peso === "" || isNaN(peso) || parseInt(peso) < 1 || parseInt(peso) > 300));
    validInput(document.getElementById("psCuestionario1__Sexo"), ({ value: sexo }) => (sexo === ""));
    validInput(document.getElementById("psCuestionario1__Altura"), ({ value: altura }) => (altura === "" || isNaN(altura) || parseInt(altura) < 80 || parseInt(altura) > 300));

    if (siguientePs) {
        siguientePs.onclick = async () => {

            var edad = document.getElementById("inputEdad").value;
            var sexo = document.getElementById("psCuestionario1__Sexo").value;
            var peso = document.getElementById("psCuestionario1__Peso").value;
            var altura = document.getElementById("psCuestionario1__Altura").value;
            var tabaco = $('#psCuestionario1Radio1').is(':checked') ? true : false;
            var actividad = $('#psCuestionario1Radio3').is(':checked') ? true : false;
            var especificar = document.getElementById("inputEspecificar").value


            if (edad === "" || isNaN(edad) || parseInt(edad) < 1 || parseInt(edad) > 150) {
                Swal.fire("Por favor, ingrese una edad válida", null, "warning");
                return;
            }

            if (peso === "" || isNaN(peso) || parseInt(peso) < 1 || parseInt(peso) > 300) {
                Swal.fire("Por favor, ingrese un peso válido", null, "warning");
                return;
            }

            if (altura === "" || isNaN(altura) || parseInt(altura) < 80 || parseInt(altura) > 300) {
                Swal.fire("Por favor, ingrese una altura válida", null, "warning");
                return;
            }

            if (sexo === "") {
                Swal.fire("Por favor, seleccione el sexo.", null, "warning");
                return;
            }

            if (!$('#psCuestionario1Radio1').is(':checked') && !$('#psCuestionario1Radio2').is(':checked')) {
                Swal.fire("Por favor, seleccionar una de las 2 opciones.", null, "warning");
                return;
            }
            if (!$('#psCuestionario1Radio3').is(':checked') && !$('#psCuestionario1Radio4').is(':checked')) {
                Swal.fire("Por favor, seleccionar una de las 2 opciones.", null, "warning");
                return;
            }
            var result = await ProgramaSaludCuestionario(tipo, uid, edad, sexo, peso, altura, tabaco, actividad, especificar, idCliente);
            if (result.status == "OK")
                location.href = `/programaSalud/Agenda_2?idPrograma=${tipo}`;
        }

    }

    //cuestionario sueño
    const $formSueno = document.querySelector("#psCuestionario2");
    const requiredFields = [
        "Calidad_Sueno",
        "Dormir_Acompanado",
        "Hora_Acostarse",
        "Hora_Levantarse",
        "Horas_Dormidas",
        "Medicinas_Dormir",
        "Animos_Realizar_Actividades",
        "Somnolencia_Actividades",
        "Tiempo_Dormirse",
        "problemas_dormir_sentir_calor",
        "problemas_dormir_levantarse_ir_servicio",
        "problemas_dormir_no_respirar_bien",
        "problemas_dormir_pesadillas_malos_suenos",
        "problemas_dormir_primera_media_hora",
        "problemas_dormir_sentir_frio",
        "problemas_dormir_sufrir_dolores",
        "problemas_dormir_toser_roncar",
        "problemas_dormir_despertar_noche_madrugada",
    ];
    if ($formSueno) {
        $formSueno.addEventListener("submit", async e => {
            let validateData = false;
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));

            requiredFields.forEach(field => {
                if (data[field] === null || data[field] === "") {
                    validateData = true;
                }
            })
            if (validateData) {
                Swal.fire("Por favor, Ingrese todos los campos.", null, "warning");
                return;
            }
            const otraRazon = data.problemas_dormir_otras_razones_text ? { razon: data.problemas_dormir_otras_razones_text, resultado: data.problemas_dormir_otras_razones } : {}
            const dataJson = {
                Id_usuario: parseInt(uid, 10),
                Id_cliente: parseInt(idCliente, 10),
                Calidad_Sueno: data.Calidad_Sueno,
                Dormir_Acompanado: data.Dormir_Acompanado,
                Hora_Acostarse: data.Hora_Acostarse,
                Hora_Levantarse: data.Hora_Levantarse,
                Horas_Dormidas: parseInt(data.Horas_Dormidas, 10),
                Medicinas_Dormir: data.Medicinas_Dormir,
                Animos_Realizar_Actividades: data.Animos_Realizar_Actividades,
                Somnolencia_Actividades: data.Somnolencia_Actividades,
                Tiempo_Dormirse: data.Tiempo_Dormirse,
                Problemas_Dormir: JSON.stringify({
                    sentir_calor: data.problemas_dormir_sentir_calor,
                    levantarse_ir_servicio: data.problemas_dormir_levantarse_ir_servicio,
                    no_respirar_bien: data.problemas_dormir_no_respirar_bien,
                    pesadillas_malos_suenos: data.problemas_dormir_pesadillas_malos_suenos,
                    primera_media_hora: data.problemas_dormir_primera_media_hora,
                    sentir_frio: data.problemas_dormir_sentir_frio,
                    sufrir_dolores: data.problemas_dormir_sufrir_dolores,
                    toser_roncar: data.problemas_dormir_toser_roncar,
                    despertar_noche_madrugada: data.problemas_dormir_despertar_noche_madrugada,
                    otras_razones: otraRazon
                })
            }
            debugger
            const dataResp = await InsertProgramaSaludCuestionarioPittsburg(dataJson);
            if (dataResp.Status = "OK")
                location.href = `/programaSalud/Agenda_2?idPrograma=${tipo}`;

        });
    }
};