using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DeviceController : MonoBehaviour
{
    public string deviceName;
    public Vector2 screenTextureTiling = new Vector2(1.12f, 0);
    public Vector2 screenTextureOffset = new Vector2(-0.56f, 0);
    public float screenTextureScale = 1;
    public GameObject[] metaElements;
}
