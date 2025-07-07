using System;
using System.ComponentModel.DataAnnotations;

namespace WebMVC.Models
{
    public class ProgramaSaludAtencionesEspecialidad
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int Topes { get; set; }
        public int Cantidad { get; set; }
        public int NumAtenciones { get; set; }
        public int IdCiclo { get; set; }
        public int IdMedico { get; set; }
        public int IdEspecialidad { get; set; }
        public string Periodicidad { get; set; }
        public string InitDate { get; set; }

    }

    public class ProgramaSalud
    { 
        public int Id { get; set; }
        public string Nombre { get; set;}
        public bool Estado { get;}
        public DateTime? FechaCreacion { get; set; }
    }

    public class ProgramaSaludPaciente
    {

        public int Id { get; set; }
        public int IdProgramaSalud { get; set; }
        public int IdCliente { get; set; }
        public int UserId { get; set; }
        public bool Estado { get; set; }
        public DateTime FechaRegistro { get; set; }

    }

    public class ProgramaSaludCuestionario
    {
        public int Id { get; set; }
        public int IdProgramaSaludPaciente { get; set; }
        public int IdUsuario { get; set; }
        public int Edad { get; set; }
        public string Sexo { get; set; }
        public int Peso { get; set; }
        public float Altura { get; set; }
        public bool Tabaco { get; set; }
        public bool Actividad { get; set; }
        public string Especificar { get; set; }
        public int IdCliente { get; set; }
        public DateTime FechaRegistro { get; set; }
    }

    public class ProgramaSaludCuestionarioPittsburg
    {
        public int ID { get; set; }
        public int Id_usuario { get; set; }
        public int Id_cliente { get; set; }
        public string Hora_Acostarse { get; set; }
        public string Tiempo_Dormirse { get; set; }
        public string Hora_Levantarse { get; set; }
        public int Horas_Dormidas { get; set; }
        public string Problemas_Dormir { get; set; }
        public string Calidad_Sueno { get; set; }
        public string Medicinas_Dormir { get; set; }
        public string Somnolencia_Actividades { get; set; }
        public string Animos_Realizar_Actividades { get; set; }
        public string Dormir_Acompanado { get; set; }
        public DateTime Fecha_registro { get; set; }
    }

    public class ProgramaSaludCiclo

    {
        public int Id { get; set; }
        public int IdProgramaSaludPaciente { get; set; }
        public int Estado { get; set; }
        public int NumeroCiclo { get; set; }
    }

    public class ProgramaSaludFormularioEnfermera
    {
        public int ID { get; set; }
        public int Id_usuario { get; set; }
        public int Id_cliente { get; set; }
        public string CuestionarioID { get; set; }
        public string SignosVitales { get; set; }
        public string PresionArterial { get; set; }
        public string Glicemia { get; set; }
        public string Diagnostico { get; set; }
        public DateTime? FechaDiagnostico { get; set; }
        public string AntecedentesFamiliares { get; set; }
        public DateTime? FechaUltimoControl { get; set; }
        public string Sintomas { get; set; }
        public string Medicamentos { get; set; }
        public string ExamenesIndicaciones { get; set; }
        public DateTime? FechaUltimosExamenes { get; set; }
        public bool ExamenesNormales { get; set; }
        public DateTime? Fecha_registro { get; set; }
        public string Id_atencion { get; set; }
        public string Observaciones { get; set; }
    }

}
