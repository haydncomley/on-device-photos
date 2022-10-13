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

class CameraSettings
{
    public bool isPerspective;
}

class GeneralSettings
{
    public int renderQuality;
}

public class BrowserController : MonoBehaviour
{
    public StageController stageController;
    public CameraController cameraController;
    void Awake()
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

        UnityJS.Listen<CameraSettings>("setCamera", (settings =>
        {
            cameraController.cameraIsPerspective = settings.isPerspective;
        }));

        UnityJS.Listen<GeneralSettings>("setGeneral", (settings =>
        {
            QualitySettings.SetQualityLevel(settings.renderQuality, true);
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
