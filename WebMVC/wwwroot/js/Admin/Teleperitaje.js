export async function init(data) {
    ;
    var data = data;
    if (data.length > 0) {
        $("#tableMasivo").attr("hidden", false);

        
        datatable = $('#json_data').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: data,
                pageSize: 25,
            },

            // layout definition
            layout: {
                scroll: true,
                height: 550,
                footer: false,
            },


            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch')
            },
            // columns definition
            columns: [
                {
                    field: 'rut',
                    //width: 150,
                    autoHide: false,
                    title: 'Rut Paciente'
                }, {
                    field: 'telefono',
                    autoHide: false,
                    title: 'Telefono'
                },
                {
                    field: 'email',
                    //width: 130,
                    autoHide: false,
                    title: 'Correo',
                },
                {
                    field: 'fechaCitacion',
                    // width: 130,
                    autoHide: false,
                    title: 'Fecha citación',
                },
                {
                    field: 'hora',
                    // width: 130,
                    autoHide: false,
                    title: 'Hora cita',
                },
                {
                    field: 'rutMedico',
                    //  width: 250,
                    autoHide: false,
                    title: 'Rut medico',
                },
                {
                    field: 'validacion',
                    //  width: 250,
                    autoHide: false,
                    title: 'Resultado',
                },
                {
                    field: 'correoMedico',
                    //  width: 250,
                    autoHide: false,
                    title: 'Correo Medico',
                },
                {
                    field: 'correoPaciente',
                    //  width: 250,
                    autoHide: false,
                    title: 'Correo Paciente',
                },
                {
                    field: 'Estado',
                    //  width: 250,
                    autoHide: false,
                    title: 'Estado',
                },
                {
                    field: 'apellido',
                    title: 'Apellido',
                    autoHide: false
                }
            ],

        });
    }
}

$("#uploadExcel").click(function (e) {
    e.preventDefault();
    $('#uploadExcel').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');

    
    var formData = new FormData();
    formData.append("file", $("#excelFile")[0].files[0]);
    var convenio = $('#convenio').val();
    var zonahoraria = $('#zonahoraria').val();
    formData.append("convenio", convenio);
    formData.append("zonahoraria", zonahoraria);
    




    $.ajax({
        type: 'POST',
        url: "/Admin/Teleperitaje",
        data: formData,
        processData: false,
        contentType: false
    }).done(function (response) {

        if (response.status === "OK") {
            tablaResult(response.atencion);
            $('#uploadExcel').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
        } else if (response.status === "NOK1") {
            $('#uploadExcel').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            Swal.fire({
                tittle: "Seleccione un archivo",
                text: "No fue posible encontrar un archivo, Vuelve a intentarlo más tarde",
                type: "error",
                confirmButtonText: "OK"
            });

        }
        else {
            $('#uploadExcel').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
        }
    });

});

async function tablaResult(res) {
    if (res.length > 0) {
        $("#tableMasivo").attr("hidden", false);

        var datatable = $('#json_data').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: res,
                pageSize: 25,
            },

            // layout definition
            layout: {
                scroll: true,
                height: 550,
                footer: false,
            },


            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch')
            },
            // columns definition
            columns: [
                {
                    field: 'name',
                    title: 'Nombre',
                    autoHide: false
                },
                {
                    field: 'apellido',
                    title: 'Apellido',
                    autoHide: false
                }, {
                    field: 'rut',
                    //width: 150,
                    autoHide: false,
                    title: 'Rut'
                },
                {
                    field: 'email',
                    //width: 130,
                    autoHide: false,
                    title: 'Correo',
                },
                {
                    field: 'fechaCitacion',
                    // width: 130,
                    autoHide: false,
                    title: 'Fecha citación',
                },
                {
                    field: 'hora',
                    // width: 130,
                    autoHide: false,
                    title: 'Hora cita',
                },
                {
                    field: 'rutMedico',
                    //  width: 250,
                    autoHide: false,
                    title: 'Rut medico',
                },
                {
                    field: 'validacion',
                    //  width: 250,
                    autoHide: false,
                    title: 'Resultado',
                },
                {
                    field: 'correoMedico',
                    //  width: 250,
                    autoHide: false,
                    title: 'Correo Medico',
                },
                {
                    field: 'correoPaciente',
                    //  width: 250,
                    autoHide: false,
                    title: 'Correo Paciente',
                },
                {
                    field: 'estado',
                    title: 'Estado',
                    width: 60,
                    autoHide: false,
                    //overflow: 'visible',
                    template: function (row) {
                        if (row.estado == "Ok")
                            return '\
                        <button class="btn btn-sm btn-icon btn-icon-md cambiaEstado"  style="color:white;" title="Agendamiento exitoso">\
							Correcto<i class="fas fa-check fa-2x" style="color:#44c678"></i>\
						</button>';

                        else
                            return '\
                        <button class="btn btn-sm btn-icon btn-icon-md cambiaEstado" style="color:white;" title="Agendamiento no cncretado">\
							Fallo<i class="fas fa-times fa-2x" style="color:red"></i>\
						</button>';

                    }

                }
            ],

        });
    }
}

$("#downloadAsExcel").click(function (e) {

    let table = document.getElementsByClassName("kt-datatable"); // you can use document.getElementById('tableId') as well by providing id to the table tag
    var today = new Date();
    var fileName = 'peritaje' + today.getDate().toString() + (today.getMonth() + 1) + today.getFullYear() + '.xlsx';
    TableToExcel.convert(table[0], { // html code may contain multiple tables so here we are refering to 1st table tag
        name: fileName, // fileName you could use any name
        sheet: {
            name: 'Resultados' // sheetName
        }
    });
});
