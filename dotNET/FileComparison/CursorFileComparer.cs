namespace FileComparer
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
