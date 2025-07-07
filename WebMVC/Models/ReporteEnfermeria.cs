using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class ReporteEnfermeria
    {
        public int Id { get; set; }
        public int IdPaciente { get; set; }
        public int MotivoConsulta { get; set; }
        public string AntecedentesPsicosociales { get; set; }
        public string AntecedentesLaborales { get; set; }
        public string AntecedentesAcademicos { get; set; }
        public string RedApoyo { get; set; }
        public string Observacion { get; set; }
        public string IndicacionEnfermeria { get; set; }
        public int Control { get; set; }
        public string Alergias { get; set; }
        public string Medicamentos { get; set; }
        public string AntecedentesQuirurgicos { get; set; }
        public string ObsAlcohol { get; set; }
        public string ObsTabaco { get; set; }
        public string ObsActividadFisica { get; set; }
        public string ObsOtrasDrogas { get; set; }
        public int IdUsuarioCreacion { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public int IdUsuarioModifica { get; set; }
        public DateTime? FechaModifica { get; set; }
        public string Estado { get; set; }
        public string DerivacionProfesional { get; set; }
        public bool Hta { get; set; }
        public bool Dm { get; set; }
        public bool Asma { get; set; }
        public bool Epoc { get; set; }
        public bool Dislipidemia { get; set; }
        public bool Depresion { get; set; }
        public bool TrastornoSueno { get; set; }
        public string OtrosAntecedentesMorbidos { get; set; }
        public bool Alcohol { get; set; }
        public bool Tabaco { get; set; }
        public bool ActividadFisica { get; set; }
        public bool OtrasDrogas { get; set; }
        public string NombrePaciente { get; set; }
        public string NombreProfesional { get; set; }
        public string MotivoConsultaString { get; set; }
        public string ControlString { get; set; }
        public int Edad { get; set; }
        public string HtaString { get; set; }
        public string DmString { get; set; }
        public string AsmaString { get; set; }
        public string EpocString { get; set; }
        public string DislipidemiaString { get; set; }
        public string DepresionString { get; set; }
        public string TrastornoSuenoString { get; set; }
        public string AlcoholString { get; set; }
        public string TabacoString { get; set; }
        public string ActividadFisicaString { get; set; }
        public string OtrasDrogasString { get; set; }
    }

    public class ReportePaciente
    {
        public PersonasViewModel persona { get; set; }
        public ReporteEnfermeria reporteEnfermeria { get; set; }
        public List<Parametros> motivoConsulta{ get; set; }
        public List<Parametros> control { get; set; }
    }
}
