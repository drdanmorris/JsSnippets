using PulseCommon.Tests.UnitTests.New.Helpers.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PulseCommon.Tests.UnitTests.New.Helpers.FileComparer
{
    public class CursorFileComparer
    {

        public static FileComparison Compare(string fileA, string fileB, string filenameA = "FileA", string filenameB = "FileB")
        {
            var indexA = FileIndex.Create(fileA, filenameA);
            var indexB = FileIndex.Create(fileB, filenameB);
            return indexA.CompareWith(indexB);
        }

    }
}
