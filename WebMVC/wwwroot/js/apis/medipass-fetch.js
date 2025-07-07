import { putValoresAtencion, putDatosBono, getAtencion, grabarCodeMedipass } from "./atencion-fetch.js";
var baseServicio = '';
var baseServicioValorizacion = '';
var apiKey = '';
var authorization = '';
var urlPasarela = '';
var nro_cliente = 0;

var sucursal =0;
var lugarAtencion = 0;

var baseUrlMedi = new URL(window.location.href);


var ID_prestador = 0;
var ID_sucursal = 0;
var ID_lugar_atencion = 0;
var ID_punto_atencion = 0;
var ID_usuario = 0;


if (baseUrlMedi.hostname.includes("qa") || baseUrlMedi.hostname.includes("localhost")) {

    baseServicio = 'https://qa-manager.inexoos.com';
    baseServicioValorizacion = 'https://qa-manager.inexoos.com/qa';

    apiKey = "r11shzuF1RDf9fGtpAjHLyJVhoCsaYwNOgIidw3r";
    //apiKey = "XnfoZ5r0ohMr6D5EvhGlDI8ILOjUwvUx0cAJs3IR";
    authorization = "95kzEJ8ht12J8ht-88dfa366dc15";
    //authorization = "f71d1f32746395d9bb496600d4b";
    urlPasarela = "https://testing-pagos.inexoos.com";
    nro_cliente = "c4ca4238a0b923820dcc509a6f75849b";


    ID_prestador = 1;
    ID_sucursal = 1;
    ID_lugar_atencion = 1;
    ID_punto_atencion = 1;
    ID_usuario = 3;

    

} else {

    baseServicio = 'https://manager.inexoos.com';
    baseServicioValorizacion = 'https://manager.inexoos.com';
    apiKey = "XnfoZ5r0ohMr6D5EvhGlDI8ILOjUwvUx0cAJs3IR";
    authorization = "6ca166c365d3168d54cdeb835096e81";
    urlPasarela = "https://pagos.inexoos.com";
    nro_cliente = "a87ff679a2f3e71d9181a67b7542122c";

    ID_prestador = 105;
    ID_sucursal = 217;
    ID_lugar_atencion = 215;
    ID_punto_atencion = 216;
    ID_usuario = 467;
}


