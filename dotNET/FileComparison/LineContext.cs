using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PulseCommon.Tests.UnitTests.New.Helpers.FileComparer
{
    public class LineContext
    {
        public string Line { get; private set; }
        public LineType LineType { get; private set; }
        public string Name { get; private set; }
        public string Value { get; private set; }

        private string __path = string.Empty;
        public string Path
        {
            get
            {
                if (string.IsNullOrWhiteSpace(__path))
                {
                    return "__";
                }
                else
                {
                    return __path;
                }
            }
            set { __path = value; }
        }

        public string DigestKey
        {
            get
            {
                return CreateDigestKeyFor(FullName);
            }
        }

        public static string CreateDigestKeyFor(string path)
        {
            return Regex.Replace(path, "\\[\\d+\\]", "");
        }

        public string FullName
        {
            get
            {
                if(Path.EndsWith(Name))
                {
                    return Path;
                }
                return $"{Path}.{Name}";
            }
        }

        public LineContext(string line)
        {
            Line = line;
            LineType = GetLineTypeFor(line);
            SetNameAndValueFrom(line);
        }

        private void SetNameAndValueFrom(string line)
        {
            var parts = line.Split(":".ToCharArray());
            if (parts.Length >= 2)
            {
                Name = parts[0];
                Value = string.Join(":", parts.Skip(1));  // special case, date values will have internal colons.
            }
            else
            {
                if(LineType == LineType.String)
                {
                    Name = Value = line;  // special case, line is a string value in an array
                }
            }
        }

        private static LineType GetLineTypeFor(string line)
        {
            var type = LineType.None;

            if (IsObjectField(line))
            {
                type = LineType.Object;
            }
            else if (IsArrayField(line))
            {
                type = LineType.Array;
            }
            else if (IsArrayObjectField(line))
            {
                type = LineType.ArrayObject;
            }
            else if (IsObjectEnd(line))
            {
                type = LineType.ObjectEnd;
            }
            else if (IsArrayEnd(line))
            {
                type = LineType.ArrayEnd;
            }
            else if (IsField(line))
            {
                type = LineType.Field;
            }
            else if (IsString(line))
            {
                type = LineType.String;  // a string item of an array
            }

            return type;
        }

        public static LineContext CreateFrom(string line)
        {
            var ctx = new LineContext(line);
            return ctx;
        }

        private static bool IsObjectField(string s)
        {
            return s.EndsWith(":{");
        }

        private static bool IsArrayField(string s)
        {
            return s.EndsWith(":[");
        }

        private static bool IsArrayObjectField(string s)
        {
            return s.StartsWith("{");
        }

        private static bool IsObjectEnd(string s)
        {
            return s.StartsWith("}");
        }

        private static bool IsArrayEnd(string s)
        {
            return s.StartsWith("]");
        }

        private static bool IsField(string s)
        {
            return s.Contains(":");
        }

        private static bool IsString(string s)
        {
            return Regex.IsMatch(s, "^\"\\w+\"$");
        }

    }


}
