import {observer} from "mobx-react";
import React from "react";
import {TestItemExampleCardProps} from "../../components/TypesAndItemOverrides";
import {Card, CardContent, Collapse, Typography} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import {AudioExampleSettingsDialog} from "../AudioExampleSettingsDialog";
import Grid from "@material-ui/core/Grid";
import {TagsGroup} from "../../../shared/components/TagsGroup";
import {SurveyControl} from "../../../shared/components/SurveyControl";
import {AudioFileDropGrid} from "../AudioFileDropGrid";
import {FileUploadDropBox} from "../../../shared/components/FileUploadDropBox";
import Icon from "@material-ui/core/Icon";
import {AudioExampleSettingsModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlType} from "../../../shared/models/EnumsAndTypes";

export const AcrTestItemExampleCard = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, title, action, collapsed} = props;
  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => {
    example.medias.push(newAudio);
    example.fields.push({type: SurveyControlType.description, question: 'Compare the quality of these sounds.', required: true, value: null});
  }
  // Setting submitted
  const handleSettingChange = (settings: AudioExampleSettingsModel) => example.settings = settings;
  const handleAudioRemove = (index: number) => example.fields.splice(index, 1);

  return <Card>
    <CardHeader title={title} action={<>
      <AudioExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange} enableFixLastInternalQuestion/>
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

          <AudioFileDropGrid example={example} reference onRemove={handleAudioRemove}/>
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
  </Card>;
});
