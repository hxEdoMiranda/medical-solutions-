using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public static class Extensions 
    {
        public static string GetSpecificClaim(this System.Security.Claims.ClaimsIdentity claimsIdentity, string claimType)
        {
            var claim = claimsIdentity.Claims.FirstOrDefault(x => x.Type.Contains(claimType));

            return (claim != null) ? claim.Value : string.Empty;
        }

        public static string UpdateClaim(this System.Security.Claims.ClaimsIdentity claimsIdentity, string claimType, string value)
        {
            var claimExisting = claimsIdentity.Claims.FirstOrDefault(x => x.Type.Contains(claimType));
            claimsIdentity.RemoveClaim(claimExisting);

            claimsIdentity.AddClaim(new System.Security.Claims.Claim(claimType, value));

            return (claimExisting != null) ? claimExisting.Value : string.Empty;
        }
        public static string GetMd5Hash(this string input)
        {
            using MD5 md5Hash = MD5.Create();
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();

            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }

    }
}
