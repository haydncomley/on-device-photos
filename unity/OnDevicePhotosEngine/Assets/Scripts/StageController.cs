using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

[ExecuteInEditMode]
public class StageController : MonoBehaviour
{
    [Header("Assignable")]
    public Material primaryMaterial;
    public Material secondaryMaterial;
    public Material screenMaterial;
    public Material screenSecondaryMaterial;
    public Material floorMaterial;
    public GameObject floorGameObject;
    public Transform floorTransform;

    [Header("Stage")]
    public bool showFloor = true;
    public Color floorColor = Color.white;
    public bool showSky = true;
    public Color skyColor = Color.white;
    public bool softShadows = false;

    [Header("Device")]
    public bool isPhoneUpright = true;
    public Color primaryColor = Color.red;
    public Color secondaryColor = Color.blue;
    public Color screenColor = Color.white;
    public Color screenSecondaryColor = Color.black;
    public bool showDeviceMeta = true;

    // Private
    private DeviceController[] devices;

    [Header("Editor Controls")]
    public bool deviceUpdateAvailable = false;
    void Awake()
    {
        deviceUpdateAvailable = true;
    }

    private void Update()
    {
        if (deviceUpdateAvailable)
        {
            deviceUpdateAvailable = false;
            UpdateDevices();
        }

        if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            StartCoroutine(LoadScreenTexture(Application.streamingAssetsPath + "/Screenshot.png"));
        }
    }

    void FindDevices()
    {
        devices = FindObjectsOfType<DeviceController>();
    }

    void UpdateDevices()
    {
        FindDevices();
        skyColor.a = showSky ? 1 : 0;

        if (primaryMaterial) primaryMaterial.color = primaryColor;
        if (secondaryMaterial) secondaryMaterial.color = secondaryColor;
        if (screenMaterial) screenMaterial.color = screenColor;
        if (screenSecondaryMaterial) screenSecondaryMaterial.color = screenSecondaryColor;
        if (floorMaterial) floorMaterial.color = floorColor;
        Camera.main.backgroundColor = skyColor;
        Camera.main.clearFlags = showSky ? CameraClearFlags.Color : CameraClearFlags.Depth;
        FindObjectOfType<Light>().shadows = softShadows ? LightShadows.Soft : LightShadows.Hard;


        foreach (DeviceController device in devices)
        {
            if (isPhoneUpright && device.transform.parent == floorTransform)
            {
                device.transform.SetParent(floorTransform.parent, false);
            }
            else if (!isPhoneUpright && device.transform.parent != floorTransform)
            {
                device.transform.SetParent(floorTransform, false);
            }

            device.transform.localEulerAngles = Vector3.zero;
            device.transform.localPosition = Vector3.zero;

            foreach (GameObject element in device.metaElements)
            {
                element.SetActive(showDeviceMeta);
            }

            screenMaterial.SetVector("_Tiling", device.screenTextureTiling);
            screenMaterial.SetVector("_Offset", device.screenTextureOffset);
            screenMaterial.SetFloat("_Scale", device.screenTextureScale);
        }

        floorGameObject.SetActive(showFloor);
        floorTransform.gameObject.SetActive(!isPhoneUpright);

        if (isPhoneUpright)
        {
            Camera.main.transform.parent.position = new Vector3(0, 0, 0);
            FindObjectOfType<CameraController>().device.transform.position = new Vector3(0, 0, 0);
        }
        else
        {
            Camera.main.transform.parent.position = new Vector3(0, -2, 0);
            FindObjectOfType<CameraController>().device.transform.position = new Vector3(0, -2, 0);
        }
    }

    public IEnumerator LoadScreenTexture(string path)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(path))
        {
            webRequest.downloadHandler = new DownloadHandlerTexture();
            yield return webRequest.SendWebRequest();

            switch (webRequest.result)
            {
                case UnityWebRequest.Result.ConnectionError:
                case UnityWebRequest.Result.DataProcessingError:
                    Debug.LogError(webRequest.error);
                    break;
                case UnityWebRequest.Result.ProtocolError:
                    Debug.LogError(webRequest.error);
                    break;
                case UnityWebRequest.Result.Success:
                    screenMaterial.SetTexture("_MainTexture", DownloadHandlerTexture.GetContent(webRequest));
                    // screenMaterial.mainTexture = DownloadHandlerTexture.GetContent(webRequest);
                    deviceUpdateAvailable = true;
                    break;
            }
        }
    }
}
