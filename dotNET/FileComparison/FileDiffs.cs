using System.Collections.Generic;

namespace FileComparer
{
    public class FileDiffs
    {
        public List<string> FileA { get; private set; }
        public List<string> FileB { get; private set; }

        public FileDiffs()
        {
            FileA = new List<string>();
            FileB = new List<string>();
        }
    }
}
