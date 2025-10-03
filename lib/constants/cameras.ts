// Camera information for each rover
// Data structure to support camera filtering

export interface CameraInfo {
  readonly name: string;
  readonly fullName: string;
}

// Common cameras across rovers
export const ROVER_CAMERAS: Record<string, readonly CameraInfo[]> = {
  curiosity: [
    { name: "FHAZ", fullName: "Front Hazard Avoidance Camera" },
    { name: "RHAZ", fullName: "Rear Hazard Avoidance Camera" },
    { name: "MAST", fullName: "Mast Camera" },
    { name: "CHEMCAM", fullName: "Chemistry and Camera Complex" },
    { name: "MAHLI", fullName: "Mars Hand Lens Imager" },
    { name: "MARDI", fullName: "Mars Descent Imager" },
    { name: "NAVCAM", fullName: "Navigation Camera" },
  ],
  perseverance: [
    { name: "EDL_RUCAM", fullName: "Rover Up-Look Camera" },
    { name: "EDL_RDCAM", fullName: "Rover Down-Look Camera" },
    { name: "EDL_DDCAM", fullName: "Descent Stage Down-Look Camera" },
    { name: "EDL_PUCAM1", fullName: "Parachute Up-Look Camera A" },
    { name: "EDL_PUCAM2", fullName: "Parachute Up-Look Camera B" },
    { name: "NAVCAM_LEFT", fullName: "Navigation Camera - Left" },
    { name: "NAVCAM_RIGHT", fullName: "Navigation Camera - Right" },
    { name: "MCZ_RIGHT", fullName: "Mast Camera Zoom - Right" },
    { name: "MCZ_LEFT", fullName: "Mast Camera Zoom - Left" },
    {
      name: "FRONT_HAZCAM_LEFT_A",
      fullName: "Front Hazard Avoidance Camera - Left",
    },
    {
      name: "FRONT_HAZCAM_RIGHT_A",
      fullName: "Front Hazard Avoidance Camera - Right",
    },
    {
      name: "REAR_HAZCAM_LEFT",
      fullName: "Rear Hazard Avoidance Camera - Left",
    },
    {
      name: "REAR_HAZCAM_RIGHT",
      fullName: "Rear Hazard Avoidance Camera - Right",
    },
    { name: "SKYCAM", fullName: "MEDA Skycam" },
    { name: "SHERLOC_WATSON", fullName: "SHERLOC WATSON Camera" },
  ],
  opportunity: [
    { name: "FHAZ", fullName: "Front Hazard Avoidance Camera" },
    { name: "RHAZ", fullName: "Rear Hazard Avoidance Camera" },
    { name: "NAVCAM", fullName: "Navigation Camera" },
    { name: "PANCAM", fullName: "Panoramic Camera" },
    { name: "MINITES", fullName: "Miniature Thermal Emission Spectrometer" },
  ],
  spirit: [
    { name: "FHAZ", fullName: "Front Hazard Avoidance Camera" },
    { name: "RHAZ", fullName: "Rear Hazard Avoidance Camera" },
    { name: "NAVCAM", fullName: "Navigation Camera" },
    { name: "PANCAM", fullName: "Panoramic Camera" },
    { name: "MINITES", fullName: "Miniature Thermal Emission Spectrometer" },
  ],
} as const;

// Get cameras for a specific rover
export function getCamerasForRover(roverId: string): readonly CameraInfo[] {
  return ROVER_CAMERAS[roverId.toLowerCase()] || [];
}
