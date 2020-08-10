// Make sure it works on safari and firefox. And create only one for the application
const audioContext = !window ? new (window.AudioContext || (window as any).webkitAudioContext)() : {};

export interface OscillatorAngGain {
  oscillator: OscillatorNode;
  gainNode: GainNode;
}

/** Use this function to create an oscillator.
 *  To play oscillator, please use OscillatorAngGain.oscillator.start(); */
export function createOscillatorAndGain(volume: number, frequency: number): OscillatorAngGain {
  // Create oscillator and gain nodes
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  // Calculate gain volume db
  const gainDb = (volume - 1) * 100;
  gainNode.gain.value = Math.pow(10, gainDb / 20);
  // Change default frequency
  oscillator.frequency.value = frequency;
  // Connect gainNode and oscillator
  gainNode.connect(audioContext.destination);
  oscillator.connect(gainNode);
  return {oscillator, gainNode};
}

export function disposeOscillatorAndGain(go: OscillatorAngGain): null {
  if (go?.oscillator) {
    go.oscillator.stop();
    go.oscillator.disconnect();
  }
  if (go?.gainNode) go.gainNode.disconnect();
  return null;
}
