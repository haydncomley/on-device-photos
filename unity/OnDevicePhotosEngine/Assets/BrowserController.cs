using System;
using UnityEngine;
using VersionMaybe.UnityJS;

class StageSettings
{
    public bool showFloor;
    public bool showSky;
    public bool isPhoneUpright;
    public bool showDeviceMeta;
    public bool softShadows;
}

public class BrowserController : MonoBehaviour
{
    public StageController stageController;
    void Start()
    {
        UnityJS.Listen<StageSettings>("setStage", (settings =>
        {
            stageController.showFloor = settings.showFloor;
            stageController.showSky = settings.showSky;
            stageController.isPhoneUpright = settings.isPhoneUpright;
            stageController.showDeviceMeta = settings.showDeviceMeta;
            stageController.softShadows = settings.softShadows;

            stageController.deviceUpdateAvailable = true;
        }));

        UnityJS.Listen<string>("setImage", (path =>
        {
            StartCoroutine(stageController.LoadScreenTexture(path));
        }));

        UnityJS.Listen<int>("getScreenshot", ((res) =>
        {
            FindObjectOfType<WebGLDownload>().GetScreenshot(WebGLDownload.ImageFormat.png, Mathf.Max(res, 1), "Test");
        }));
    }
}
