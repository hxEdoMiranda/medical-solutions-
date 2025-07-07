using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace WebMVC.Models
{
    public class Atenciones
    {
        public int Id { get; set; }
        public int IdBloqueHora { get; set; }
        public int IdPaciente { get; set; }
        public VwHorasMedicos HoraMedico { get; set; }
        public int IdTriageMolestia { get; set; }
        public Parametros TriageMolestia { get; set; }
        public int IdTriageNivel { get; set; }
        public Parametros TriageNivel { get; set; }
        public int IdTriageTiempo { get; set; }
        public Parametros TriageTiempo { get; set; }
        public string TriageObservacion { get; set; }
        public string DiagnosticoMedico { get; set; }
        public string ExamenMedico { get; set; }
        public string CertificadoMedico { get; set; }
        public string TratamientoMedico { get; set; }
        public string MedicamentosMedico { get; set; }
        public string ControlMedico { get; set; }
        public string Observaciones { get; set; }
        public int? IdMedicoHora { get; set; }
        public DateTime? InicioAtencion { get; set; }
        public DateTime? TerminoAtencion { get; set; }
        public string IdVideoCall { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public int? IdUsuarioCreacion { get; set; }
        public DateTime? FechaModifica { get; set; }
        public int? IdUsuarioModifica { get; set; }
        public List<Examenes> Examenes { get; set; }
        public List<Patologias> Patologias { get; set; }
        public List<Archivo> Archivos { get; set; }
        public List<Medicamentos> Medicamentos { get; set; }
        public List<AtencionesTeledocViewModel> atencionesTeledocViewModels { get; set; }
        public string NombreMedico { get; set; }
        public string HoraDesdeText { get; set; }
        public string HoraDesdeTextPaciente { get; set; }
        public string HoraDesdeTextMedico { get; set; }
        public string FechaText { get; set; }
        public string NombrePaciente { get; set; }
        public string TelefonoPaciente { get; set; }
        public string CorreoPaciente { get; set; }
        public string CorreoMedico { get; set; }
        public string Especialidad { get; set; }
        public DateTime? Fecha { get; set; }
        public bool NSP { get; set; }
        public string DescripcionNSP { get; set; }
        public bool SospechaCovid19 { get; set; }
        public string PatologiasString { get; set; }
        public int IdMedicoAsociado { get; set; }
        public bool AtencionDirecta { get; set; }
        public PersonasViewModel datosMedico { get; set; }
        public PersonasViewModel FichaPaciente { get; set; }
        public PersonasDatos infoMedico { get; set; }
        public int IdMedico { get; set; }
        public string UrlConvenio { get; set; }
        public string TextoMarca { get; set; }
        public string RutaVirtual { get; set; }
        public string AntecedentesMedicos { get; set; }
        public string Antecedentes_Patologicos { get; set; }
        public string Antecedentes_Quirurgicos { get; set; }
        public string Antecedentes_GinecoObstetricos { get; set; }
        public string Antecedentes_ToxicosAlergicos { get; set; }
        public string Antecedentes_Farmacologicos { get; set; }
        public string Antecedentes_Familiares { get; set; }
        public bool PagoAprobado { get; set; }
        public DateTime? InicioAtencionPacienteInforme { get; set; }
        public DateTime? TerminoAtencionPaciente { get; set; }
        public DateTime? InicioAtencionMedicoInforme { get; set; }
        public DateTime? IngresoAtencionPaciente { get; set; }
        public string IdSesionPlataformaExterna { get; set; }
        public int? valorAtencion { get; set; }
        public int? valorConvenio { get; set; }
        public int? aporteCaff { get; set; }
        public int? aporteFinanciador { get; set; }
        public int? aporteSeguro { get; set; }
        public int? copago { get; set; }
        public bool NspPaciente { get; set; }
        public int? IdMedicoFirmante { get; set; }
        public bool SolicitaFirma { get; set; }
        public DateTime? InicioAtencionPacienteCall { get; set; }
        public DateTime? ConfirmaPaciente { get; set; }
        public int? IdCliente { get; set; }
        public bool Particular { get; set; }
        public string FotoPerfil { get; set; }
        public bool AceptaProfesionalInvitado { get; set; }
        public string PatologiaTextoAbierto { get; set; }
        public string NumeroRegistro { get; set; }
        public bool ConsentimientoInformado { get; set; }
        public int? IdEspecialidadFilaUnica { get; set; }
        public int IdEspecialidadDestino { get; set; }
        public bool MostrarDerivacion { get; set; }
        public string InfoPaciente { get; set; }
        public DateTime? FNacimiento { get; set; }
        public int ConvenioEmpresa { get; set; }
        public string InfoDerivacion { get; set; }
        public bool Peritaje { get; set; }
        public string? LinkYapp { get; set; }
        public string LinkPharol { get; set; }
        public string LinkFarmalisto { get; set; }
        public string LinkVitau { get; set; }
        public string PrefijoProfesional { get; set; }
        public string CodigoPais { get; set; }
        public string CodigoTelefono { get; set; }
        public int IdEspecialidadDerivacion { get; set; }
        public string MotivoConsultaMedico { get; set; }
        public DateTime? FechaInicioCertificado { get; set; }
        public DateTime? FechaTerminaCertificado { get; set; }
        public string IncapacidadMedica { get; set; }
        public Especialidades EspecialidadDerivacion { get; set; }
        public List<Especialidades> EspecialidadesDerivacion { get; set; }
        public string CodeMedipass { get; set; }
        public bool IsFonasa { get; set; }
        public string Ocupacion { get; set; }
        public string GlosaEspecialidadDerivacion { get; set; }
        public List<FarmaciaExterna> FarmaciasExternas { get; set; }
        public int IdEspecialidad { get; set; }
        public int IdConvenio { get; set; }
        public object Token { get; internal set; }
        public string DiagnosticoPsicopedagogico { get; set; }
        public string ObjetivosDeLaSesion { get; set; }

        public string IdentificadorEmpresa { get; set; }
        public AtencionDatosAdicionales AtencionDatosAdicionales { get; set; }
        public int IdProgramaSalud { get; set; }
        public bool? IsProgramaSalud { get; set; }

        public string? EmpresaPsico { get; set; }
        public string username { get; set; }
        public string IdConsultaTeledoc { get; set; }
        public string diagnostico { get; set; }

        public string IdRegistro {  get; set; }

        [Computed] public string statusMedikit { get; set; }
        [Computed] public string urlMedikit { get; set; }
        [Computed] public string nombreMedikit { get; set; }
        [Computed] public int IdPais { get; set; }

    }

}
