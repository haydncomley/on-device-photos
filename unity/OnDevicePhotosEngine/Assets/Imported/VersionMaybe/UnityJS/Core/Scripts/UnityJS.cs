using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;

namespace VersionMaybe.UnityJS
{
    class UnityJSCallback
    {
        public int id;
        public string action;
        public Action<string> callback;

        public UnityJSCallback(string _action, Action<string> _callback, int _id)
        {
            action = _action;
            callback = _callback;
            id = _id;
        }
    }

    [Serializable]
    public class UnityJSPacket
    {
        public string action;
        public string data;
    }

    public static class UnityJS
    {
        private static UnityJSComponent component;
        private static readonly ConcurrentDictionary<Type, bool> IsSimpleTypeCache = new ConcurrentDictionary<System.Type, bool>();
        private static List<UnityJSCallback> callbacks = new List<UnityJSCallback>();
        private static int callbackCount = 0;

        private static UnityJSComponent Instance()
        {
            if (!component)
            {
                GameObject go = new GameObject();
                go.name = "UnityJS";
                UnityEngine.Object.DontDestroyOnLoad(go);
                component = go.AddComponent<UnityJSComponent>();
                component.OnJSMessage += OnHandlerMessage;
            };

            return component;
        }

        public static void Send(string action)
        {
            Instance().SendToBrowser(action, "");
        }

        public static void Send(string action, object data)
        {
            Instance().SendToBrowser(action, UnityJS.IsPrimitive(data.GetType()) ? data : JsonUtility.ToJson(data));
        }

        private static void OnHandlerMessage(object sender, string response)
        {
            Instance();
            UnityJSPacket data = JsonConvert.DeserializeObject<UnityJSPacket>(response);
            for (int i = 0; i < callbacks.Count; i++)
            {
                if (callbacks[i].action == null || callbacks[i].action == data.action)
                {
                    callbacks[i].callback(data.data);
                }
            }
        }

        public static void Clear(int id)
        {
            int index = callbacks.FindIndex((x) => x.id == id);
            callbacks.RemoveAt(index);
        }

        public static int Listen(Action callback)
        {
            Instance();
            int id = callbackCount++;
            callbacks.Add(new UnityJSCallback(
                null, (string json) => callback(), id
            ));
            return id;
        }

        public static int Listen(string action, Action callback)
        {
            Instance();
            int id = callbackCount++;
            callbacks.Add(new UnityJSCallback(
                action, (string json) => callback(), id
            ));
            return id;
        }

        public static int Listen<T>(string action, Action<T> callback)
        {
            Instance();
            int id = callbackCount++;
            callbacks.Add(new UnityJSCallback(
                action, (string json) => callback(JsonConvert.DeserializeObject<T>(json)), id
            ));
            return id;
        }

        private static bool IsPrimitive(Type type)
        {
            return IsSimpleTypeCache.GetOrAdd(type, t =>
                type.IsPrimitive ||
                type.IsEnum ||
                type == typeof(string) ||
                type == typeof(decimal) ||
                type == typeof(DateTime) ||
                type == typeof(DateTimeOffset) ||
                type == typeof(TimeSpan) ||
                type == typeof(Guid) ||
                IsNullableSimpleType(type));

            static bool IsNullableSimpleType(Type t)
            {
                var underlyingType = Nullable.GetUnderlyingType(t);
                return underlyingType != null && IsPrimitive(underlyingType);
            }
        }
    }
}