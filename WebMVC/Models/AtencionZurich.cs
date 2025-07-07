using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebMVC.Models
{
    public class AtencionZurich
    {
        public Infoatencion infoAtencion { get; set; }
        public Atencionmodel atencionModel { get; set; }
        public int err { get; set; }
    }

    public class Infoatencion
    {
        public int idMedico { get; set; }
        public string nombreMedico { get; set; }
        public Horadesde horaDesde { get; set; }
        public Horahasta horaHasta { get; set; }
        public DateTime fecha { get; set; }
        public int idHora { get; set; }
        public int idBloqueHora { get; set; }
        public int idAtencion { get; set; }
        public int idPaciente { get; set; }
        public string nombrePaciente { get; set; }
        public string estadoAtencion { get; set; }
        public string correoMedico { get; set; }
        public string especialidad { get; set; }
        public string correoPaciente { get; set; }
        public int valorAtencion { get; set; }
        public int zonaHoraria { get; set; }
        public int idEspecialidadFilaUnica { get; set; }
        public bool nsp { get; set; }
        public string horaDesdeText { get; set; }
        public string horaDesdeTextPaciente { get; set; }
        public string horaDesdeTextMedico { get; set; }
        public object apellidoPaternoMedico { get; set; }
        public object apellidoMaternoMedico { get; set; }
        public string horaHastaText { get; set; }
        public object fechaText { get; set; }
        public object cantidadHrsOcupadas { get; set; }
        public object cantidadHrsDisponibles { get; set; }
        public object cantidadHrsTotales { get; set; }
        public object proximaHrDisponible { get; set; }
        public int cantidadHistorial { get; set; }
        public string fotoPerfil { get; set; }
        public string prefijoProfesional { get; set; }
        public object titulo { get; set; }
        public object infoPersona1 { get; set; }
        public int idDuracionAtencion { get; set; }
        public int idCliente { get; set; }
        public int duracionAtencion { get; set; }
        public int idMedicoHora { get; set; }
        public int idEspecialidad { get; set; }
        public int profesionalesActivos { get; set; }
        public int profesionalesInactivos { get; set; }
        public int gruposActivos { get; set; }
        public int gruposInactivos { get; set; }
        public object textoHorario { get; set; }
        public string codigoPrestacion { get; set; }
        public string rutMedico { get; set; }
        public string rutPaciente { get; set; }
        public object codigoEspecialidad { get; set; }
        public object modalidad { get; set; }
        public object cvp { get; set; }
        public int idSucursal { get; set; }
        public int idLugarAtencion { get; set; }
        public bool cobrar { get; set; }
        public bool atencionDirecta { get; set; }
        public int idModeloAtencion { get; set; }
        public int idReglaPago { get; set; }
        public int idConvenio { get; set; }
        public object paraEspecialidad { get; set; }
        public object info { get; set; }
        public bool puedeEliminar { get; set; }
        public DateTime fechaHora { get; set; }
        public object almaMater { get; set; }
        public string numeroRegistro { get; set; }
        public object confirmaPaciente { get; set; }
        public bool inicial { get; set; }
        public bool profesionalesAsociados { get; set; }
        public object tipoFiltro { get; set; }
        public object titleSwal { get; set; }
        public object mensajeRetorno { get; set; }
        public object buttonType { get; set; }
        public object mensajeDisclaimer { get; set; }
        public object tipoMensaje { get; set; }
        public bool swalVisible { get; set; }
        public object textMail { get; set; }
        public bool peritaje { get; set; }
        public bool aceptaProfesionalInvitado { get; set; }
        public object tienePsiquiatra { get; set; }
        public int cantidadHoras { get; set; }
        public object configuration { get; set; }
    }

    public class Horadesde
    {
        public bool hasValue { get; set; }
        public Value value { get; set; }
    }

    public class Value
    {
        public long ticks { get; set; }
        public int days { get; set; }
        public int hours { get; set; }
        public int milliseconds { get; set; }
        public int minutes { get; set; }
        public int seconds { get; set; }
        public float totalDays { get; set; }
        public int totalHours { get; set; }
        public int totalMilliseconds { get; set; }
        public int totalMinutes { get; set; }
        public int totalSeconds { get; set; }
    }

    public class Horahasta
    {
        public bool hasValue { get; set; }
        public Value1 value { get; set; }
    }

    public class Value1
    {
        public long ticks { get; set; }
        public int days { get; set; }
        public int hours { get; set; }
        public int milliseconds { get; set; }
        public int minutes { get; set; }
        public int seconds { get; set; }
        public float totalDays { get; set; }
        public float totalHours { get; set; }
        public int totalMilliseconds { get; set; }
        public int totalMinutes { get; set; }
        public int totalSeconds { get; set; }
    }

    public class Atencionmodel
    {
        public int id { get; set; }
        public int idBloqueHora { get; set; }
        public int idPaciente { get; set; }
        public Horamedico horaMedico { get; set; }
        public int idTriageMolestia { get; set; }
        public object triageMolestia { get; set; }
        public int idTriageNivel { get; set; }
        public object triageNivel { get; set; }
        public object triageTiempo { get; set; }
        public object convenios { get; set; }
        public int idTriageTiempo { get; set; }
        public object triageObservacion { get; set; }
        public object antecedentesMedicos { get; set; }
        public object diagnosticoMedico { get; set; }
        public object examenMedico { get; set; }
        public object certificadoMedico { get; set; }
        public object tratamientoMedico { get; set; }
        public object medicamentosMedico { get; set; }
        public object controlMedico { get; set; }
        public object observaciones { get; set; }
        public object linkYapp { get; set; }
        public int idMedicoHora { get; set; }
        public object idMedicoHoraOriginalAnulada { get; set; }
        public object inicioAtencion { get; set; }
        public object terminoAtencion { get; set; }
        public object idVideoCall { get; set; }
        public string estado { get; set; }
        public DateTime fechaCreacion { get; set; }
        public int idUsuarioCreacion { get; set; }
        public object fechaModifica { get; set; }
        public object idUsuarioModifica { get; set; }
        public bool nsp { get; set; }
        public object descripcionNSP { get; set; }
        public bool sospechaCovid19 { get; set; }
        public object ingresoAtencionPaciente { get; set; }
        public string idSesionPlataformaExterna { get; set; }
        public bool nspPaciente { get; set; }
        public bool particular { get; set; }
        public object idMedicoHoraReasigna { get; set; }
        public object horaNuevoOrden { get; set; }
        public object idMedicoFirmante { get; set; }
        public bool solicitaFirma { get; set; }
        public object inicioAtencionPacienteCall { get; set; }
        public object confirmaPaciente { get; set; }
        public object motivoNsp { get; set; }
        public bool aceptaProfesionalInvitado { get; set; }
        public object motivoConsultaMedico { get; set; }
        public object fechaInicioCertificado { get; set; }
        public object fechaTerminaCertificado { get; set; }
        public object incapacidadMedica { get; set; }
        public string diagnosticoPsicopedagogico { get; set; }
        public string objetivosDeLaSesion { get; set; }
        public object patologiasString { get; set; }
        public object examenes { get; set; }
        public object patologias { get; set; }
        public object archivos { get; set; }
        public object receta { get; set; }
        public object medicamentos { get; set; }
        public string nombreMedico { get; set; }
        public string nombrePaciente { get; set; }
        public string telefonoPaciente { get; set; }
        public string correoPaciente { get; set; }
        public string correoMedico { get; set; }
        public string horaDesdeText { get; set; }
        public string fechaText { get; set; }
        public string especialidad { get; set; }
        public object estadoPago { get; set; }
        public int idmedicoAsociado { get; set; }
        public object correoInvitados { get; set; }
        public object fichaPaciente { get; set; }
        public object urlConvenio { get; set; }
        public object textoMarca { get; set; }
        public string rutaVirtual { get; set; }
        public object inicioAtencionPacienteInforme { get; set; }
        public object terminoAtencionPaciente { get; set; }
        public object inicioAtencionMedicoInforme { get; set; }
        public bool atencionDirecta { get; set; }
        public int idMedico { get; set; }
        public int idConvenio { get; set; }
        public object fecha { get; set; }
        public string identificador { get; set; }
        public string nombre { get; set; }
        public string apellidoPaterno { get; set; }
        public object recetaTemp { get; set; }
        public string fotoPerfil { get; set; }
        public object idAtencion { get; set; }
        public string horaDesdeTextPaciente { get; set; }
        public string horaDesdeTextMedico { get; set; }
        public object mensaje { get; set; }
        public object tiempo { get; set; }
        public object posicion { get; set; }
        public object numeroRegistro { get; set; }
        public object codigoPais { get; set; }
        public bool envioNps { get; set; }
        public object valorAtencion { get; set; }
        public object valorConvenio { get; set; }
        public object aporteCaff { get; set; }
        public object aporteFinanciador { get; set; }
        public object aporteSeguro { get; set; }
        public object copago { get; set; }
        public object planSalud { get; set; }
        public object montoPrestacion { get; set; }
        public bool bonoActivo { get; set; }
        public int id_bono { get; set; }
        public int folioBono { get; set; }
        public int id_atencion_medipass { get; set; }
        public object hash { get; set; }
        public object respuestaFonasa { get; set; }
        public int idCliente { get; set; }
        public object bonoPlataformaExterna { get; set; }
        public bool cancelaPlataformaExterna { get; set; }
        public object patologiaTextoAbierto { get; set; }
        public bool consentimientoInformado { get; set; }
        public bool peritaje { get; set; }
        public object fechaAsignaDesdeFila { get; set; }
        public object fechaCreacionAntesReInserta { get; set; }
        public int idEspecialidadFilaUnica { get; set; }
        public object linkPharol { get; set; }
        public object linkFarmalisto { get; set; }
        public object linkVitau { get; set; }
        public int idEspecialidadDerivacion { get; set; }
        public bool isFonasa { get; set; }
        public int idEspecialidadDestino { get; set; }
        public bool mostrarDerivacion { get; set; }
        public object infoPaciente { get; set; }
        public int convenioEmpresa { get; set; }
        public object codigoPrestacion { get; set; }
        public object infoDerivacion { get; set; }
        public object estadoAtencion { get; set; }
        public int idEspecialidad { get; set; }
        public object prefijoProfesional { get; set; }
        public object glosaEspecialidadDerivacion { get; set; }
        public object farmaciasExternas { get; set; }
        public object configuration { get; set; }
    }

    public class Horamedico
    {
        public int idMedico { get; set; }
        public string nombreMedico { get; set; }
        public object horaDesde { get; set; }
        public object horaHasta { get; set; }
        public DateTime fecha { get; set; }
        public int idHora { get; set; }
        public int idBloqueHora { get; set; }
        public int idAtencion { get; set; }
        public int idPaciente { get; set; }
        public string nombrePaciente { get; set; }
        public string estadoAtencion { get; set; }
        public string correoMedico { get; set; }
        public string especialidad { get; set; }
        public string correoPaciente { get; set; }
        public int valorAtencion { get; set; }
        public int zonaHoraria { get; set; }
        public int idEspecialidadFilaUnica { get; set; }
        public bool nsp { get; set; }
        public object horaDesdeText { get; set; }
        public object horaDesdeTextPaciente { get; set; }
        public object horaDesdeTextMedico { get; set; }
        public object apellidoPaternoMedico { get; set; }
        public object apellidoMaternoMedico { get; set; }
        public object horaHastaText { get; set; }
        public object fechaText { get; set; }
        public object cantidadHrsOcupadas { get; set; }
        public object cantidadHrsDisponibles { get; set; }
        public object cantidadHrsTotales { get; set; }
        public object proximaHrDisponible { get; set; }
        public int cantidadHistorial { get; set; }
        public object fotoPerfil { get; set; }
        public string prefijoProfesional { get; set; }
        public object titulo { get; set; }
        public object infoPersona1 { get; set; }
        public int idDuracionAtencion { get; set; }
        public int idCliente { get; set; }
        public int duracionAtencion { get; set; }
        public int idMedicoHora { get; set; }
        public int idEspecialidad { get; set; }
        public int profesionalesActivos { get; set; }
        public int profesionalesInactivos { get; set; }
        public int gruposActivos { get; set; }
        public int gruposInactivos { get; set; }
        public object textoHorario { get; set; }
        public string codigoPrestacion { get; set; }
        public string rutMedico { get; set; }
        public string rutPaciente { get; set; }
        public object codigoEspecialidad { get; set; }
        public object modalidad { get; set; }
        public object cvp { get; set; }
        public int idSucursal { get; set; }
        public int idLugarAtencion { get; set; }
        public bool cobrar { get; set; }
        public bool atencionDirecta { get; set; }
        public int idModeloAtencion { get; set; }
        public int idReglaPago { get; set; }
        public int idConvenio { get; set; }
        public object paraEspecialidad { get; set; }
        public object info { get; set; }
        public bool puedeEliminar { get; set; }
        public DateTime fechaHora { get; set; }
        public object almaMater { get; set; }
        public string numeroRegistro { get; set; }
        public object confirmaPaciente { get; set; }
        public bool inicial { get; set; }
        public bool profesionalesAsociados { get; set; }
        public object tipoFiltro { get; set; }
        public object titleSwal { get; set; }
        public object mensajeRetorno { get; set; }
        public object buttonType { get; set; }
        public object mensajeDisclaimer { get; set; }
        public object tipoMensaje { get; set; }
        public bool swalVisible { get; set; }
        public object textMail { get; set; }
        public bool peritaje { get; set; }
        public bool aceptaProfesionalInvitado { get; set; }
        public object tienePsiquiatra { get; set; }
        public int cantidadHoras { get; set; }
        public object configuration { get; set; }
    }

}

