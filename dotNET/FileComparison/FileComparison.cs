using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace FileComparer
{
    public class FileComparison
    {

        public string AB { get; private set; }
        public string BA { get; private set; }
        public bool HasDifferences
        {
            get
            {
                return AB != string.Empty || BA != string.Empty;
            }
        }


        private static readonly List<string> IgnoreFields = new List<string>() {
            "isBaseCoverage",
            "transactionType",
            "systemOfRecord",
            "payloadGeneratorSchemaVersion",
            "policyId",
            "exportedAt"
        };

        private static readonly List<string> IgnorePaths = new List<string>() {
            "originalInceptionDate",
            "systemOfRecordTransactionDate"
        };

        private static readonly List<string> IgnoreValues = new List<string>() {
            "ABBREVIATED_NAME",
            "LATEST"
        };

        public FileComparison(FileIndex IndexA, FileIndex IndexB)
        {
            AB = Compare(IndexA, IndexB, "AB");
            BA = Compare(IndexB, IndexA, "BA");
        }

        private string Compare(FileIndex refIndex, FileIndex otherIndex, string direction)
        {
            refIndex.Entries.ForEach(entry =>
            {
                if(!entry.Matched)
                {
                    var matchingEntry = otherIndex.GetMatchingEntryFor(entry);
                    if(matchingEntry != null)
                    {
                        matchingEntry.SetMatched();
                        entry.SetMatched();
                    }
                    else
                    {
                        // No matching entry.
                    }
                }
                else
                {
                    // Already matched, probably at parent level.
                }
            });

            // refIndex.SyncMatched();

            var unmatched = refIndex.Entries.Where(e => {
                return !e.HasChildren &&
                    !e.Matched &&
                    e.Value != "N/A" &&
                    !IgnoreFields.Contains(e.Name) &&
                    !IgnoreValues.Contains(e.Value) &&
                    !IgnorePaths.Where(p => e.AbsolutePath.Contains(p)).Any()
                    ;
            });

            if(unmatched.Count() > 0)
            {
                string unmatchedReport = string.Join("\r\n", unmatched.Select(e => $"{e.DisplayPath} = {e.Value}"));
                File.WriteAllText($"c:/TestData/unmatched{direction}.json", unmatchedReport);
                return unmatchedReport;
            }

            return string.Empty;

        }


    }

}
