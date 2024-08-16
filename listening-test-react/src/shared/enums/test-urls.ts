export const TEST_URLS = [
  'ab-test',
  'acr-test',
  'mushra-test',
  'hearing-test',
  'audio-labeling',
  'image-labeling',
  'image-ab',
  'video-labeling',
  'video-ab',
] as const;

// Types of string for kinds of test
export type TestUrl = (typeof TEST_URLS)[number];

export const URL_TO_TITLE: { [key: string]: string } = {
  dashboard: 'Go Listen Home',
  storage: 'Sotrage Status',
  people: 'User Management',
  template: 'Template Management',
  settings: 'Settings',
  'ab-test': 'AB Test',
  'acr-test': 'ACR Test',
  'mushra-test': 'MUSHRA Test',
  'hearing-test': 'Hearing Sensitivity Test',
  'audio-labeling': 'Audio Labeling Task',
  'image-labeling': 'Image Labeling Task',
  'image-ab': 'Image AB Task',
  'video-labeling': 'Video Labeling Task',
  'video-ab': 'Video AB Task',
} as const;
