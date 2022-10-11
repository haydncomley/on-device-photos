using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering.Universal;

public enum CameraControlStyle
{
    Orbit,
    Free
}

public class CameraController : MonoBehaviour
{
    [Header("Assignable")]
    public Transform device;

    [Header("Camera Options")]
    public CameraControlStyle cameraControlStyle = CameraControlStyle.Orbit;
    public bool cameraIsPerspective = false;

    [Range(0.1f, 2f)]
    public float cameraZoom = .69f;

    [Header("Public")]
    public float cameraControlSpeed = 1;
    public float cameraControlSmoothing = 1;
    public bool cameraControlInvertX = true;
    public bool cameraControlInvertY = false;
    public Vector2 cameraZoomRangePerspective = new Vector2(20, 120);
    public Vector2 cameraZoomRangeOrthographic = new Vector2(1, 20);

    // Private
    private Vector2 currentCursorPos = Vector2.zero;
    private Vector2 lastCursorPos = Vector2.zero;
    private Vector2 deltaCursorPos = Vector2.zero;
    private Vector3 targetDeviceRotation = Vector3.zero;
    private Vector3 targetCameraRotation = Vector3.zero;
    private bool forcingDeviceRotation = false;
    private bool forcingCameraRotation = false;
    private bool movingDevice = false;

    private void Awake()
    {
        var universalAdditionalCameraData = GetComponentInChildren<UniversalAdditionalCameraData>() as UniversalAdditionalCameraData;
        universalAdditionalCameraData.renderPostProcessing = false;
    }

    void Update()
    {
        if (Input.GetMouseButton(0))
        {
            movingDevice = false;
            MoveCamera();
        }

        if (Input.GetMouseButton(1))
        {
            movingDevice = true;
            MoveCamera();
        }

        if (Input.GetMouseButtonUp(0) || Input.GetMouseButtonUp(1))
        {
            ResetCameraMovement();
        }

        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            ResetCameraRotation();
        }

        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            ResetDeviceRotation();
        }

        if (Input.GetKeyDown(KeyCode.Alpha0))
        {
            ScreenCapture.CaptureScreenshot("Picture.png");
            Debug.Log(Application.persistentDataPath);
        }

        AdjustCamera();
    }

    private void FixedUpdate()
    {
        if (forcingCameraRotation)
        {
            transform.rotation = Quaternion.Lerp(
                transform.rotation,
                Quaternion.Euler(targetCameraRotation),
                cameraControlSmoothing * Time.deltaTime * 4
            );

            if (Vector3.Distance(transform.eulerAngles, targetCameraRotation) < 0.01)
            {
                forcingCameraRotation = false;
            }
        }

        if (forcingDeviceRotation)
        {
            device.rotation = Quaternion.Lerp(
                device.rotation,
                Quaternion.Euler(targetDeviceRotation),
                cameraControlSmoothing * Time.deltaTime * 4
            );

            if (Vector3.Distance(device.eulerAngles, targetDeviceRotation) < 0.01)
            {
                forcingDeviceRotation = false;
            }
        }
    }

    void AdjustCamera()
    {
        Camera.main.orthographic = !cameraIsPerspective;

        if (cameraIsPerspective)
        {
            Camera.main.fieldOfView = Remap(cameraZoom, .1f, 2f, cameraZoomRangePerspective.x, cameraZoomRangePerspective.y);
        }
        else
        {
            Camera.main.orthographicSize = Remap(cameraZoom, .1f, 2f, cameraZoomRangeOrthographic.x, cameraZoomRangeOrthographic.y);
        }
    }

    void MoveCamera()
    {
        if (lastCursorPos == Vector2.zero)
        {
            lastCursorPos = Input.mousePosition;
        }

        currentCursorPos = Input.mousePosition;
        deltaCursorPos = lastCursorPos - currentCursorPos;

        Vector2 cameraMovement = deltaCursorPos * cameraControlSpeed;
        if (cameraControlInvertX) cameraMovement.x *= -1;
        if (cameraControlInvertY) cameraMovement.y *= -1;

        if (movingDevice)
        {
            cameraMovement.x *= -1;
            cameraMovement.y *= -1;
        }

        Vector3 targetTransform = movingDevice ? device.eulerAngles : transform.eulerAngles;

        if (movingDevice && !forcingDeviceRotation)
        {
            targetDeviceRotation = targetTransform + new Vector3(
                cameraMovement.y,
                cameraMovement.x,
                0
            );
            targetDeviceRotation.x = ClampAngle(targetDeviceRotation.x);
        }
        else if (!forcingCameraRotation)
        {
            targetCameraRotation = targetTransform + new Vector3(
                cameraMovement.y,
                cameraMovement.x,
                0
            );
            targetCameraRotation.x = ClampAngle(targetCameraRotation.x);
        }


        (movingDevice ? device : transform).rotation = Quaternion.Euler(movingDevice ? targetDeviceRotation : targetCameraRotation);

        lastCursorPos = Input.mousePosition;
    }

    public void ResetCameraMovement()
    {
        currentCursorPos = Vector2.zero;
        lastCursorPos = Vector2.zero;
        deltaCursorPos = Vector2.zero;
    }

    public void ResetCameraRotation()
    {
        forcingCameraRotation = true;
        targetCameraRotation = Vector3.zero;
    }

    public void ResetDeviceRotation()
    {
        forcingDeviceRotation = true;
        targetDeviceRotation = Vector3.zero;
    }

    private float Remap(float value, float from1, float to1, float from2, float to2)
    {
        return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
    }

    private float ClampAngle(float value)
    {
        if (value > 180)
        {
            return Mathf.Clamp(value, 270, 361);
        }
        else
        {
            return Mathf.Clamp(value, -1, 90);
        }
    }
}
