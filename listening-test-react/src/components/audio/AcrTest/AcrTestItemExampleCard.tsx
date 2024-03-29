import {observer} from "mobx-react";
import React, {ReactNode, useEffect} from "react";
import {Button, Card, CardContent, Collapse, Typography} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import {AudioExampleSettingsDialog} from "../AudioExampleSettingsDialog";
import Grid from "@material-ui/core/Grid";
import {TagsGroup} from "../../forms/TagsGroup";
import {AudioFileDropGrid} from "../AudioFileDropGrid";
import {FileUploadDropBox} from "../../forms/FileUploadDropBox";
import Icon from "@material-ui/core/Icon";
import {AudioExampleModel, AudioExampleSettingsModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlType} from "../../../shared/models/EnumsAndTypes";
import {useMatStyles} from "../../../shared/SharedStyles";
import {RemovableSurveyControl} from "../../forms/RemovableSurveyControl";

export const AcrTestItemExampleCard = observer((props: React.PropsWithChildren<{
  example: AudioExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}>) => {
  const {example, title, action, collapsed} = props;
  const classes = useMatStyles();
  // Set all field require to false if it is true
  useEffect(() => {
    example.fields?.forEach(value => {
      if (value?.required) delete value.required;
    });
  }, []);
  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => {
    example.medias.push(newAudio);
    example.fields.push({type: SurveyControlType.description, question: 'Compare the quality of these sounds.', value: null});
  }
  // Setting submitted
  const handleSettingChange = (settings: AudioExampleSettingsModel) => example.settings = settings;
  const handleDuplicate = () => handleAdd(JSON.parse(JSON.stringify(example.medias[0])));
  const handleQuestionRemove = (index: number) => {
    example.fields.splice(index, 1);
    example.medias.splice(index, 1);
  }

  return <Card style={{borderTop: '3px solid dodgerblue'}}>
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
          {!example.fields || example.fields.length < 1 ? <Grid item xs={12}>
            <Typography variant="body1">Upload audio files to start!</Typography>
          </Grid> : example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <RemovableSurveyControl question={q} onRemove={() => handleQuestionRemove(qi)} hideRequire compactStyle/>
          </Grid>)}

          <AudioFileDropGrid example={example} reference hidDeleteButton allSame/>
          {/*Placeholder for adding to list*/}
          {example.medias.length < 1 ? <Grid item xs={12} md={4}>
            <FileUploadDropBox onChange={handleAdd} fileType="audio">
              <Typography>Drop or click to add a file</Typography>
              <Icon>attachment</Icon>
            </FileUploadDropBox>
          </Grid> : <Grid item xs={12} className={classes.flexEnd}>
            <Button color="primary" onClick={handleDuplicate}><Icon>add</Icon>Add internal question</Button>
          </Grid>}

        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
});
