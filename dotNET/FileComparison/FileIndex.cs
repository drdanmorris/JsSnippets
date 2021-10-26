using System;
using System.Collections.Generic;
using System.Linq;

namespace FileComparer
{
    public class FileIndex
    {

        public static FileIndex Create(string file, string name)
        {
            var idx = new FileIndex(file, name);
            idx.Process();
            return idx;
        }

        public FileComparison CompareWith(FileIndex other)
        {
            return new FileComparison(this, other);
        }

        public string FileText { get; private set; }
        public string Filename { get; private set; }

        CursorContext cursor = new CursorContext();

        public readonly List<FileIndexEntry> Entries = new List<FileIndexEntry>();
        

        public FileIndex(string file, string name)
        {
            FileText = file;
            Filename = name;
        }

        public FileIndexEntry GetMatchingEntryFor(FileIndexEntry query)
        {
            return Entries.Where(e => e.RelativePath == query.RelativePath && e.Signature.Equals(query.Signature, StringComparison.InvariantCultureIgnoreCase) && !e.Matched).FirstOrDefault();
        }

        public void SyncMatched()
        {
            Entries.ForEach(entry =>
            {
                if(entry.AllChildrenMatched)
                {
                    entry.Matched = true;
                }
            });
        }

        private void Process()
        {
            var lines = Split(FileText);
            foreach (var line in lines)
            {
                var lineContext = cursor.Append(line);

                switch (lineContext.LineType)
                {
                    case LineType.Field:
                    case LineType.Object:
                        Add(lineContext);
                        break;

                    case LineType.ObjectEnd:
                        FileIndexEntry.PopParent();
                        break;
                }
            }
        }



        private string[] Split(string file)
        {
            return file
                .Replace(" ", "")
                .Replace("\r", "")
                .Replace("},", "}")
                .Replace("],", "]")
                .Replace("\"", "")
                .Replace(",", "")
                .Split("\n".ToCharArray());
        }

        private void Add(LineContext lineContext)
        {
            Entries.Add(new FileIndexEntry(lineContext));
        }

       


    }
}
