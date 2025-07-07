import { GetPersonasCargas, GetContactosEmergencia, changeStateBeneficiario, ChangeStatePersona } from "../apis/personas-fetch.js?rds=3";
import { saludoPaciente } from '../shared/info-user.js?rds=3';

export async function init(data, urlEdit, idCliente) {
    await saludoPaciente();
    if (idCliente != "108" && !window.host.includes("saludtumundoseguro")) document.getElementById('nombreCompleto').innerHTML = data.nombreCompleto;
    else document.getElementById('nombreCompleto').innerHTML = "Contactos de Emergencia";
    
    var contactosEmergencia = await GetContactosEmergencia(data.id, idCliente);

    if (window.admiteCEmergencia == 1) {
        if (contactosEmergencia.length >= window.cantCEmergencia) {
            document.getElementById("btn-agregar-contacto").hidden = true;
        }
        else if (contactosEmergencia.length < window.cantCEmergencia) {
            document.getElementById("btn-agregar-contacto").hidden = false;
        }
    }

    if (window.admiteCEmergencia == 1) await cargarContactoEmergencia(contactosEmergencia, urlEdit);
    
    if ($('#btnBuscar').length > 0) {
        let btnBuscar = document.getElementById('btnBuscar');
        btnBuscar.onclick = async () => {
            let textBusqueda = document.getElementById('input_codigo');
            if (textBusqueda.value.length > 0 && textBusqueda.value.length < 3) {
                contactosEmergencia = await GetContactosEmergencia(data.id, idCliente);
            }
                
            

            if (textBusqueda.value == "") {
                if (window.admiteCEmergencia == 1) await cargarContactoEmergencia(contactosEmergencia, urlEdit);
                return;
            }

           
            var arrayContactos = contactosEmergencia.filter(contactosEmergencia => (contactosEmergencia.nombre != null ? contactosEmergencia.nombre.toUpperCase().includes(textBusqueda.value.toUpperCase()) : null));
          

            if (arrayContactos.length == 0) {
                arrayContactos = contactosEmergencia.filter(contactosEmergencia => (contactosEmergencia.telefono != null ? contactosEmergencia.telefono.includes(textBusqueda.value) : null));
            }

            if (textBusqueda.value == "") {
                var arrayContactos = contactosEmergencia;
            }

            if (window.admiteCEmergencia == 1) await cargarContactoEmergencia(arrayContactos, urlEdit);
        }
    }
        

    $(document).on('click', '.btn-dlt', function () {
        let usuarioId = $(this).data("id");   
     
        Swal.fire({
            title: '¿Seguro que deseas eliminar a este usuario de tus contactos de emergencia?',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            html: 
                "<br>" +
                '<button type="button" id="btn1" role="button" tabindex="0" data-id="' + usuarioId+'" class="btn btn-warning">' + 'confirmar' + '</button>' +
                '<button type="button" id="btn2" role="button" tabindex="0" class="btn btn-info ">' + 'cancelar' + '</button>',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire('Saved!', '', 'success')
            } else if (result.isCancel) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })

        let btn1 = document.getElementById("btn1");
        btn1.onclick = async () => {

            
            //let agregar = "Actualizado";
            let agregar = null;
            agregar = await changeStateBeneficiario(usuarioId, uid, window.idCliente, true);
            if (agregar.status === 'Actualizado') {
                $("div[data-idben=" + usuarioId + "]").hide();
                swal.fire("Usuario eliminado de tus contactos de emergencia.", {
                    icon: "warning",
                });
                if (contactosEmergencia.length - 1 < window.cantCEmergencia) {
                    document.getElementById("btn-agregar-contacto").hidden = false;
                }
            } else if (agregar.status === 'EXISTE') {
                swal.fire("Usuario ya es tu contactos de emergencia", {
                    icon: "info",
                });
            }
            else {
                swal.fire("Error al agregar usuario", {
                    icon: "error",
                });
            }

        };
        let btn2 = document.getElementById("btn2");
        btn2.onclick = async () => {
            swal.close();
            return false;
        };
    });


   

    $('#json_data').on('click', '.cambiaEstado', function () {
        var id = $(this)[0].dataset.idpersona;
        var nombre = $(this)[0].dataset.nombre;
        swal.fire({
            title: 'Cambio de estado',
            text: nombre,
            type: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, cambialo'
        }).then(async function (result) {
            if (result.value) {

                alert("Click crear agenda");

            }
        });

    });



    $('#kt_form_status').on('change', function () {
        datatable.search($("#kt_form_status option:selected").val(), 'estado');
    });




   
}


