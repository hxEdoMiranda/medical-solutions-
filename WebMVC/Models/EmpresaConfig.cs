using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class EmpresaConfig
    {
        public int IdEmpresa { get; set; }
        public int IdCliente { get; set; }
        public bool IsEmpresa { get; set; }
        public string ActionUrl { get; set; }   
        public string Convenio { get; set; }
        public List<EmpresaConfig> empresa { get; set; }
        public string ImgSuscripcion { get; set; }
        public string TextoSuscripcion { get; set; }
        public string SubTextoSuscripcion { get; set; }
        public bool VisibleSuscripcion { get; set; }
        public string ImgOndemand { get; set; }
        public string TextoOndemand { get; set; }
        public string SubTextoOndemand { get; set; }
        public bool VisibleOndemand { get; set; }
        public string ImgVet { get; set; }
        public string TextoVet { get; set; }
        public string SubTextoVet { get; set; }
        public bool VisibleVet { get; set; }
        public string LogoEmpresa { get; set; }
        public string ImgAsistenciaSalud { get; set; }
        public string TextoAsistenciaSalud { get; set; }
        public bool VisibleAsistenciaSalud { get; set; }
        public string ImgPortalFarmacias { get; set; }
        public string TextoPortalFarmacias { get; set; }
        public bool VisiblePortalFarmacias { get; set; }
        public string ImgExamenesDomicilio { get; set; }
        public string TextoExamenesDomicilio { get; set; }
        public bool VisibleExamenesDomicilio { get; set; }
        public string ImgOrientacionEnfermeria { get; set; }
        public string TextoOrientacionEnfermeria { get; set; }
        public bool VisibleOrientacionEnfermeria { get; set; }
        public string ImgPremiosBeneficios { get; set; }
        public string TextoPremiosBeneficios { get; set; }
        public bool VisiblePremiosBeneficios { get; set; }
        public string ImgUsuario { get; set; }
        public string NombreUsuario { get; set; }
        public string LogoEmpresaHome { get; set; }
        public bool VisibleBanners { get; set; }
        public bool RedirectHome { get; set; }
        public string ImgAtencionmg { get; set; }
        public string TextoAtencionmg { get; set; }
        public string SubTextoAtencionmg { get; set; }
        public bool VisibleAtencionmg { get; set; }
        //Nuevo Boton AtencionPrecencial
        public string ImgAtencionPresencial { get; set; }
        public string TextoAtencionPresencial { get; set; }
        public string SubTextoAtencionPresencial { get; set; }
        public bool VisibleAtencionPresencial { get; set; }
        //======== AtencionPresencial ======================
        public string ImgAtencionPed { get; set; }
        public string TextoAtencionPed { get; set; }
        public string SubTextoAtencionPed { get; set; }
        public bool VisibleAtencionPed { get; set; }

        //Boton biblioteca 
        public string ImgBiblioteca { get; set; }
        public string TextoBiblioteca { get; set; }
        public bool VisibleBiblioteca { get; set; }
        public bool VisibleNotice { get; set; }

        //Boton Tratame
        public string ImgTratame { get; set; }
        public string TextoTratame { get; set; }
        public string SubTextoTratame { get; set; }
        public bool VisibleTratame { get; set; }

        //Campo Vida Camara Individual
        public int EmpresaMaestra { get; set; } //  Id, para mostrar las empresas a las cual se deben cambiar
         //Anura
        public bool VisibleAnura { get; set; } 

        public bool UrlPropia { get; set; }
        public string UrlPrincipal { get; set; }

        //ESPECIALIDADES BUSQUEDA INDIVIDUAL

        //NUTRICION
        public string ImgNutricion { get; set; }
        public string TextoNutricion { get; set; }
        public string SubTextoNutricion { get; set; }
        public bool VisibleNutricion { get; set; }
        public string AccionNutricion { get; set; }

        //PSICOLOGIA
        public string ImgPsicologia { get; set; }
        public string TextoPsicologia { get; set; }
        public string SubTextoPsicologia { get; set; }
        public bool VisiblePsicologia { get; set; }
        public string AccionPsicologia{ get; set; }

        //VETERINARIA
        public string ImgVeterinaria { get; set; }
        public string TextoVeterinaria { get; set; }
        public string SubTextoVeterinaria { get; set; }
        public bool VisibleVeterinaria { get; set; }
        public string AccionVeterinaria { get; set; }

        //KINESIOLOGIA
        public string ImgKinesiologia { get; set; }
        public string TextoKinesiologia { get; set; }
        public string SubTextoKinesiologia { get; set; }
        public bool VisibleKinesiologia { get; set; }
        public string AccionKinesiologia { get; set; }

        //PEDIATRIA
        public string ImgPediatria { get; set; }
        public string TextoPediatria { get; set; }
        public string SubTextoPediatria { get; set; }
        public bool VisiblePediatria { get; set; }
        public string AccionPediatria { get; set; }

        //SEGURO SEKURE

        public string ImgSeguros { get; set; }
        public string TextoSeguros { get; set; }
        public string SubTextoSeguros { get; set; }
        public bool VisibleSeguros { get; set; }

        //MOMENTO WOW
        public bool MomentoWow { get; set; }
        
        public string ImgNom035 { get; set; }
        public string TextoNom035 { get; set; }
        public string SubTextoNom035 { get; set; }
        public bool VisibleNom035 { get; set; }

        //PACIENTE CRONICO
        public string ImgPacienteCronico { get; set; }
        public string TextoPacienteCronico { get; set; }
        public string SubTextoPacienteCronico { get; set; }
        public bool VisiblePacienteCronico { get; set; }
        public string AccionPacienteCronico { get; set; }

        //CLINICA SUEÑO
        public string ImgClinicaSueno { get; set; }
        public string TextoClinicaSueno { get; set; }
        public string SubTextoClinicaSueno { get; set; }
        public bool VisibleClinicaSueno { get; set; }
        public string AccionClinicaSueno { get; set; }

        // Oncologia
        public string ImgOncologia { get; set; }
        public string TextoOncologia { get; set; }
        public string SubTextoOncologia { get; set; }
        public bool VisibleOncologia { get; set; }
        public string AccionOncologia { get; set; }

        //Contactos de emergencia
        public string ImgContactoEmergencia{ get; set; }
        public string TextoContactoEmergencia { get; set; }
        public string SubTextoContactoEmergencia { get; set; }
        public bool VisibleContactoEmergencia { get; set; }
        public string AccionContactoEmergencia { get; set; }

        //CONCIERGE
        public bool ChatGpt { get; set; }
        [Computed] public bool PreHome { get; set; }
        [Computed] public bool Redirecciona { get; set; }
        [Computed] public bool Existe { get; set; }

        public string CodTelefono { get; set; }

        //Test Ocupacional
        public string ImgTestOcupacional { get; set; }
        public string TextoTestOcupacional { get; set; }
        public string SubTextoTestOcupacional { get; set; }
        public bool VisibleTestOcupacional { get; set; }
        public string AccionTestOcupacional { get; set; }

        //RECETA ELECTRONICA
        public string ImgRecetaElectronica{ get; set; }
        public string TextoRecetaElectronica { get; set; }
        public string SubTextoRecetaElectronica { get; set; }
        public bool VisibleRecetaElectronica { get; set; }
        public string AccionRecetaElectronica { get; set; }
        //SmartCheck
        public string ImgSmartCheck { get; set; }
        public string TextoSmartCheck { get; set; }
        public string SubTextoSmartCheck { get; set; }
        public bool VisibleSmartCheck { get; set; }
        public string AccionSmartCheck { get; set; }

        //Directorio Veterinario
        public string ImgDirectorioVet { get; set; }
        public string TextoDirectorioVet { get; set; }
        public string SubTextoDirectorioVet { get; set; }
        public bool VisibleDirectorioVet { get; set; }
        public string AccionDirectorioVet { get; set; }

        //Peluqueria Veterinaria
        public string ImgPeluqueriaVet { get; set; }
        public string TextoPeluqueriaVet { get; set; }
        public string SubTextoPeluqueriaVet { get; set; }
        public bool VisiblePeluqueriaVet { get; set; }
        public string AccionPeluqueriaVet { get; set; }

        //Guarderia Veterinaria
        public string ImgGuarderiaVet { get; set; }
        public string TextoGuarderiaVet { get; set; }
        public string SubTextoGuarderiaVet { get; set; }
        public bool VisibleGuarderiaVet { get; set; }
        public string AccionGuarderiaVet { get; set; }

        //MuevetePositiva
        public string ImgMuevetePositiva { get; set; }
        public string TextoMuevetePositiva { get; set; }
        public string SubTextoMuevetePositiva { get; set; }
        public bool VisibleMuevetePositiva { get; set; }
        public string AccionMuevetePositiva { get; set; }

        //CoachingFinanciero
        public string ImgCoachingFinanciero { get; set; }
        public string TextoCoachingFinanciero { get; set; }
        public string SubTextoCoachingFinanciero { get; set; }
        public bool VisibleCoachingFinanciero { get; set; }
        public string AccionCoachingFinanciero { get; set; }
        //SegMedMXAmbulancia
        public string ImgSegMedMXAmbulancia { get; set; }
        public string TextoSegMedMXAmbulancia { get; set; }
        public string SubTextoSegMedMXAmbulancia { get; set; }
        public bool VisibleSegMedMXAmbulancia { get; set; }
        public string AccionSegMedMXAmbulancia { get; set; }

        //SegMedMXSeguros
        public string ImgSegMedMXSeguros { get; set; }
        public string TextoSegMedMXSeguros { get; set; }
        public string SubTextoSegMedMXSeguros { get; set; }
        public bool VisibleSegMedMXSeguros { get; set; }
        public string AccionSegMedMXSeguros { get; set; }

        //SegMedMXLaboratorios
        public string ImgSegMedMXLaboratorios { get; set; }
        public string TextoSegMedMXLaboratorios { get; set; }
        public string SubTextoSegMedMXLaboratorios { get; set; }
        public bool VisibleSegMedMXLaboratorios { get; set; }
        public string AccionSegMedMXLaboratorios { get; set; }


        //SegMedMXFarmacias
        public string ImgSegMedMXFarmacias { get; set; }
        public string TextoSegMedMXFarmacias { get; set; }
        public string SubTextoSegMedMXFarmacias { get; set; }
        public bool VisibleSegMedMXFarmacias { get; set; }
        public string AccionSegMedMXFarmacias { get; set; }

        //HanuVidaSana
        public string ImgHanuVidaSana { get; set; }
        public string TextoHanuVidaSana { get; set; }
        public string SubTextoHanuVidaSana { get; set; }
        public bool VisibleHanuVidaSana { get; set; }
        public string AccionHanuVidaSana { get; set; }

        //Plan
        public string Imgplan { get; set; }
        public string Textplan { get; set; }

    }
 
}
