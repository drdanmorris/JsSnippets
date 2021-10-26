using System.Diagnostics;

namespace FileComparer
{
    [DebuggerDisplay("{Name}")]
    public class FieldContext
    {
        public string Name { get; set; }
        public bool IsCollection { get; set; }
        public bool IsCollectionItem { get; set; }
        public int CollectionIndex { get; set; }

        public FieldContext()
        {
            CollectionIndex = -1;
        }

        public override string ToString()
        {
            if (IsCollectionItem)
            {
                return $"{Name}[{CollectionIndex}]";
            }
            return Name;
        }
    }
}
