import {useEffect, useState} from "react";
import {toJS} from "mobx";
import {BasicTaskItemModel} from "./models/BasicTaskModel";
import {TestItemType} from "./models/EnumsAndTypes";

export function useRandomization<T>(items: T[], activated: boolean): [T[], number[]] {
  const [randoms, setRandoms] = useState<[T[], number[]]>([items, Array.from(items.keys())]);

  useEffect(() => {
    // If there is random audio settings
    if (activated) {
      const indexesLeft = Array.from(items, (_, i) => i);
      // Create placeholders
      const newRandomItems = Array(items.length);
      const newRandomPattern: number[] = [];
      // Go through all items
      items.forEach(item => {
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
      console.log(toJS(items))
      console.log(newRandomItems.map(value => toJS(value)))
      console.log(newRandomPattern)
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
    console.log(sections)

    const newItems: T[] = []
    // Try to randomize questions for sections
    sections.forEach(section => {
      if (section.length && section[0].type === TestItemType.sectionHeader) {
        // Only randomize if there is the setting
        if (section[0].sectionSettings?.randomQuestions) {
          // This will ignore the first element of an array
          let currentIndex = 0;

          // While there remain elements to shuffle...
          while (currentIndex < section.length - 1) {
            // Pick a remaining element...
            const randomIndex = Math.floor(Math.random() * (section.length - currentIndex - 1)) + 1;
            currentIndex += 1;

            // And swap it with the current element.
            const temporaryValue = section[currentIndex];
            section[currentIndex] = section[randomIndex];
            section[randomIndex] = temporaryValue;
          }
        }
        // Delete section hedaer in display
        section.splice(0, 1);
      }
      // Push random items back to new items list and ignore section header
      newItems.push(...section);
    });
    setNewItems(newItems);
  }, [items]);

  return items ? newItems : null;
}
