using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebMVC.Models
{
    public class Examenes
    {
        public int IdAtencion { get; set; }
        public int Id { get; set; }
        public int IdExamen { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string Estado { get; set; }
        public decimal TarifaMedismart { get; set; }
        public decimal TarifaOfertaMedismart { get; set; }
        public int CodigoLME { get; set; }
        public string SeleccionPago { get; set; }
        public int? CiudadPago { get; set; }
        public string CiudadPagoNombre { get; set; }
        public string EstadoPago { get; set; }
        public int EnProcesoPagoPayzen { get; set; }
        public bool IsExamedi { get; set; }
        public int TarifaTomaExamedi { get; set; }

        public bool WowMx { get; set; }

        public string? archivoId { get; set; }
        public DateTime? Fecha { get; set; }
        public int? order_status_id { get; set; }

        public string idenc
        {
            get
            {
                if (archivoId != null)
                {
                    return Encriptar(archivoId.ToString());
                }
                else
                {
                    return Encriptar("");
                }
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
