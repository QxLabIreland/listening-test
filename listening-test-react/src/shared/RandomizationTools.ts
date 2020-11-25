import {useEffect, useState} from "react";
import {toJS} from "mobx";
import {BasicTaskItemModel} from "./models/BasicTaskModel";
import {TestItemType} from "./models/EnumsAndTypes";

export function useRandomization<T>(items: T[], activated: boolean, fixLast?: boolean): [T[], number[]] {
  const [randoms, setRandoms] = useState<[T[], number[]]>([items, Array.from(items.keys())]);

  useEffect(() => {
    // If there is random audio settings
    if (activated) {
      const indexesLeft = Array.from(items, (_, i) => i);
      // Pop the last index if fixLast has been set
      const lastIndex = fixLast ? indexesLeft.pop() : undefined;
      // Create placeholders
      const newRandomItems: T[] = Array(items.length);
      const newRandomPattern: number[] = [];
      // Go through all items
      items.forEach(item => {
        // If there is no indexes left and lastIndex is not null
        if (indexesLeft.length < 1 && !isNaN(lastIndex)) {
          newRandomItems[lastIndex] = item;
          newRandomPattern.push(lastIndex);
          return;
        }
        // Get an index of indexes
        const index = Math.floor(Math.random() * indexesLeft.length);
        newRandomItems[indexesLeft[index]] = item;
        // Save random pattern for other fields
        newRandomPattern.push(indexesLeft[index]);
        // Then delete it from indexes at the end
        indexesLeft.splice(index, 1);
      });
      setRandoms([newRandomItems, newRandomPattern]);
      // Testing logging
      console.log('Original', toJS(items))
      console.log('Random', newRandomItems.map(value => toJS(value)))
      console.log('Pattern', newRandomPattern)
    }
  }, [activated]);

  return randoms;
}

export function useDivideIntoSections<T extends BasicTaskItemModel>(items: T[]): T[] {
  const [newItems, setNewItems] = useState<T[]>();

  useEffect(() => {
    if (!items) return;
    // Divide items into sections first
    const sections: T[][] = [];
    let questions: T[] = [];
    items.forEach(item => {
      // If there is a section header, it means that the questions below to the section are belond to this section
      if (item.type === TestItemType.sectionHeader) {
        // We also need empty array
        if (questions) sections.push(questions);
        questions = [item];
      } else questions.push(item);
    });
    // Push questions of the end of section
    sections.push(questions);
    console.log('Grouped', sections.map(v => v.map(v1 => toJS(v1))))

    const newItems: T[] = []
    // Try to randomize questions for sections
    sections.forEach(section => {
      if (section.length && section[0].type === TestItemType.sectionHeader) {
        // Only randomize if there is the setting
        if (section[0].sectionSettings?.randomQuestions) {
          const fixedItems = section[0].sectionSettings?.fixedItems;
          const indexesLeft: number[] = [];
          // Leave first and fixed out
          section.forEach((value, index) => {
            if (value.type !== TestItemType.sectionHeader && (!fixedItems || fixedItems.indexOf(value.id) < 0)) {
              indexesLeft.push(index);
            }
          });
          console.log('Indexes have been left', indexesLeft)
          // This will ignore the first element of an array
          let currentIndex = 0;
          // While there remain elements to shuffle...
          while (currentIndex < section.length - 1) {
            // Pick a remaining element...
            const randomIndex = Math.floor(Math.random() * indexesLeft.length);
            currentIndex += 1;
            // Continue if it is fixed
            console.log('Current override index: ', currentIndex)
            if (fixedItems?.indexOf(section[currentIndex].id) > -1) continue;

            // And swap it with the current element.
            const temporaryValue = section[currentIndex];
            section[currentIndex] = section[indexesLeft[randomIndex]];
            section[indexesLeft[randomIndex]] = temporaryValue;
          }
        }
        // Delete section hedaer in display
        section.splice(0, 1);
      }
      // Push random items back to new items list and ignore section header
      newItems.push(...section);
    });
    console.log('Random', newItems.map(v => toJS(v)))
    setNewItems(newItems);
  }, [items]);

  return items ? newItems : null;
}
