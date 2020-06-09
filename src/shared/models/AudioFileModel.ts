
export interface AudioFileModel {
  id: number | null;
  filename: string | null;
  src: string | null;
  isPlaying?: boolean;
  selected?: boolean;
}
