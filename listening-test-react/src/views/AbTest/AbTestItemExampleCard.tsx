import {ItemExampleModel, ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, FormControlLabel, Switch} from "@material-ui/core";
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
  onDelete: () => void,
  title: React.ReactNode
}>) => {
  const {example, onDelete, title} = props;

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
    <CardHeader style={{paddingBottom: 0}} title={title} action={
      <span>
        <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
        <ExampleSettingsDialog settings={example.settings}
                               onConfirm={(settings: ItemExampleSettingsModel) => example.settings = settings}/>
      </span>
    }/>
    <CardContent>
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
  </Card>;
})
