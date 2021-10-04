import {observer} from "mobx-react";
import React, {ReactNode} from "react";
import {AudioExampleModel, AudioExampleSettingsModel, AudioFileModel} from "../../shared/models/AudioTestModel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {AudioExampleSettingsDialog} from "./AudioExampleSettingsDialog";
import {CardContent, Collapse, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {AudioFileDropGrid} from "./AudioFileDropGrid";
import {SurveyControl} from "../forms/SurveyControl";
import {RemovableSurveyControl} from "../forms/RemovableSurveyControl";
import {useMatStyles} from "../../shared/SharedStyles";
import {AddQuestionButton} from "../utils/AddQuestionButton";
import Icon from "@material-ui/core/Icon";
import {FileUploadDropBox} from "../forms/FileUploadDropBox";
import {BasicTaskItemModel} from "../../shared/models/BasicTaskModel";

/** Training Test Item: Audios will play synchronously*/
export const AudioTestItemTraining = observer((props: React.PropsWithChildren<{
  example: AudioExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}>) => {
  const {example, title, action, collapsed} = props;
  const classes = useMatStyles();
  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.medias.push(newAudio);
  // Setting submitted
  const handleSettingChange = (settings: AudioExampleSettingsModel) => example.settings = settings;
  const addAdditionalQuestion = (item: BasicTaskItemModel) => example.fields.push(item.questionControl);
  const deleteAdditionalQuestion = () => example.fields.pop();

  return <Card style={{borderTop: '3px solid coral'}}>
    <CardHeader title={title} action={<>
      <AudioExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange} disableSectionLoop disableRandomAudio/>
      {action}
    </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          {/*Description for this example*/}
          {example.fields && example.fields[0] && <Grid item xs={12}>
            <SurveyControl control={example.fields[0]}/>
          </Grid>}
          <AudioFileDropGrid example={example}/>
          {/*Placeholder for adding to list*/}
          <Grid item xs={12} md={4}>
            <FileUploadDropBox onChange={handleAdd} fileType="audio">
              <Typography>Drop or click to add a file</Typography>
              <Icon>attachment</Icon>
            </FileUploadDropBox>
          </Grid>
          {/*Additional question add*/}
          {example.fields && !(example.fields.length > 1) ? <Grid item xs={12} className={classes.flexEnd}>
            <AddQuestionButton onAdd={addAdditionalQuestion} onlyCore/>
          </Grid> : <Grid item xs={12}>
            <RemovableSurveyControl question={example.fields[1]} onRemove={deleteAdditionalQuestion}/>
          </Grid>}
        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
})
