import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse, FormControlLabel, Switch} from "@material-ui/core";
import {SurveyControl} from "../../shared/components/SurveyControl";
import React from "react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {TagsGroup} from "../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import ExampleSettingsDialog from "../shared-views/ExampleSettingsDialog";
import {observer} from "mobx-react";

export const AbTestItemExampleCard = observer((props: React.PropsWithChildren<{
  example: ItemExampleModel,
  title: React.ReactNode,
  action: React.ReactNode,
  collapsed?: boolean
}>) => {
  const {example, action, title, collapsed} = props;
  // Methods for audios changed
  const handleDelete = (index: number) => {
    if (index === -1) example.audioRef = undefined;
    else example.audios[index] = null;
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

  return <Card>
    <CardHeader title={title} action={<>
      <ExampleSettingsDialog settings={example.settings}
                             onConfirm={settings => example.settings = settings}/>
      {action} </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
          </Grid>

          {example.audios.map((a, i) => <Grid item xs={12} md={4} key={i}>
            <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)}/>
          </Grid>)}

          <Grid item xs={12} md={4}>
            <FileDropZone fileModel={example.audioRef} onChange={fm => handleChange(fm, -1)}
                          label="Reference (Optional)"/>
          </Grid>

          {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <div style={{textAlign: 'right'}}>
              <FormControlLabel label="Required" control={
                <Switch checked={q.required} onChange={e => q.required = e.target.checked}/>}
              />
            </div>
            <SurveyControl control={q}/>
          </Grid>)}
        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
})
