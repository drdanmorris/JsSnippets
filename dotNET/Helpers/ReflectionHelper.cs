using Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Helpers
{
    public class ReflectionHelper
    {
        private static void SetNumeric(PropertyInfo p, object obj, int numericVal)
        {
            int intValue = numericVal;

            if (p.Name.ToLower().Contains("gst"))
            {
                intValue = 12;
            }

            if (p.PropertyType == typeof(Decimal))
            {
                p.SetValue(obj, Convert.ToDecimal(intValue));
            }
            else
            {
                p.SetValue(obj, intValue);
            }

        }

        public static void PopulateAllNumericFieldsIn(object obj, int toValue = 1000)
        {
            EnumerateObject(obj, (PropertyInfo p, object o) =>
            {
                if (p.PropertyType.IsNumeric())
                {
                    SetNumeric(p, o, toValue);
                }
            });
        }

        public static void SetAllFieldsToNullIn(object obj)
        {
            if (obj.GetType().Name == "ExpandoObject")
            {
                SetAllFieldsInExpandoObjectToNullIn(obj);
            }
            else
            {
                SetAllFieldsInTypedObjectToNullIn(obj);
            }
        }

        public static void SetAllFieldsInTypedObjectToNullIn(object obj)
        {
            var props = obj.GetType().GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
            props.ToList().ForEach(p =>
            {
                p.SetValue(obj, null);
            });
        }

        public static void SetAllFieldsInExpandoObjectToNullIn(object obj)
        {
            var expando = obj as IDictionary<String, Object>;

            expando.Keys.ToList().ForEach(key =>
            {
                expando[key] = null;
            });
        }

        protected static void EnumerateObject(object obj, Action<PropertyInfo, object> processPropFn)
        {
            if (obj == null)
            {
                return;
            }

            var props = obj.GetType().GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
            props.ToList().ForEach(p =>
            {

                if (p.PropertyType.IsPrimitive())
                {
                    processPropFn(p, obj);
                }
                else if (p.PropertyType.IsList())
                {
                    var val = p.GetValue(obj);
                    var list = val as IEnumerable;

                    if (list != null)
                    {
                        foreach (var item in list)
                        {
                            if (p.PropertyType.IsPrimitive())
                            {
                                processPropFn(p, obj);
                            }
                            else if (p.PropertyType.IsObject())
                            {
                                EnumerateObject(item, processPropFn);
                            }
                        }
                    }
                }
                else if (p.PropertyType.IsObject())
                {
                    var val = p.GetValue(obj);
                    EnumerateObject(val, processPropFn);
                }
            });

        }

    }
}
