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
            // columns definition
            columns: [
                {
                    field: 'identificador',
                    //width: 150,
                    autoHide: false,
                    title: 'RUT'
                }, {
                    field: 'nombres',
                    autoHide: false,
                    title: 'Nombre',
                    template: function (row) {
                        return `${row.nombres} ${row.apellidoPaterno} ${row.apellidoMaterno ?? ''}`;
                    }
                },
                {
                    field: 'status',
                    //width: 150,
                    autoHide: false,
                    title: 'Estado'
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
    var centroClinico = $('#centroClinico').val();
    formData.append("convenio", convenio);
    formData.append("centroClinico", centroClinico);
    




    $.ajax({
        type: 'POST',
        url: "/AdminCentroClinico/PostLoadProfesionales",
        data: formData,
        processData: false,
        contentType: false
    }).done(function (response) {

        if (response.status === "OK") {
            tablaResult(response.cargas);
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
            // columns definition
            columns: [
                {
                    field: 'identificador',
                    //width: 150,
                    autoHide: false,
                    title: 'RUT'
                }, {
                    field: 'nombres',
                    autoHide: false,
                    title: 'Nombre',
                    template: function (row) {
                        return `${row.nombres} ${row.apellidoPaterno} ${row.apellidoMaterno ?? ''}`;
                    }
                },
                {
                    field: 'status',
                    //width: 150,
                    autoHide: false,
                    title: 'Estado'
                }
            ],

        });
    }
}

$("#downloadAsExcel").click(function (e) {

    let table = document.getElementsByClassName("kt-datatable"); // you can use document.getElementById('tableId') as well by providing id to the table tag
    var today = new Date();
    var fileName = 'Carga_masiva_' + today.getDate().toString() + (today.getMonth() + 1) + today.getFullYear() + '.xlsx';
    TableToExcel.convert(table[0], { // html code may contain multiple tables so here we are refering to 1st table tag
        name: fileName, // fileName you could use any name
        sheet: {
            name: 'Resultados' // sheetName
        }
    });
});
