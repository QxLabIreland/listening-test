
export interface AudioModel {
  id: number | null;
  filename: string | null;
  src: string | null;
  ref?: any;
  isPlaying?: boolean;
  selected?: boolean;
}
