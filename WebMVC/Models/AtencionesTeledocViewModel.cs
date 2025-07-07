using System;
using System.Collections.Generic;

namespace WebMVC.Models
{
    public class archivos
    {
        public int idArchivo { get; set; }
        public string nombreArchivo { get; set; }
        public string idPropietario { get; set; }
        public string idCreador { get; set; }
        public DateTime tsCreacion { get; set; }
        public string tipo { get; set; }
        public string idConsulta { get; set; }
        public string descripcion { get; set; }
        public object data { get; set; }
        public string url { get; set; }
    }

    public class FichaMedica
    {
        public object dolor { get; set; }
        public object origen_examen_fisico { get; set; }
        public object reposo { get; set; }
        public object dieta { get; set; }
        public object destino_egreso_tipo { get; set; }
        public object anamnesis_proxima { get; set; }
        public object dolor_donde { get; set; }
        public int dolor_nivel { get; set; }
        public object peso { get; set; }
        public object talla { get; set; }
        public object imc { get; set; }
        public object fc { get; set; }
        public object fr { get; set; }
        public object temp { get; set; }
        public object pa { get; set; }
        public object sat02 { get; set; }
        public object ex_fisico_otros { get; set; }
        public object piel_fanereos { get; set; }
        public object cabeza_cuello { get; set; }
        public object torax_abdomen { get; set; }
        public object musculo_esqueletico { get; set; }
        public object neurologico { get; set; }
        public string diagnostico { get; set; }
        public object diagnostico_observaciones { get; set; }
        public object indicaciones { get; set; }
        public object medicamentos { get; set; }
        public object examenes_complementarios { get; set; }
        public object educacion { get; set; }
    }

    public class AtencionesTeledocViewModel
    {
        public string idConsulta { get; set; }
        public object idConsultaExterna { get; set; }
        public string idPaciente { get; set; }
        public object idCarga { get; set; }
        public object idDoctor { get; set; }
        public string nombreDoctor { get; set; }
        public string idConsultorio { get; set; }
        public string tipoConsulta { get; set; }
        public string motivoConsulta { get; set; }
        public string estado { get; set; }
        public DateTime? tsCreacion { get; set; }
        public DateTime? tsModificacion { get; set; }
        public bool phoneClosed { get; set; }
        public object phoneDate { get; set; }
        public bool meetClosed { get; set; }
        public object meetDate { get; set; }
        public int planSpecialtyId { get; set; }
        public int specialtyId { get; set; }
        public int specialtyId_MS { get; set; }
        public int id_clienteMS { get; set; }
        public string pais { get; set; }
        public string gmt { get; set; }
        public string especialidad { get; set; }
        public string tieneFonasa { get; set; }
        public List<archivos> archivos { get; set; }
        public FichaMedica ficha_medica { get; set; }
    }

}