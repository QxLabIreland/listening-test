import {observer} from "mobx-react";
import React from "react";
import {TestItemExampleCardProps} from "../components/TypesAndItemOverrides";
import {AudioExampleSettingsModel, AudioFileModel} from "../../shared/models/AudioTestModel";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import AudioExampleSettingsDialog from "./AudioExampleSettingsDialog";
import {CardContent, Collapse} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {TestItemCardFileDropGrid} from "../components/TestItemCardFileDropGrid";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {RemovableSurveyControl} from "../../shared/components/RemovableSurveyControl";
import {useMatStyles} from "../SharedStyles";
import {AddQuestionButton} from "../../shared/components/AddQuestionButton";

/** Training Test Item: Audios will play synchronously*/
export const AudioTestItemTrainingCard = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, title, action, collapsed} = props;
  const classes = useMatStyles();
  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.medias.push(newAudio);
  // Setting submitted
  const handleSettingChange = (settings: AudioExampleSettingsModel) => example.settings = settings;
  const addAdditionalQuestion = (question: SurveyControlModel) => example.fields.push(question);
  const deleteAdditionalQuestion = () => example.fields.pop();

  return <Card>
    <CardHeader title={title} action={<>
      <AudioExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      {action}
    </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          {/*Description for this example*/}
          {example.fields && example.fields[0] && <Grid item xs={12}>
            <SurveyControl control={example.fields[0]}/>
          </Grid>}
          <TestItemCardFileDropGrid example={example}/>
          {/*Placeholder for adding to list*/}
          <Grid item xs={12} md={4}>
            <FileDropZone onChange={handleAdd} label="Drop or click to add a file"/>
          </Grid>
          {/*Additional question add*/}
          {example.fields && !(example.fields.length > 1) ? <Grid item xs={12} className={classes.flexEnd}>
            <AddQuestionButton onQuestionAdd={addAdditionalQuestion} onlyCore/>
          </Grid> : <Grid item xs={12}>
            <RemovableSurveyControl question={example.fields[1]} onRemove={deleteAdditionalQuestion}/>
          </Grid>}
        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
})
