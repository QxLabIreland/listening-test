import {useEffect, useState} from "react";
import {toJS} from "mobx";

export function useRandomization<T>(items: T[], activated: boolean): T[] {
  const [randomAudios] = useState<T[]>(Array(items.length));

  useEffect(() => {
    const indexes = Array.from(items, (_, i) => i);
    // If there is random audio settings
    if (activated) items.forEach(audio => {
      // Get an index of indexes
      const i = Math.floor(Math.random() * indexes.length);
      randomAudios[indexes[i]] = audio;
      // Then delete it from indexes at the end
      indexes.splice(i, 1);
    });
    // Normally set all audio to the state
    else items.forEach((v, i) => randomAudios[i] = v);
    // Testing logging
    console.log(toJS(items))
    console.log(randomAudios.map(value => toJS(value)))
  }, [activated]);

  return randomAudios;
}
