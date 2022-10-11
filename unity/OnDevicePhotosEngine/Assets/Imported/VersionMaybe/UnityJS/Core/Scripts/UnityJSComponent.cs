using System;
using UnityEngine;
using Newtonsoft.Json;
using System.Runtime.InteropServices;

namespace VersionMaybe.UnityJS
{
    public class UnityJSComponent : MonoBehaviour
    {
        public EventHandler<string> OnJSMessage;

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        public static extern void OnUnityMessage(string json);
#endif
        void Awake()
        {
#if UNITY_WEBGL && !UNITY_EDITOR
        Debug.LogWarning("[UnityJS] Not currently running in a browser.");
#endif
        }

        void Start()
        {
            SendToBrowser("Ready", null);
        }

        public void SendToBrowser(string action, object data)
        {
            UnityJSPacket packet = new UnityJSPacket();
            packet.action = action;
            packet.data = JsonConvert.SerializeObject(data);
            string json = JsonConvert.SerializeObject(packet);

#if UNITY_WEBGL && !UNITY_EDITOR
            OnUnityMessage(json);
#else
            Debug.LogWarning("[UnityJS] Message wasn't sent as you're not currently in a browser.");
#endif
        }

        public void SendToUnity(string json)
        {
            OnJSMessage(this, $"{json}");
        }
    }
}