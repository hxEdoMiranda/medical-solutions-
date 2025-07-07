using Dapper.Contrib.Extensions;
using System;
namespace WebMVC.Models
{
    public class PersonasDatosViewModel    {
        public int Id { get; set; }
        public int IdPersona { get; set; }
        public int ValorAtencion { get; set; }
        public string InfoPersona1 { get; set; }
        public int IdUsuarioCreacion { get; set; }
        public int? IdUsuarioModifica { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModifica { get; set; }
        public string Estado { get; set; }
        public int NumeroRegistro { get; set; }
        public int IdTituloMedico { get; set; }
        public DateTime? FechaRegistroMedico { get; set; }
        public string AlmaMater { get; set; }
        public DateTime? FechaGraduacion { get; set; }
        public int IdDuracionAtencion { get; set; }
        public int PrefijoProf { get; set; }
        public string RedesSociales { get; set; }
        public Boolean HabilitarAtencion { get; set; }
        public string CVP { get; set; }
        public int IdSucursal { get; set; }
        public int IdLugarAtencion { get; set; }
        public int IdPrestador { get; set; }
        public int IdPuntoAtencion { get; set; }
        public int ValorConvenio { get; set; }
        public bool AtiendeHapp { get; set; }
        public bool RestriccionPacienteFila { get; set; }
        [Computed] public int IdEspecialidad { get; set; }
        [Computed] public string Especialidad { get; set; }
        [Computed] public string TituloMedicoDetalle { get; set; }
        //[Computed] public int IdEspecialidad { get; set; }
        [Computed] public string PrefijoDetalle { get; set; }
        [Computed] public string DuracionAtencionDetalle { get; set; }
        [Computed] public string FotoPerfil { get; set; }
        [Computed] public string CertificadoRegistroPDF { get; set; }
        [Computed] public string FirmaMedico { get; set; }
        [Computed] public string Nombre { get; set; }
        [Computed] public string ApellidoPaterno { get; set; }
        [Computed] public string ApellidoMaterno { get; set; }
        [Computed] public string Correo { get; set; }
        [Computed] public string Telefono { get; set; }
        [Computed] public string CodigoPrestacion { get; set; }
        [Computed] public string NombreCertificadoRegistro { get; set; }
        [Computed] public int IdCertificadoRegistro { get; set; }
        [Computed] public int IdDuracion { get; set; }
        [Computed] public int TempID { get; set; }
        [Computed] public DateTime? FechaCambioEstado { get; set; }
        [Computed] public int HorasConvenio { get; set; }
        [Computed] public int HorasConvenioConAgenda { get; set; }
        [Computed] public int HorasAgendaProfesional { get; set; }
    }
}
