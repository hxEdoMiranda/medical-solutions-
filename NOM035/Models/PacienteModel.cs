using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Models
{
    public class PacienteRequestModel
    {
        public string master_key { get; set; }
        public int id_usuario { get; set; }
        public int id_empresa { get; set; }
        public int id_puesto { get; set; }
        public int id_area { get; set; }
        public int num_empleado { get; set; }
        public string nombre { get; set; }
        public string apellido_paterno { get; set; }
        public string apellido_materno { get; set; }
        public string genero { get; set; }
        public string fecha_nacimiento { get; set; }
        public string estado_civil { get; set; }
        public string tipo_contrato { get; set; }
        public string experiencia_laboral { get; set; }
        public string tiempo_en_empresa { get; set; }
        public string tiempo_en_puesto { get; set; }
        public string tipo_jornada { get; set; }
        public string rotacion_turno { get; set; }
        public string curp { get; set; }
        public string telefono { get; set; }
        public string correo_electronico { get; set; }
        public bool activa_cuestionario { get; set; }
        public int id_persona_bh { get; set; }
        public int id_persona { get; set; }
        public int id_personadatoslaboral { get; set; }
    }
    public class PacientesResponseModel : RespuestaModel
    {
        public List<PacienteDataModel> data { get; set; }
    }
    public class PacienteResponseModel : RespuestaModel
    {
        public PacienteDataModel data { get; set; }
    }
    public class PacienteDataModel
    {
        public int id { get; set; }
        public int id_empresa { get; set; }
        public int area { get; set; }
        public int puesto { get; set; }
        public string nombre { get; set; }
        public string apellido_paterno { get; set; }
        public string apellido_materno { get; set; }
        public string genero { get; set; }
        public string fecha_nacimiento { get; set; }
        public string estado_civil { get; set; }
        public string tipo_contrato { get; set; }
        public string experiencia_laboral { get; set; }
        public string tiempo_en_puesto { get; set; }
        public string tiempo_en_empresa { get; set; }
        public string tipo_jornada { get; set; }
        public string rotacion_turno { get; set; }
        public string curp { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
        public string status { get; set; }
        public string creation_date { get; set; }
    }

    public class PersonasDatosLaboralModel
    {
        public int Id_PersonadatosLaboral { get; set; }
        public int IdPersona { get; set; }
        public int IdPersona_Bh { get; set; }
        public int? Experiencia_Laboral { get; set; }
        public int Id_Area { get; set; }
        public int Id_Puesto { get; set; }
        public DateTime Fecha_Ingreso { get; set; }
        public DateTime Fecha_Ingreso_Puesto { get; set; }
        public string Rotacion_Turno { get; set; }
        public string Id_Tipo_Contrato { get; set; }
        public string Id_Tipo_Jornada { get; set; }
    }

    public class PersonasViewModel
    {
        public int Id { get; set; }
        public string Identificador { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public string TelefonoMovil { get; set; }
        public string Estado { get; set; }
        public string Genero { get; set; }
        public string EstadoCivil { get; set; }
        public DateTime FNacimiento { get; set; }
        public float? Altura { get; set; }
        public int? Peso { get; set; }
        public string Alergias { get; set; }
        public string Direccion { get; set; }
        public string Comuna { get; set; }
        public string Nacionalidad { get; set; }
        public string Prevision { get; set; }
        public string ZonaHoraria { get; set; }
        public string CodigoTelefono { get; set; }
        [Computed] public string Empresa { get; set; }
        [Computed] public string nombreCompleto { get; set; }
        [Computed] public string rutaAvatar { get; set; }
        public string Ciudad { get; set; }
        public int TempID { get; set; }
        public int duracionAtencionId { get; set; }
        public int duracionAtencionMin { get; set; }
        public int IdEmpresa { get; set; }
        public string CorreoPlataformaTercero { get; set; }
        public string TelefonoPlataformaTercero { get; set; }
        public string Enfermedades { get; set; }
        public string Medicamentos { get; set; }
        public string Cirugias { get; set; }
        public string Habitos { get; set; }
        public string IdAdmin { get; set; }

        public int idCentroClinico { get; set; }

        public int Edad { get; set; }

    }
}
