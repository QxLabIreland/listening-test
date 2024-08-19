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

export const URL_TO_TITLE = {
  dashboard: 'Go Listen Home',
  storage: 'Storage Status',
  people: 'User Management',
  template: 'Template Management',
  settings: 'Settings',
  'ab-test': 'My Audio AB Tests',
  'acr-test': 'My Audio ACR Tests',
  'mushra-test': 'My Audio MUSHRA Tests',
  'hearing-test': 'My Hearing Sensitivity Tests',
  'audio-labeling': 'My Audio Labeling Tasks',
  'image-labeling': 'My Image Labeling Tasks',
  'image-ab': 'My Image AB Task',
  'video-labeling': 'My Video Labeling Task',
  'video-ab': 'My Video AB Task',
} as const;

export const RESPONSE_HASH_URL = '#responses';
