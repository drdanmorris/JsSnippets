using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;

namespace Helpers
{
    public static class SerialisationHelper
    {
        public static dynamic ToDynamic(this object obj)
        {
            return SerializerHelper.Clean(obj);
        }

        public static dynamic ToExpando(this object obj, string path = "")
        {
            if (obj == null)
            {
                return null;
            }

            if (obj.GetType().BaseType.Name == "Array")
            {
                var list = new List<dynamic>();
                (obj as object[]).ToList().ForEach(item =>
                {
                    list.Add(item.ToExpando());
                });
                return list;
            }

            var dyn = new ExpandoObject() as IDictionary<string, Object>;
            var props = obj.GetType().GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
            props.ToList().ForEach(p =>
            {

                if (p.PropertyType.IsValueType || p.PropertyType.Name == "String")
                {
                    dyn.Add(p.Name, p.GetValue(obj));
                }
                else if (p.PropertyType.BaseType != null && p.PropertyType.BaseType.Name == "Array")
                {
                    var val = p.GetValue(obj);

                    object[] array = val as object[];
                    if (array != null)
                    {
                        var list = new List<dynamic>();
                        dyn.Add(p.Name, list);
                        array.ToList().ForEach(item =>
                        {
                            if (p.PropertyType.Name == "String[]")
                            {
                                list.Add(item);
                            }
                            else
                            {
                                list.Add(item.ToExpando(path + p.Name + ","));
                            }

                        });
                    }
                }
                else if (p.PropertyType.BaseType != null && p.PropertyType.BaseType.Name == "Object")
                {
                    dyn.Add(p.Name, p.GetValue(obj).ToExpando(path + p.Name + ","));
                }
                else if (p.Name == "SyncRoot")
                {
                    // Ignore
                }
                else
                {
                    throw new Exception($"Unexpected property {p.Name} ({p.PropertyType.Name}). Path = {path}");
                }
            });
            return dyn;
        }

    }
}


