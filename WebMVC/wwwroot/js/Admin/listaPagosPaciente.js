import { GetListaPagos } from "../apis/pagos-fetch.js";

export async function init() {
    $('#kt_form_status, #especialidades').selectpicker();

    document.addEventListener('search', async (event) => {
        const { rut } = event;

        try {
            const response = await GetListaPagos(rut);
            const pagos = response.data;

            if (!Array.isArray(pagos)) {
                console.error('Los pagos no están en el formato esperado');
                return;
            }

            const datatable = $('.kt-datatable').data('kt-datatable');
            if (datatable) {
                datatable.destroy();
            }

            $('.kt-datatable').KTDatatable({
                data: {
                    type: 'local',
                    source: pagos,
                    pageSize: 10,
                },
                layout: {
                    scroll: {
                        x: true,
                        y: false
                    },
                    height: 550,
                    footer: false
                },
                sortable: true,
                pagination: true,
                columns: [
                    {
                        field: 'data.id_atencion_ex',
                        title: 'Atención',
                        width: 60,
                        template: row => row.id_atencion_ex ? row.id_atencion_ex : 'N/A'
                    },
                    {
                        field: 'detail.nombre_paciente',
                        title: 'Paciente',
                        width: 150,
                        template: row => row.detail ? `<strong>${row.detail.nombre_paciente} ${row.detail.apellidos_paciente || ''}</strong>` : 'N/A'
                    },
                    {
                        field: 'detail.email_paciente',
                        title: 'Email',
                        width: 200,
                        template: row => row.detail ? row.detail.email_paciente : 'N/A'
                    },
                    {
                        field: 'detail.telefono_paciente',
                        title: 'Tel. Paciente',
                        width: 120,
                        template: row => row.detail ? row.detail.telefono_paciente : 'N/A'
                    },
                    {
                        field: 'detail.nombre_consultorio',
                        title: 'Consultorio',
                        width: 100,
                        template: row => row.detail ? row.detail.nombre_consultorio : 'N/A'
                    },
                    {
                        field: 'detail.specialty_name',
                        title: 'Especialidad',
                        width: 150,
                        template: row => row.detail ? row.detail.specialty_name : 'N/A'
                    },
                    {
                        field: 'detail.estado',
                        title: 'Estado Atención',
                        width: 100,
                        template: row => row.detail ? row.detail.estado : 'N/A'
                    },
                    {
                        field: 'pago.metodo_pago',
                        title: 'Método de Pago',
                        width: 100,
                        template: row => row.pago ? row.pago.metodo_pago : 'N/A'
                    },
                    {
                        field: 'pago.monto',
                        title: 'Monto',
                        width: 150,
                        template: row => {
                            const monto = row.pago ? row.pago.monto : 'N/A';
                            const estado = row.pago ? row.pago.estado : 'N/A';
                            return `
                                <div>$${monto}</div>
                                <div><strong>Estado del pago:</strong> ${estado}</div>
                            `;
                        }
                    },

                ]
            });

        } catch (error) {
            console.error('Error en la datatable:', error);
        }
    });
}
