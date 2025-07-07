using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebMVC.Models
{
    public class Archivo
    {
        public int Id { get; set; }
        public int IdEntidadAsociada { get; set; }
        public string CodEntidadAsociada { get; set; }
        public string Nombre { get; set; }
        public string Ruta { get; set; }
        public string RutaVirtual { get; set; }
        public DateTime Fecha { get; set; }
        public long? Size { get; set; }
        public int? Orden { get; set; }
        public int IdUsuario { get; set; }
        public string Estado { get; set; }
        public DateTime FechaPaciente { get; set; }
        public DateTime FechaMedico { get; set; }
        public PersonasViewModel Persona { get; set; }
        public string NombreCompleto { get; set; }


        //PROPIEDADES DEL ARCHIVO DE TELEDOC
        public string IdConsultaTeledoc { get; set; }
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
        public string diagnostico { get; set; }

        //PROPIEDADES DEL ARCHIVO DE MEDIKIT
        public string statusMedikit {  get; set; }


        public string idenc
        {
            get
            {
                return Encriptar(Id.ToString());

            }

        }
        public String Encriptar(string cadena)
        {
            byte[] keyArray;

            MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
            keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("88dkE#$Rfg32eNN?l7"));

            hashmd5.Clear();
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;
            ICryptoTransform cEncriptor = tdes.CreateEncryptor();

            byte[] inBlock = Encoding.UTF8.GetBytes(cadena);
            byte[] cadenaEcnriptada = cEncriptor.TransformFinalBlock(inBlock, 0, inBlock.Length);
            string base64String = Convert.ToBase64String(cadenaEcnriptada, 0, cadenaEcnriptada.Length);

            return HttpUtility.UrlEncode(base64String);
        }


    }
}
