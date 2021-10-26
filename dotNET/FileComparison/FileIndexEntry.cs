using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace FileComparer
{
    [DebuggerDisplay("{DisplayPath} = {Value}")]
    public class FileIndexEntry
    {

        private static List<FileIndexEntry> Parents = new List<FileIndexEntry>();

        private static FileIndexEntry CurrentParent
        {
            get
            {
                if (Parents.Count > 0)
                {
                    return Parents.Last();
                }
                return null;
            }
        }

        public static void PopParent()
        {
            if(Parents.Count > 0)
            {
                Parents.Remove(Parents.Last());
            }
        }

        public string DisplayPath
        {
            get
            {
                if(RelativePath.Length > 80)
                {
                    return $"{RelativePath.Substring(0,40)}...{RelativePath.Substring(RelativePath.Length - 40)}";
                }
                return RelativePath;
            }
        }

        public bool Matched { get; set; }
        public string RelativePath { get; set; }
        public string AbsolutePath { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public FileIndexEntry Parent { get; set; }
        public List<FileIndexEntry> Children { get; private set; }

        public void SetMatched()
        {
            Matched = true;
            Children.ForEach(child => child.SetMatched());
        }

        public static readonly List<FileIndexEntry> EmptyFileIndexEntryList = new List<FileIndexEntry>();

        public FileIndexEntry(LineContext lineContext)
        {
            Children = new List<FileIndexEntry>();
            AbsolutePath = lineContext.FullName;
            RelativePath = lineContext.DigestKey;
            Parent = CurrentParent;
            Name = lineContext.Name;

            if (lineContext.LineType == LineType.Field)
            {
                Value = lineContext.Value;
            }
            else if(lineContext.LineType == LineType.Object)
            {
                Parents.Add(this);
            }

            Parent?.Children.Add(this);
        }

        public bool HasSiblings
        {
            get
            {
                return Siblings.Count() > 0;
            }
        }

        public bool HasChildren
        {
            get
            {
                return Children?.Count > 0;
            }
        }

        public string Signature
        {
            get
            {
                if(HasChildren)
                {
                    var sig = string.Empty;
                    Children.ForEach(child =>
                    {
                        sig += child.Signature;
                    });
                    return sig;
                }
                return Value;
            }
        }

        public List<FileIndexEntry> Siblings
        {
            get
            {
                if(Parent != null)
                {
                    var children = Parent.Children;
                    children.Remove(this);
                    return children;
                }
                return EmptyFileIndexEntryList;
            }
        }

        public bool AllChildrenMatched
        {
            get
            {
                if(HasChildren)
                {
                    return Children.Where(c => c.Matched).Count() == Children.Count;
                }
                return false;
            }
        }

    }
}
