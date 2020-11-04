import {useEffect, useState} from "react";
import {toJS} from "mobx";
import {BasicTaskItemModel} from "./models/BasicTaskModel";
import {TestItemType} from "./models/EnumsAndTypes";

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

export function useDivideIntoSections<T extends BasicTaskItemModel>(items: T[]): T[] {
  const [newItems] = useState<T[]>([]);

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

    // Try to randomize questions for sections
    sections.forEach(section => {
      if (section.length && section[0].type === TestItemType.sectionHeader && section[0].sectionSettings?.randomQuestions) {
        // This will ignore the first element of an array
        let currentIndex = section.length;

        // While there remain elements to shuffle...
        while (currentIndex > 0) {
          // Pick a remaining element...
          const randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          const temporaryValue = section[currentIndex];
          section[currentIndex] = section[randomIndex];
          section[randomIndex] = temporaryValue;
        }
      }
      // Push random items back to new items list
      newItems.push(...section);
    });
  }, [items]);

  return items ? newItems : null;
}
