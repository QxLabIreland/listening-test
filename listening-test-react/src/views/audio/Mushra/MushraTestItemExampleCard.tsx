import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse, Typography} from "@material-ui/core";
import {SurveyControl} from "../../../shared/components/SurveyControl";
import React, {ReactNode} from "react";
import {TagsGroup} from "../../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {AudioExampleSettingsDialog} from "../AudioExampleSettingsDialog";
import {observer} from "mobx-react";
import {AudioFileDropGrid} from "../AudioFileDropGrid";
import {AudioExampleModel, AudioExampleSettingsModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import Icon from "@material-ui/core/Icon";
import {FileUploadDropBox} from "../../../shared/components/FileUploadDropBox";

export const MushraTestItemExampleCard = observer((props: React.PropsWithChildren<{
  example: AudioExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}>) => {
  const {example, title, action, collapsed} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.medias.push(newAudio);
  // Setting submitted
  const handleSettingChange = (settings: AudioExampleSettingsModel) => example.settings = settings;

  return <Card style={{borderTop: '3px solid dodgerblue'}}>
    <CardHeader title={title} action={<>
      <AudioExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
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

          <AudioFileDropGrid example={example} reference/>

          {/*Placeholder for adding to list*/}
          <Grid item xs={12} md={4}>
            <FileUploadDropBox onChange={handleAdd} fileType="audio">
              <Typography>Drop or click to add a file</Typography>
              <Icon>attachment</Icon>
            </FileUploadDropBox>
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
})