export async function activarBono(idAtencion) {
    try {

         
        var atencion = await getAtencion(idAtencion);

        if (atencion && atencion.hash && atencion.hash != '') {
            let response = await fetch(`${baseServicioValorizacion}/activa/atencion?api_key=${apiKey}&id_atencion=${atencion.id_atencion_medipass}&hash=${atencion.hash}`, {
                method: 'GET'
            });
            let responseJson = await response.json();

            if (responseJson && responseJson.response && responseJson.response.data && responseJson.response.data.validarResponse && responseJson.response.data.validarResponse.estado === 1) {
                if (responseJson.response.data.bonos) {
                    var idBono = 0;
                    var folioBono = 0;
                    if (responseJson.response.data.bonos.info) {
                        idBono = responseJson.response.data.bonos.info[0].id_bono;
                        folioBono = responseJson.response.data.bonos.info[0].folio;
                    }
                    let objAtencion = {
                        bonoActivo: true,
                        id_bono: idBono,
                        folioBono: folioBono,
                        id_atencion_medipass: responseJson.response.data.bonos.atencion,
                        hash: atencion.hash,
                        codigoPrestacion: atencion.codigoPrestacion,
                        identificador: atencion.identificador

                    };

                    await putDatosBono(atencion.id, objAtencion);
                }
            }
            return responseJson;
        }

       
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function TipoAtencion(atencion) {
    ;
    var esParticular = false;
    var resultCert = await certificacion(atencion.fichaPaciente.identificador);

    if (resultCert.response.data.validarResponse.estado === 1 && resultCert.response.data.validarResponse.gloEstado !== 'Beneficiario afiliado') {
        esParticular = true;
        
    }

    return esParticular;
}




export async function valorizar(nombreEspecialidad, rutPaciente, rutMedico, codigoPrestacion, genero, fechanacimiento, valorAtencion, idSucursal, idLugarAtencion, idAtencion, certificar) {
    var esParticular = true;
    var planSalud = null;
    var resultWS = null;

    sucursal = ID_sucursal ;
    lugarAtencion = ID_lugar_atencion ;
    ;

    if (certificar) {
        try {
            var resultCert = await certificacion(rutPaciente);

            if (resultCert.response.data.validarResponse.estado === 1 && resultCert.response.data.validarResponse.gloEstado === 'Beneficiario afiliado') {
                esParticular = false;
                planSalud = resultCert.response.data.beneficiario.cotizante.planSalud;
            }
        } catch (error) {

        }
    }
  
    if (window.host.includes("fletcher.") || window.host.includes("bicevida")) {
        esParticular = true;
    }
        
    //COmentar una vez que se habilite particular.
    //esParticular = true;

   

    if (esParticular) {
        resultWS = await valorizarParticular(nombreEspecialidad,
            rutPaciente,
            rutMedico,
            codigoPrestacion,
            genero,
            fechanacimiento);

    } else {

        resultWS = await valorizarFonasa(nombreEspecialidad,
            rutPaciente,
            rutMedico,
            codigoPrestacion,
            genero,
            fechanacimiento,
            planSalud);

    }

    var valorizacion = {
        valorConvenio: 0,
        aporteCaff: 0,
        aporteFinanciador: 0,
        aporteSeguro: 0,
        copago: 0,
        particular: true
    };

    if (resultWS &&
        resultWS.response &&
        resultWS.response.data &&
        resultWS.response.data.prestaciones &&
        resultWS.response.data.prestaciones.bonificadas &&
        resultWS.response.data.prestaciones.bonificadas.prestacion &&
        resultWS.response.data.prestaciones.bonificadas.prestacion.length > 0 && certificar) {

        valorizacion.valorConvenio = resultWS.response.data.prestaciones.bonificadas.prestacion[0].valorConvenido;
        valorizacion.aporteCaff = resultWS.response.data.prestaciones.bonificadas.prestacion[0].bonificaciones.aporteCaff;
        valorizacion.aporteFinanciador = resultWS.response.data.prestaciones.bonificadas.prestacion[0].bonificaciones.aporteFinanciador;
        if (resultWS.response.data.prestaciones.bonificadas.prestacion[0].bonificaciones.aporteSeguro) {
            valorizacion.aporteSeguro = resultWS.response.data.prestaciones.bonificadas.prestacion[0].bonificaciones.aporteSeguro.aporteTotal;
        }
        valorizacion.copago = resultWS.response.data.prestaciones.bonificadas.prestacion[0].copago;
        valorizacion.particular = false;
            

        if (idAtencion) {
           

            let atencion = {
                valorAtencion : valorAtencion,
                valorConvenio: valorizacion.valorConvenio,
                aporteCaff: valorizacion.aporteCaff,
                aporteFinanciador: valorizacion.aporteFinanciador,
                aporteSeguro: valorizacion.aporteSeguro,
                copago: valorizacion.copago,
                planSalud: planSalud,
                montoPrestacion: valorizacion.valorConvenio,
            };

            

            await putValoresAtencion(idAtencion, atencion);
            
        }


    } else if (resultWS &&
        resultWS.response &&
        resultWS.response.data &&
        resultWS.response.data.prestaciones &&
        resultWS.response.data.prestaciones.particulares &&
        resultWS.response.data.prestaciones.particulares.prestacion &&
        resultWS.response.data.prestaciones.particulares.prestacion.length > 0 && certificar) {

        if (resultWS.response.data.prestaciones.particulares.prestacion[0].valorConvenido) {
            valorizacion.valorConvenio = resultWS.response.data.prestaciones.particulares.prestacion[0].valorConvenido;
        } else {
            valorizacion.valorConvenio = resultWS.response.data.prestaciones.particulares.prestacion[1].valorConvenido;
        }

        //VERIFICAR ESTE IFFF
        if (window.host.includes("fletcher.") || window.host.includes("bicevida")) {
            valorizacion.valorConvenio = valorAtencion;
        }
    } else {
        valorizacion.valorConvenio = valorAtencion;
    }

    

    //valorizacion.valorConvenio = valorAtencion;

    return valorizacion;

}

export async function validarIdentificacion(rut, dv, serie) {
    try {


        let response = await fetch(`${baseServicio}/identificacion/serie?run=${rut}&dv=${dv}&serie=${serie}&api_key=${apiKey}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}



export async function certificacion(rut) {
    try {


        var myHeaders = new Headers();
        myHeaders.append("X-Api-Key", apiKey);
        myHeaders.append("idSucursal", ID_sucursal );

        let response = await fetch(`${baseServicioValorizacion}/ram/cache/afiliacion/identificacion/${rut}/usuario/1`, {
            method: 'GET',
            headers: myHeaders
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function valorizarParticular(nombreEspecialidad, rutPaciente, rutMedico, codigoPrestacion, genero, fechanacimiento) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("X-Api-Key", apiKey);
        myHeaders.append("idSucursal", ID_sucursal );
        myHeaders.append("Authorization", authorization);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "codigoIsapre": 2,
            "idLugarAtencion": ID_lugar_atencion ,
            "especialidad": nombreEspecialidad,
            "rutBeneficiario": rutPaciente,
            "fechaNacimiento": fechanacimiento,
            "genero": genero,
            "rutTitular": rutPaciente,
            "rutMedicoTratante": rutMedico,
            "rutMedicoSolicitante": rutMedico,
            "urgencia": "N",
            "prestaciones": {
                "particulares": [
                    {
                        "codigoPrestacionPrestador": codigoPrestacion,
                        "recargoHora": "N",
                        "cantidad": 1,
                        "descPrestacionFinanciador": "CONSULTA " + nombreEspecialidad,
                        "planSalud": null
                    }
                ],
                "bonificadas": []
            }
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let response = await fetch(`${baseServicioValorizacion}/ram/valorizar`, requestOptions);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function emitirPrebono(atencion) {
    try {

       
        var myHeaders = new Headers();
        myHeaders.append("X-Api-Key", apiKey);
        myHeaders.append("idSucursal", ID_sucursal );
        myHeaders.append("Authorization", authorization);
        myHeaders.append("Content-Type", "application/json");
        ;
        var raw = JSON.stringify({
            "emitir": {
                "codigoIsapre": 1,
                "idLugarAtencion": ID_lugar_atencion,
                "idPuntoAtencion": ID_punto_atencion,
                "especialidad": atencion.infoMedico.especialidad,
                "urgencia": "N",
                "rutMedicoTratante": atencion.horaMedico.rutMedico,
                "rutBeneficiario": atencion.fichaPaciente.identificador,
                "nombreTitular": atencion.fichaPaciente.nombreCompleto,
                "rutTitular": atencion.fichaPaciente.identificador,
                "rutCajero": atencion.horaMedico.rutMedico,//Rut del medico
                "montoExcedente": 0,
                "montoTotal": atencion.valorConvenio,
                "montoTotalCopago": atencion.copago,
                "montoTotalBonificado": (atencion.aporteCaff + atencion.aporteFinanciador + atencion.aporteSeguro),
                "rutAcompanante": null,
                "id_usuario": ID_usuario ,
                "rut_medico": atencion.horaMedico.rutMedico,
                "huella": 0,
                "is_carga": null,
                "nro_comprobante": null,
                "idPrestador": ID_prestador  ,
                "folios": {
                    "bonificables": [
                        {
                            "planSalud": atencion.planSalud,
                            "prestaciones": {
                                "prestacion": [
                                    {
                                        "item": 0,
                                        "codigo_prestacion": atencion.infoMedico.codigoPrestacion,
                                        "codigo_prestacion_prestador": atencion.infoMedico.codigoPrestacion,
                                        "recargo_hora": "N",
                                        "cantidad": 1,
                                        "monto_prestacion": atencion.valorConvenio,
                                        "aporteFinanciador": atencion.aporteFinanciador,
                                        "aporteSeguro": {
                                            "aporteTotal": atencion.aporteSeguro,
                                            "seguros": [

                                            ]
                                        },
                                        "aporteCaff": atencion.aporteCaff,
                                        "copago": atencion.copago,
                                        "otros": 0,
                                        "finanInt": 0
                                    }
                                ]
                            }
                        }
                    ]
                },
                "telemedicina": true,
                "send_mail": false,
                "correo": atencion.fichaPaciente.correo,
                "telefono": atencion.fichaPaciente.telefonoMovil,
                "fecha_atencion": moment(atencion.fechaTex).format('YYYY-MM-DD')
            },
            "pagoAtencion": {
                "usoExcedentes": {
                    "estado": 0,
                    "codigo_isapre": 1
                },
                "pagos": {
                    "pago": [
                        {
                            "idTipoPago": 11,
                            "idMedioPago": 40,
                            "data": {
                                "medio": {
                                    "medioPago": 37,
                                    "nombre": "Payku",
                                    "visible": false
                                },
                                "banco": null,
                                "voucher": null,
                                "monto": atencion.copago,
                                "vuelto": 0
                            }
                        }
                    ]
                }
            }
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        
        let response = await fetch(`${baseServicioValorizacion}/ram/bono`, requestOptions);
        let responseJson = await response.json();

        if (responseJson && responseJson.response && responseJson.response.data && responseJson.response.data.validarResponse && responseJson.response.data.validarResponse.estado === 1) {
            if (responseJson.response.data.bonos) {
                var idBono = 0;
                var folioBono = 0;
                if (responseJson.response.data.bonos.info) {
                    idBono = responseJson.response.data.bonos.info[0].id_bono;
                    folioBono = responseJson.response.data.bonos.info[0].folio;
                }
                let objAtencion = {
                    bonoActivo: false,
                    id_bono: idBono,
                    folioBono: folioBono,
                    id_atencion_medipass: responseJson.response.data.bonos.atencion,
                    hash: responseJson.response.data.bonos.hash
                };
                
                await putDatosBono(atencion.id, objAtencion);
                //let modalBodyBono = document.getElementById('modalBodyBono');
                //$("#modalBodyBono").empty();
                //let embed = document.createElement('embed');
                //embed.src = `${baseServicioValorizacion}/imprime-bono?api_key=${apiKey}&hash=${responseJson.response.data.bonos.hash}`;
                //embed.style.width = "100%";
                //embed.style.height = "700px";
                //document.getElementById('tituloBono').innerHTML = "Pre Bono"
                //modalBodyBono.appendChild(embed);
                //$("#modalBono").modal("show");
                //window.open(`${baseServicioValorizacion}/imprime-bono?api_key=${apiKey}&hash=${responseJson.response.data.bonos.hash}`, "_blank");
                return responseJson.response.data.bonos.hash;

                
            }
        }

        
        return null;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function EmitirbonoParticular(atencion) {
    try {
        var idBono = 0;
        var folioBono = 0;
      
        let objAtencion = {
            bonoActivo: false,
            id_bono: idBono,
            folioBono: folioBono,
            id_atencion_medipass: 0,
            hash: atencion.id.toString()
        };

        await putDatosBono(atencion.id, objAtencion);
        return atencion.id
    }
    //    ;

    //    Swal.showLoading()
    //    var myHeaders = new Headers();
    //    myHeaders.append("X-Api-Key", apiKey);
    //    myHeaders.append("idSucursal", ID_sucursal );
    //    myHeaders.append("Authorization", authorization);
    //    myHeaders.append("Content-Type", "application/json");

    //    var raw = {
    //        "emitir": {
    //            "codigoIsapre": 2,
    //            "idLugarAtencion": ID_lugar_atencion,
    //            "idPuntoAtencion": ID_punto_atencion,
    //            "especialidad": atencion.infoMedico.especialidad,
    //            "urgencia": "N",
    //            "rutMedicoTratante": atencion.horaMedico.rutMedico,
    //            "rutBeneficiario": atencion.fichaPaciente.identificador,
    //            "nombreTitular": atencion.fichaPaciente.nombreCompleto,
    //            "rutTitular": atencion.fichaPaciente.identificador,
    //            "rutCajero": "13595630-9",//Rut del medico
    //            "montoExcedente": 0,
    //            "montoTotal": atencion.valorConvenio,
    //            "montoTotalCopago": atencion.copago,
    //            "montoTotalBonificado": (atencion.aporteCaff + atencion.aporteFinanciador + atencion.aporteSeguro),
    //            "rutAcompanante": null,
    //            "id_usuario": ID_usuario,
    //            "rut_medico": atencion.horaMedico.rutMedico,
    //            "folios": {
    //                "bonificables": [],
    //                "particulares": [
    //                    {
    //                        //"planSalud": "D",
    //                        "prestaciones": {
    //                            "prestacion": [
    //                                {
    //                                    "item": 0,
    //                                    "codigo_prestacion": atencion.infoMedico.codigoPrestacion,
    //                                    "codigo_prestacion_prestador": atencion.infoMedico.codigoPrestacion,
    //                                    "recargo_hora": "N",
    //                                    "cantidad": 1,
    //                                    "monto_prestacion": atencion.valorConvenio,
    //                                    "aporteFinanciador": 0.0,
    //                                    "aporteSeguro": {
    //                                        "aporteTotal": 0,
    //                                        "seguros": [],
    //                                        "deducible": 0
    //                                    },
    //                                    "aporteCaff": 0,
    //                                    "copago": atencion.valorConvenio,
    //                                    "otros": 0,
    //                                    "finanInt": 0
    //                                }
    //                            ]
    //                        }
    //                    }
    //                ],
    //                "cantidadFolios": {
    //                    "particular": 1,
    //                    "bonificable": 0
    //                }
    //            },
    //            "huella": 0,
    //            "is_carga": null,
    //            "nro_comprobante": null,
    //            "idPrestador": ID_prestador 
    //            //"id_medico": [
    //            //    21
    //            //]
                
    //        },
    //        "pagoAtencion": {
    //            "usoExcedentes": {
    //                "estado": 0,
    //                "codigo_isapre": 2
    //            },
    //            "pagos": {
    //                "pago": [
    //                    {
    //                        "idTipoPago": 11,
    //                        "idMedioPago": 40,
    //                        "data": {
    //                            "medio": {
    //                                "medioPago": 37,
    //                                "nombre": "Payku",
    //                                "visible": false
    //                            },
    //                            "banco": null,
    //                            "voucher": null,
    //                            "monto": atencion.copago,
    //                            "vuelto": 0
    //                        }
    //                    }
    //                ]
    //            }
    //        }
    //    };

    //    var requestOptions = {
    //        method: 'POST',
    //        headers: myHeaders,
    //        body: JSON.stringify(raw),
    //        redirect: 'follow'
    //    };

        
    //    let response = await fetch(`${baseServicioValorizacion}/ram/bono`, requestOptions);
    //    let responseJson = await response.json();

    //    if (responseJson && responseJson.response && responseJson.response.data && responseJson.response.data.validarResponse && responseJson.response.data.validarResponse.estado === 1) {
    //        if (responseJson.response.data.bonos) {
    //            var idBono = 0;
    //            var folioBono = 0;
    //            if (responseJson.response.data.bonos.info) {
    //                idBono = responseJson.response.data.bonos.info[0].id_bono;
    //                folioBono = responseJson.response.data.bonos.info[0].folio;
    //            }
    //            let objAtencion = {
    //                bonoActivo: false,
    //                id_bono: idBono,
    //                folioBono: folioBono,
    //                id_atencion_medipass: responseJson.response.data.bonos.atencion,
    //                hash: responseJson.response.data.bonos.hash
    //            };
                
    //            await putDatosBono(atencion.id, objAtencion);
    //            let modalBodyBono = document.getElementById('modalBodyBono');
    //            $("#modalBodyBono").empty();
    //            let embed = document.createElement('embed');
    //            embed.src = `${baseServicioValorizacion}/imprime-bono?api_key=${apiKey}&hash=${responseJson.response.data.bonos.hash}`;
    //            embed.style.width = "100%";
    //            embed.style.height = "700px";
    //            //document.getElementById('tituloBono').innerHTML = "Bono Particular"
    //            //$("#tituloBono").html("Bono Particular");
    //            //modalBodyBono.appendChild(embed);
    //            //$("#modalBono").modal("show");
    //            //window.open(`${baseServicioValorizacion}/imprime-bono?api_key=${apiKey}&hash=${responseJson.response.data.bonos.hash}`, "_blank");


                
    //        }
    //    }

    //    Swal.close();
    //    return responseJson;
    //} 
    catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function valorizarFonasa(nombreEspecialidad, rutPaciente, rutMedico, codigoPrestacion, genero, fechanacimiento, planSalud) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("X-Api-Key", apiKey);
        myHeaders.append("idSucursal", ID_sucursal );
        myHeaders.append("Authorization", authorization);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "codigoIsapre": 1,
            "idLugarAtencion": ID_lugar_atencion,
            "especialidad": nombreEspecialidad,
            "rutBeneficiario": rutPaciente,
            "fechaNacimiento": fechanacimiento,
            "genero": genero,
            "rutTitular": rutPaciente,
            "rutMedicoTratante": rutMedico,
            "rutMedicoSolicitante": rutMedico,
            "urgencia": "N",
            "prestaciones": {
                "bonificadas": [
                    {
                        "codigoPrestacionPrestador": codigoPrestacion,
                        "recargoHora": "N",
                        "cantidad": 1,
                        "descPrestacionFinanciador": "CONSULTA " + nombreEspecialidad,
                        "planSalud": planSalud,
                        "codigoPrestacion": codigoPrestacion
                    }
                ],
                "particulares": []
            }
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let response = await fetch(`${baseServicioValorizacion}/ram/valorizar`, requestOptions);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function PostPago(hash, correoUsuario, especialidad, valorAtencion) {

    try {
        var json = {
            "sistema": 1,
            "nro_cliente": nro_cliente,
            "nro_pago": hash,
            "redirect_url": `${location.origin}/Paciente/confirmacionPago`,
            "email_destino": correoUsuario,
            "pago": {
                "descripcion": "Consulta medica " + especialidad,
                "monto": valorAtencion,
                "tipo_moneda": "CLP"
            },
            "detalle": [
                {
                    "descripcion": "Consulta medica " + especialidad,
                    "cantidad": 1,
                    "precio": valorAtencion
                }
            ]
        };
        var myHeaders = new Headers();
        
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(json);
        let response = await fetch(urlPasarela,
            {
                method: 'POST',
                headers: myHeaders,
                body: raw
            });
       
        let responseJson = await response.json();

        if (responseJson) {
            var nro_portal = responseJson.nro_portal; //captura valor
            //grabar n portal
            if (nro_portal) {
                var actualizaCodeMedipass = await grabarCodeMedipass(nro_portal, idAtencion);
          
                if (actualizaCodeMedipass.status == "Actualizado") 
                    window.location.href = responseJson.url_redirect;
                else
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error"); return;
            }

        }
        return responseJson;

    } catch (error) {
        alert('Ha ocurrido un error al procesar el pago');
    }
}

export async function PostPagoInvitado(hash, correoUsuario, especialidad, valorAtencion) {
      try {
        var json = {
            "sistema": 1,
            "nro_cliente": nro_cliente,
            "nro_pago": hash,
            "redirect_url": `${location.origin}/PacienteInvitado/confirmacionPago`,
            "email_destino": correoUsuario,
            "pago": {
                "descripcion": "Consulta medica " + especialidad,
                "monto": valorAtencion,
                "tipo_moneda": "CLP"
            },
            "detalle": [
                {
                    "descripcion": "Consulta medica " + especialidad,
                    "cantidad": 1,
                    "precio": valorAtencion
                }
            ]
        };
        var myHeaders = new Headers();
        
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(json);
        let response = await fetch(urlPasarela,
            {
                method: 'POST',
                headers: myHeaders,
                body: raw
            });
       
        let responseJson = await response.json();

        if (responseJson) {
            var nro_portal = responseJson.nro_portal; //captura valor
            //grabar n portal
            if (nro_portal) {
                var actualizaCodeMedipass = await grabarCodeMedipass(nro_portal, idAtencion);
          
                if (actualizaCodeMedipass.status == "Actualizado") 
                    window.location.href = responseJson.url_redirect;
                else
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error"); return;
            }

        }
        return responseJson;

    } catch (error) {
        alert('Ha ocurrido un error al procesar el pago');
    }
}






