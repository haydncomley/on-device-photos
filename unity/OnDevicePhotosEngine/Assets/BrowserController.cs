using System;
using UnityEngine;
using VersionMaybe.UnityJS;

class StageSettings
{
    public bool showFloor;
    public bool showSky;
    public bool softShadows;
}

class DeviceSettings
{
    public bool isPhoneUpright;
    public bool showDeviceMeta;
}

public class BrowserController : MonoBehaviour
{
    public StageController stageController;
    public CameraController cameraController;
    void Start()
    {
        UnityJS.Listen<StageSettings>("setEnvironment", (settings =>
        {
            stageController.showFloor = settings.showFloor;
            stageController.showSky = settings.showSky;
            stageController.softShadows = settings.softShadows;
            stageController.deviceUpdateAvailable = true;
        }));

        UnityJS.Listen<DeviceSettings>("setDevice", (settings =>
        {
            stageController.isPhoneUpright = settings.isPhoneUpright;
            stageController.showDeviceMeta = settings.showDeviceMeta;
            stageController.deviceUpdateAvailable = true;
        }));

        UnityJS.Listen<float>("setZoom", ((zoom) =>
        {
            cameraController.cameraZoom = zoom;
        }));

        UnityJS.Listen<string>("setImage", (path =>
        {
            StartCoroutine(stageController.LoadScreenTexture(path));
        }));

        UnityJS.Listen<int>("getScreenshot", ((res) =>
        {
            FindObjectOfType<WebGLDownload>().GetScreenshot(WebGLDownload.ImageFormat.png, Mathf.Max(res, 1), "Screenshot");
        }));
    }
}
