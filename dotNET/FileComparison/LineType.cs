using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PulseCommon.Tests.UnitTests.New.Helpers.FileComparer
{
    public enum LineType
    {
        None,
        Field,
        Object,
        Array,
        ArrayObject,
        ObjectEnd,
        ArrayEnd,
        String
    }
}
