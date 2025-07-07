using System.Text;

namespace WebMVC
{
    public static class Util
    {
        public static string RemoveAccent(string txt)
        {
            byte[] bytes = Encoding.GetEncoding("Cyrillic").GetBytes(txt); //Tailspin uses Cyrillic (ISO-8859-5); others use Hebraw (ISO-8859-8)
            return Encoding.ASCII.GetString(bytes);
        }
    }
}
