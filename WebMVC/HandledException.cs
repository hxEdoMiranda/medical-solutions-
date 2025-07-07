using System;

namespace WebMVC
{
    public class HandledException : Exception
    {
        public HandledException(string message, params object[] args) : base($"HandledException: {message}")
        {
            // Add parameters to dictionary of the exception
            if (args.Length > 0 && args.Length % 2 == 0)
            {
                for (int i = 0; i < args.Length; i += 2)
                {
                    Data.Add(args[i].ToString(), args[i + 1]);
                }
            }
        }
    }
}
