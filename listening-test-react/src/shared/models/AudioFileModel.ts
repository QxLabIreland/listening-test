
export interface AudioFileModel {
  filename: string | null;
  src: string | null;
  tags?: string;
  value: string;
  settings?: AudioSettings;
  // Additional attributes
  isPlaying?: boolean;
  playedOnce?: boolean;
}

export interface AudioSettings {
  frequency: number;
  initVolume: number;
}
