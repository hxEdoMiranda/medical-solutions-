using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class VwHorasMedicosCentroClinico
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
    }

    public class VwHorasMedicosBloquesHorasCentroClinico
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


    }
}
