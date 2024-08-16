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
