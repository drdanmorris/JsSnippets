using PulseCommon.Tests.UnitTests.New.Helpers.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PulseCommon.Tests.UnitTests.New.Helpers.FileComparer
{
    public class CursorContext
    {
        private List<FieldContext> _path = new List<FieldContext>();
        private FieldContext _popped = null;

        private FieldContext last
        {
            get
            {
                if (_path.Count() > 0)
                {
                    return _path.Last();
                }
                return null;
            }
        }

        public string Path
        {
            get
            {
                List<string> pathList = new List<string>();
                _path.ForEach(p =>
                {
                    pathList.Add(p.ToString());
                });
                return string.Join(".", pathList);
            }
        }

        public LineContext Append(string s)
        {
            LineContext lineCtx = LineContext.CreateFrom(s);

            if (lineCtx.LineType == LineType.Object)
            {
                var ctx = new FieldContext() { Name = lineCtx.Name };
                _path.Add(ctx);
            }
            else if (lineCtx.LineType == LineType.Array)
            {
                var ctx = new FieldContext() { Name = lineCtx.Name, IsCollection = true };
                _path.Add(ctx);
            }
            else if (lineCtx.LineType == LineType.ArrayObject)
            {
                if (last != null)
                {
                    if (_popped != null && _popped.IsCollectionItem)
                    {
                        var ctx = new FieldContext() { Name = _popped.Name, IsCollectionItem = true, CollectionIndex = _popped.CollectionIndex + 1 };
                        _path.Add(ctx);
                    }
                    else if (last.IsCollection)
                    {
                        var ctx = new FieldContext() { Name = last.Name.TrimEnd("s".ToCharArray()), IsCollectionItem = true, CollectionIndex = 0 };
                        _path.Add(ctx);
                    }
                }
            }
            else if (lineCtx.LineType == LineType.ObjectEnd)
            {
                if (_path.Count() > 0)
                {
                    _popped = _path.Last();
                }
                _path.Pop();
            }
            else if (lineCtx.LineType == LineType.ArrayEnd)
            {
                FieldContext popped = _path.Pop();
                if (_path.Count > 0 && (_path.Last().Name == $"{popped?.Name}s"))
                {
                    // Remove parent array entry too.
                    _path.Pop();
                }
                _popped = null;
            }

            lineCtx.Path = Path;
            return lineCtx;
        }


    }
}
