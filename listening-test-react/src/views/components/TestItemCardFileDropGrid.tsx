import {observer} from "mobx-react";
import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {BasicExampleModel, BasicFileModel} from "../../shared/models/BasicTaskModel";
// reference means we can upload reference. keepPlace means the audio place will be kept after a deletion
export const TestItemCardFileDropGrid = observer(function ({example, reference, keepPlace}: {
  example: BasicExampleModel, reference?: boolean, keepPlace?: boolean}) {
  const [draggingIndex, setDraggingIndex] = useState<number>();

  const swapFiles = (dropIndex: number) => {
    if (draggingIndex === dropIndex) return;
    const temp = example.medias[dropIndex];
    example.medias[dropIndex] = {...example.medias[draggingIndex]};
    example.medias[draggingIndex] = temp;
    setDraggingIndex(undefined);  }
  const startDraggingFile = (index: number) => {
    setDraggingIndex(index);
  }

  const handleDelete = (index: number) => {
    if (keepPlace) example.medias[index] = null;
    else example.medias.splice(index, 1);
  }
  const handleChange = (newAudio: BasicFileModel, index: number) => {
    if (newAudio == null) {
      handleDelete(index);
      return;
    }
    // If is Reference the audioRef will be added or deleted
    if (index === -1 && reference) example.mediaRef = newAudio;
    else example.medias[index] = newAudio;
  }
  return <>
    {/*Reference place*/}
    {reference && <Grid item xs={12} md={4}>
      <FileDropZone fileModel={example.mediaRef} onChange={fm => handleChange(fm, -1)}
                    label="Reference Labeled (Optional)"
      />
    </Grid>}
    {/*File drop area*/}
    {example.medias.map((a, i) => <Grid item xs={12} md={4} key={i}>
      <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)} disabled={draggingIndex !== undefined}
                    onDrop={() => swapFiles(i)} onDragStart={() => startDraggingFile(i)}
      />
    </Grid>)}
  </>
})
