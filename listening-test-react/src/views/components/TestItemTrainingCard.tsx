import {observer} from "mobx-react";
import React from "react";
import {ItemExampleModel, ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ExampleSettingsDialog from "../shared-views/ExampleSettingsDialog";
import {CardContent} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {FileDropZone} from "../../shared/components/FileDropZone";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

export const TestItemTrainingCard = observer((props: React.PropsWithChildren<{
  example: ItemExampleModel,
  title: React.ReactNode,
  onDelete: () => void
}>) => {
  const {example, onDelete, title} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.audios.push(newAudio);

  const handleDelete = (index: number) => example.audios.splice(index, 1);

  const handleChange = (newAudio: AudioFileModel, index: number) => {
    if (newAudio == null) {
      handleDelete(index);
      return;
    }
    example.audios[index] = newAudio;
  }

  // Setting submitted
  const handleSettingChange = (settings: ItemExampleSettingsModel) => example.settings = settings;

  return <Card>
    <CardHeader style={{paddingBottom: 0}} title={title} action={
      <span>
        <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
        <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      </span>
    }/>
    <CardContent>
      <Grid container spacing={2}>
        {/*Description for this example*/}
        {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
          <SurveyControl control={q}/>
        </Grid>)}

        {example.audios.map((a, i) => <Grid item xs={12} md={4} key={i}>
          <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)}/>
        </Grid>)}

        {/*Placeholder for adding to list*/}
        <Grid item xs={12} md={4}>
          <FileDropZone onChange={handleAdd} label="Drop or click to add a file"/>
        </Grid>
      </Grid>
    </CardContent>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
})