async function iterarContactos(contacto, index, array, urlEdit) {
    {
        
        let divCajContacto = document.createElement('div');
        divCajContacto.classList.add('col-12', 'col-md-3', 'col-xl-3');
        divCajContacto.setAttribute('data-idBen', contacto.userId);
        divCajContacto.setAttribute('data-nombre', contacto.nombre);
        divCajContacto.setAttribute('data-apellido', contacto.apellidoPaterno);
        divCajContacto.setAttribute('data-apellidoMaterno', contacto.apellidomaterno);
        divCajContacto.setAttribute('data-rut', contacto.identificador);
        divCajContacto.setAttribute('data-celBen', contacto.telefonoMovil);
        divCajContacto.setAttribute('data-telBen', contacto.telefono);
        divCajContacto.setAttribute('data-correo', contacto.correo);

        var divCard = document.createElement('div');
        divCard.classList.add('card', 'card-carga');

        var divIcon = document.createElement('div');
        divIcon.classList.add('icon');

        let icon = document.createElement('i');
        icon.classList.add('fal', 'fa-user');


        var divData = document.createElement('div');
        divData.classList.add('data-carga');

        var divNombre = document.createElement('div');
        divNombre.classList.add('nombre');

        var nombreFormat = contacto.nombre;
        var apellidoFormat = contacto.apellidoPaterno;
        nombreFormat = nombreFormat.replace(/\b\w/g, l => l.toUpperCase());
        apellidoFormat = apellidoFormat.replace(/\b\w/g, l => l.toUpperCase());
        var firstApellidoPaterno = apellidoFormat[0] + '.';

        var apellidoMaFormat = contacto.apellidoMaterno;
        if (apellidoMaFormat != null && apellidoMaFormat.length > 0) {
            apellidoMaFormat = apellidoMaFormat[0];
            apellidoMaFormat = apellidoMaFormat.replace(/\b\w/g, l => l.toUpperCase());
            apellidoMaFormat = apellidoMaFormat + ".";
        }


        let nombreCompleto = nombreFormat + ' ' + apellidoFormat + ' ';
        if (nombreCompleto.length > 18) {
            nombreCompleto = nombreFormat + ' ' + apellidoFormat;
            if (nombreCompleto > 18) {
                nombreCompleto = nombreFormat + ' ' + firstApellidoPaterno;
            }
        }

        divNombre.innerHTML = nombreCompleto;

        var rut = document.createElement('small');
        var regex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        var rut1 = contacto.identificador;
        if (contacto.codigoTelefono == "CL") {
            rut1 = rut1.match(regex);
            rut1 = rut1[0];
            //let dni3 = parseInt(rut1);
            var rutFormat = await formatRut(rut1);

            rut.innerHTML = `${rutFormat}`;
        }
        else {
            rut.innerHTML = `${rut1}`;
        }

        var divEmail = document.createElement('div');
        divEmail.classList.add('email');
        var emailIcon = document.createElement('i');
        emailIcon.classList.add('fal', 'fa-envelope');
        var emailText = document.createElement('span');
        emailText.innerHTML = `${contacto.correo}`;

        var divFono = document.createElement('div');
        divFono.classList.add('fono');
        var fonoIcon = document.createElement('i');
        fonoIcon.classList.add('fal', 'fa-phone-alt');
        var fonoText = document.createElement('span');
        var telefono = contacto.telefono;
        if (telefono === null)
            telefono = 'N/A';
        fonoText.innerHTML = `${telefono}`;

        var divCelular = document.createElement('div');
        divCelular.classList.add('movil');
        var celIcon = document.createElement('i');
        celIcon.classList.add('fal', 'fa-mobile');
        var celText = document.createElement('span');
        var celular = contacto.telefonoMovil
        if (celular === null)
            celular = 'N/A';
        celText.innerHTML = `${celular}`;

        var divButtons = document.createElement('div');
        divButtons.classList.add('toolbar-cargas');

        var dltButton = document.createElement('button');
        dltButton.classList.add('btn-icon', 'btn-danger', 'btn-dlt');
        dltButton.setAttribute('data-id', contacto.userId);
        var btnDltIcon = document.createElement('i');
        btnDltIcon.classList.add('fal', 'fa-trash');
        var dltText = document.createElement('span');
        dltText.innerHTML = " Eliminar";


        var url = '/Paciente/EditContacto' + '?idPaciente=' + contacto.userId;
        var editButton = document.createElement('a');
        editButton.setAttribute("href", url);
        editButton.classList.add('btn-icon', 'btn-info');
        var editIcon = document.createElement('i');
        editIcon.classList.add('fal', 'fa-pen');
        var editText = document.createElement('span');
        editText.innerHTML = " Editar";

        dltButton.appendChild(btnDltIcon);
        editButton.appendChild(editIcon);
        dltButton.appendChild(dltText);
        editButton.appendChild(editText);

        divButtons.appendChild(dltButton);
        divButtons.appendChild(editButton);


        divEmail.appendChild(emailIcon);
        divEmail.appendChild(emailText);

        divFono.appendChild(fonoIcon);
        divFono.appendChild(fonoText);

        divCelular.appendChild(celIcon);
        divCelular.appendChild(celText);

        divIcon.appendChild(icon);
        divNombre.appendChild(rut);

        divData.appendChild(divNombre);
        divData.appendChild(divEmail);
        divData.appendChild(divFono);
        divData.appendChild(divCelular);


        divCard.appendChild(divIcon);
        divCard.appendChild(divData);
        divCard.appendChild(divButtons);

        divCajContacto.appendChild(divCard);
        let divContacto = document.getElementById('listaContactoEmergencia');
        divContacto.appendChild(divCajContacto);

    }
};


async function cargarContactoEmergencia(contactos, urlEdit) {
    clearBeneficiarios("listaContactoEmergencia");
    listaContactoEmergencia.innerHTML = "";
    contactos.forEach(iterarContactos);
};

async function clearBeneficiarios(elementID) {
    document.getElementById(elementID).innerHTML = "";
};



async function formatRut(rut) {
    // Despejar Puntos
    var valor = rut.replace('.', '');
    // Despejar Guión
    var valor = valor.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    var cuerpo = valor.slice(0, -1);
    cuerpo = cuerpo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var dv = valor.slice(-1).toUpperCase();

    // Formatear RUN
    rut = cuerpo + '-' + dv;
    return rut;
}


