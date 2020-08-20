import {ItemExampleModel, ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse} from "@material-ui/core";
import {SurveyControl} from "../../shared/components/SurveyControl";
import React from "react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {TagsGroup} from "../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import ExampleSettingsDialog from "../shared-views/ExampleSettingsDialog";
import {observer} from "mobx-react";

export const AcrTestItemExampleCard = observer((props: React.PropsWithChildren<{
  example: ItemExampleModel,
  title: React.ReactNode,
  action: React.ReactNode,
  collapsed?: boolean
}>) => {
  const {example, title, action, collapsed} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.audios.push(newAudio);

  const handleDelete = (index: number) => {
    if (index === -1) example.audioRef = undefined;
    else example.audios.splice(index, 1);
  }

  const handleChange = (newAudio: AudioFileModel, index: number) => {
    if (newAudio == null) {
      handleDelete(index);
      return;
    }
    // If is Reference the audioRef will be added or deleted
    if (index === -1) example.audioRef = newAudio;
    else example.audios[index] = newAudio;
  }

  // Setting submitted
  const handleSettingChange = (settings: ItemExampleSettingsModel) => example.settings = settings;

  return <Card>
    <CardHeader title={title} action={<>
      <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      {action}</>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
          </Grid>

          {/*Description for this example*/}
          {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <SurveyControl control={q}/>
          </Grid>)}

          {/*Reference place*/}
          <Grid item xs={12} md={4}>
            <FileDropZone fileModel={example.audioRef} onChange={fm => handleChange(fm, -1)}
                          label="Labeled Reference (Optional)"/>
          </Grid>
          {example.audios.map((a, i) => <Grid item xs={12} md={4} key={i}>
            <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)}/>
          </Grid>)}
          {/*Placeholder for adding to list*/}
          <Grid item xs={12} md={4}>
            <FileDropZone onChange={handleAdd} label="Drop or click to add a file"/>
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
})
