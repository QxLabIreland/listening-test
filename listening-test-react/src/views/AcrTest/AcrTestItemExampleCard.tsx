import {ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
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
import {TestItemExampleCardProps} from "../components/SomeTypes";
import {TestItemCardFileDropGrid} from "../components/TestItemCardFileDropGrid";

export const AcrTestItemExampleCard = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, title, action, collapsed} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.audios.push(newAudio);
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

          <TestItemCardFileDropGrid example={example} reference={true}/>

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
