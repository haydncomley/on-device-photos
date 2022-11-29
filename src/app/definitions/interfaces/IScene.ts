export interface IScene {
    id: string;
    name: string;
    // Camera
    camera_zoom?: number;
    camera_position?: string;
    // Device
    device_position?: string;
}