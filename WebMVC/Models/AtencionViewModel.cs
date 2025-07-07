using System;
using System.Collections.Generic;
using System.Linq;

namespace WebMVC.Models
{
    public class AtencionViewModel
    {
        public Atenciones Atencion { get; set; }
        public List<Examenes> Examenes { get; set; }
        public List<Atenciones> HistorialAtenciones { get; set; }
        public PersonasViewModel fichaPaciente { get; set; }
        public List<VwHorasMedicos> TimelineData { get; set; }
        public List<VwHorasMedicos> HorasInterconsultasEspecialidades { get; set; }
        public List<VwHorasMedicos> ProximasHorasPaciente { get; internal set; }
        public List<Archivo> Archivo { get; internal set; }
        public List<Archivo> TestOcupacionalResult { get; internal set; }
        public List<ReporteEnfermeria> reporteEnfermeriaList { get; set; }
        public List<Medicamentos> medicamentosAtencion { get; set; }
        public List<Especialidades> especialidades { get; set; }
        public List<VwHorasMedicos> HorasDerivacion { get; set; }
        public VwHorasMedicos HoraDerivacion { get; set; }

        public List<AtencionMedicamentos> AtencionMedicamentos { get; set; }
        public AtencionesAsistencias atencionesAsistencias { get; set; }
        public List<Pharmacy> Farmacias { get; set; }

        public DatosCardMercadopPago DatosTarjetasMercadoPago { get; set; }
        public List<Especialidades> Especialidad { get; set; }

        public List<HistorialExamenesPreventivos> ArchivoExamenPreventivo { get; internal set; }
        public List<HistorialExamenesPreventivos> ExamenesPreventivos { get; internal set; }
        public List<ExamenesAsistencia> ExamenesAsistencias { get; internal set; }

        public OrderHeader OrderAttention { get; set; }

        public List<Atenciones> AtencionWow { get; set; }
        public AtencionesInterconsultas atencionesInterconsultas { get; set; }
        public List<Atenciones> interconsultas { get; set; }
        public List<Atenciones> HistorialAtencionesFarmacia { get; set; }
        public List<ProgramaSaludAtencionesEspecialidad> programaSaludAtencionesEspecialidad  { get; set; }
        public List<String> EspecialidadesDerivacionPrograma { get; set; }
        public List<PersonasViewModel> encargados { get; set; }
        public List<String> EspecialidadesDerivacionProgramaName { get; set; }
        public ProgramaSalud programaSalud { get; set; }
        public ProgramaSaludPaciente programaSaludPaciente { get; set; }

        public CuestionarioSueno cuestionarioSueno { get; set; }
        public ProgramaSaludCuestionario programaSaludCuestionario { get; set; }
        public dynamic saludDocumentos { get; set; }
        public string urlVideoCall { get; set; }
        public string idRegistroHisExterno { get; set; }
        public bool HistExterno { get; set; }
        public decimal Porcentaje
        {
            get
            {
                if (programaSaludAtencionesEspecialidad != null && programaSaludAtencionesEspecialidad.Count>0)
                {
                    decimal sumTopes = 0;
                    decimal sumNumAtenciones = 0;
                    sumTopes = programaSaludAtencionesEspecialidad.Sum(p => p.Topes);
                    sumNumAtenciones = programaSaludAtencionesEspecialidad.Sum(p => p.NumAtenciones);

                    if (sumTopes > 0)
                    {
                        decimal porcentajeTotal = sumNumAtenciones / sumTopes * 100;
                        return porcentajeTotal;
                    }
                }
                
                return 0;
            }
        }
        public AtencionesTeledocViewModel atencionesTeledocViewModels { get; set; }
    }
}