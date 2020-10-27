import {useEffect, useState} from "react";
import {BasicFileModel} from "./models/BasicTaskModel";
import {observable, toJS} from "mobx";

export function useRandomizedAudio(settings: {randomMedia?: boolean}, medias: BasicFileModel[], active: boolean) {
  const [randomAudios] = useState(observable(Array(medias.length)));

  useEffect(() => {
    // If there is random audio settings
    if (active && settings?.randomMedia) medias.forEach(audio => {
      let randomIndex = Math.floor(Math.random() * randomAudios.length);
      while (randomAudios[randomIndex] != null)
        randomIndex = Math.floor(Math.random() * randomAudios.length);
      randomAudios[randomIndex] = audio;
    });
    // Normally set all audio to the state
    else medias.forEach((v, i) => medias[i] = v);
    console.log(toJS(medias))
    console.log(toJS(randomAudios))
  }, [active])

  return randomAudios;
}
