using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace WebMVC.Models
{
    public class VwHorasMedicos
    {
        public int IdMedico { get; set; }
        public string NombreMedico { get; set; }
        public TimeSpan? HoraDesde { get; set; }
        public TimeSpan? HoraHasta { get; set; }
        public DateTime? Fecha { get; set; }
        public int IdHora { get; set; }
        public int IdBloqueHora { get; set; }
        public int? IdAtencion { get; set; }
        public int? IdPaciente { get; set; }
        public string NombrePaciente { get; set; }
        public string EstadoAtencion { get; set; }
        public string HoraDesdeText { get; set; }
        public string HoraHastaText { get; set; }
        public string FechaText { get; set; }
        public string CorreoMedico { get; set; }
        public string Especialidad { get; set; }
        public int IdEspecialidad { get; set; }
        public string FotoPerfil { get; set; }
        public bool NSP { get; set; }
        public bool NspPaciente { get; set; }
        public int IdConvenio { get; set; }
        public bool AtencionDirecta { get; set; }
        public DateTime? ConfirmaPaciente { get; set; }
        public bool Cobrar { get; set; }
        public int ZonaHoraria { get; set; }
        public string AlmaMater { get; set; }
        public bool ProfesionalesAsociados { get; set; }
        public string TipoFiltro { get; set; }
        public int IdSucursal { get; set; }
        public int IdLugarAtencion { get; set; }
        public string ApellidoPaternoMedico { get; set; }
        public string ApellidoMaternoMedico { get; set; }
        public int IdModeloAtencion { get; set; }
        public int IdReglaPago { get; set; }
        public int? IdEspecialidadFilaUnica { get; set; }
        public string ParaEspecialidad { get; set; }
        public string Info { get; set; }
        public bool PuedeEliminar { get; set; }
        public DateTime FechaHora { get; set; }
        public string NumeroRegistro { get; set; }
        public string Modalidad { get; set; }
       public bool Inicial { get; set; }
        public string PrefijoProfesional { get; set; }
        public int? IdCliente { get; set; }
        public bool Peritaje { get; set; }
        public bool AceptaProfesionalInvitado { get; set; }
        public String rutMedico { get; set; }
        public int? IdMedicoHora { get; set; }
        public int CantidadHoras { get; set; }
        public int? ValorAtencion { get; set; }
        public bool AtiendeHapp { get; set; }
        public int IdProgramaSalud { get; set; }
        public string CorreoPaciente { get; set; }
        [Computed] public string HoraDesdeTextPaciente { get; set; }
        [Computed] public string HoraDesdeTextMedico { get; set; }
        [Computed] public string CantidadHrsOcupadas { get; set; }
        [Computed] public string CantidadHrsDisponibles { get; set; }
        [Computed] public string CantidadHrsTotales { get; set; }
        [Computed] public string ProximaHrDisponible { get; set; }
        [Computed] public int CantidadHistorial { get; set; }
        [Computed] public string Titulo { get; set; }
        [Computed] public string InfoPersona1 { get; set; }
        [Computed] public int IdDuracionAtencion { get; set; }
        [Computed] public int DuracionAtencion { get; set; }
        [Computed] public int ProfesionalesActivos { get; set; }
        [Computed] public int ProfesionalesInactivos { get; set; }
        [Computed] public int GruposActivos { get; set; }
        [Computed] public int GruposInactivos { get; set; }
        [Computed] public String TextoHorario { get; set; }
        [Computed] public String CodigoPrestacion { get; set; }
        [Computed] public String rutPaciente { get; set; }
        [Computed] public String codigoEspecialidad { get; set; }
        [Computed] public String CVP { get; set; }


        //Computed campos mensaje ofertas medicas en agendar
        [Computed] public string TitleSwal { get; set; }
        [Computed] public string MensajeRetorno { get; set; }
        [Computed] public string ButtonType { get; set; }
        [Computed] public string MensajeDisclaimer { get; set; }
        [Computed] public string TipoMensaje { get; set; }
        [Computed] public bool SwalVisible { get; set; }
        [Computed] public string TextMail { get; set; }

    }

    public class VwHorasMedicosBloquesHoras
    {
        public int IdBloqueHora { get; set; }
        public TimeSpan? HoraDesde { get; set; }
        public TimeSpan? HoraHasta { get; set; }
        public int? IdAtencion { get; set; }
        public int? IdPaciente { get; set; }
        public string NombrePaciente { get; set; }
        public string EstadoAtencion { get; set; }
        public string HoraDesdeText { get; set; }
        public string HoraHastaText { get; set; }
        public bool NSP { get; set; }
        public bool NspPaciente { get; set; }
        public int IdMedico { get; set; }
        public bool AtencionDirecta { get; set; }
        public DateTime? Fecha { get; set; }
        public string IdSesionPlataformaExterna { get; set; }
    }

    public class VwHorasMedicosBloquesHorasAtencion
    {
        public int IdBloqueHora { get; set; }
        public TimeSpan? HoraDesde { get; set; }
        public TimeSpan? HoraHasta { get; set; }
        public int? IdAtencion { get; set; }
        public int? IdPaciente { get; set; }
        public string NombrePaciente { get; set; }
        public string EstadoAtencion { get; set; }
        public string HoraDesdeText { get; set; }
        public string HoraHastaText { get; set; }
        public bool NSP { get; set; }
        public bool NspPaciente { get; set; }
        public int IdMedico { get; set; }
        public bool AtencionDirecta { get; set; }
        public DateTime? Fecha { get; set; }
        public bool Peritaje { get; set; }
        public string JsonProfesionalesAsociados { get; set; }
    }
}
