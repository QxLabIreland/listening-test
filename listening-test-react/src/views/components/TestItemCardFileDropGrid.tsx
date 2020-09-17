import {observer} from "mobx-react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import React, {useState} from "react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";

export const TestItemCardFileDropGrid = observer(function ({example, reference}: {example: ItemExampleModel, reference?: boolean}) {
  const [draggingIndex, setDraggingIndex] = useState<number>();

  const swapFiles = (dropIndex: number) => {
    if (draggingIndex === dropIndex) return;
    const temp = example.audios[dropIndex];
    example.audios[dropIndex] = {...example.audios[draggingIndex]};
    example.audios[draggingIndex] = temp;
    setDraggingIndex(undefined);  }
  const startDraggingFile = (index: number) => {
    setDraggingIndex(index);
  }

  const handleDelete = (index: number) => example.audios.splice(index, 1);
  const handleChange = (newAudio: AudioFileModel, index: number) => {
    if (newAudio == null) {
      handleDelete(index);
      return;
    }
    // If is Reference the audioRef will be added or deleted
    if (index === -1 && reference) example.audioRef = newAudio;
    else example.audios[index] = newAudio;
  }
  return <>
    {/*Reference place*/}
    {reference && <Grid item xs={12} md={4}>
      <FileDropZone fileModel={example.audioRef} onChange={fm => handleChange(fm, -1)}
                    label="Reference Labeled (Optional)"
      />
    </Grid>}
    {/*File drop area*/}
    {example.audios.map((a, i) => <Grid item xs={12} md={4} key={i}>
      <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)} disabled={draggingIndex !== undefined}
                    onDrop={() => swapFiles(i)} onDragStart={() => startDraggingFile(i)}
      />
    </Grid>)}
  </>
})
