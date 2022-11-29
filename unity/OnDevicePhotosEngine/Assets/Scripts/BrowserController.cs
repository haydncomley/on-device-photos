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
        SetupSetters();
        SetupGetters();
    }

    void SetupSetters()
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

        UnityJS.Listen<string>("setCameraRotation", ((res) =>
        {
            cameraController.SetCameraRotation(StringToVector(res));
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
    }

    void SetupGetters()
    {
        UnityJS.Listen<int>("getScreenshot", ((res) =>
        {
            FindObjectOfType<WebGLDownload>().GetScreenshot(WebGLDownload.ImageFormat.png, Mathf.Max(res, 1), "Screenshot");
        }));

        UnityJS.Listen("getCameraRotation", (() =>
        {
            UnityJS.Send("cameraRotation", VectorToString(cameraController.transform.localEulerAngles));
        }));

        UnityJS.Listen("getDeviceRotation", (() =>
        {
            UnityJS.Send("deviceRotation", VectorToString(cameraController.device.transform.localEulerAngles));
        }));
    }

    public static void SendVector(string actionName, Vector3 vector)
    {
        UnityJS.Send(actionName, VectorToString(vector));
    }

    public static Vector3 StringToVector(String vec)
    {
        String[] vecSplit = vec.Split(',');
        return new Vector3(
            float.Parse(vecSplit[0]),
            float.Parse(vecSplit[1]),
            float.Parse(vecSplit[2])
        );
    }

    public static String VectorToString(Vector3 vector)
    {
        return $"{vector.x},{vector.y},{vector.z}";
    }
}
