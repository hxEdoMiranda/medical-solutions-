using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebMVC.Models
{
    public class AtencionMedicamentos
    {
        public int Id { get; set; }
        public int IdAtencion { get; set; }
        public int IdMedicamento { get; set; }
        public string Posologia { get; set; }
        public int IdusUarioCreacion { get; set; }
        public int idUsuarioModifica { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public string Estado { get; set; }
        public string Glosa { get; set; }
        public string GlosaCom { get; set; }
        public int IsComercial { get; set; }
        public string? archivoId { get; set; }
        public int? EstadoCarrito { get; set; }
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
                    return null;
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
