import {useEffect, useState} from "react";
import {toJS} from "mobx";

export function useRandomization<T>(items: T[], activated: boolean): T[] {
  const [randomItems, setRandomItems] = useState<T[]>(items);

  useEffect(() => {
    // If there is random audio settings
    if (activated) {
      // Create placeholders
      const indexesLeft = Array.from(items, (_, i) => i);
      const newRandomItems = Array(items.length);
      // Go through all items
      items.forEach(item => {
        // Get an index of indexes
        const index = Math.floor(Math.random() * indexesLeft.length);
        newRandomItems[indexesLeft[index]] = item;
        // Then delete it from indexes at the end
        indexesLeft.splice(index, 1);
      });
      setRandomItems(newRandomItems);
      // Testing logging
      console.log(toJS(items))
      console.log(newRandomItems.map(value => toJS(value)))
    }
  }, [activated]);

  return randomItems;
}
