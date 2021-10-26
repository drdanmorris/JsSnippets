using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PulseCommon.Tests.UnitTests.New.Helpers.FileComparer
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
