namespace WebMVC
{
    public static class NumeroRandom
    {
        private const int version = 3;
        private const int subversion = 3;
        private const int revision = 17;

        public static int GetRandom()
        {
            return (version * 1000) + (subversion * 100) + revision;
        }
    }
}
