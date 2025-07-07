using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebMVC
{
    public class Extension
    {

        public static String Encriptar(string json)
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

            byte[] inBlock = Encoding.UTF8.GetBytes(json);
            byte[] cadenaEcnriptada = cEncriptor.TransformFinalBlock(inBlock, 0, inBlock.Length);
            string base64String = Convert.ToBase64String(cadenaEcnriptada, 0, cadenaEcnriptada.Length);

            return HttpUtility.UrlEncode(base64String);
        }
    }
}
