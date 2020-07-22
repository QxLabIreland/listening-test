
export interface AudioFileModel {
  filename: string | null;
  src: string | null;
  tags?: string;
  value: string;
  // Additional attributes
  isPlaying?: boolean;
  settings?: AudioSettings;
}

export interface AudioSettings {
  frequency: string;
  initVolume: number;
}
