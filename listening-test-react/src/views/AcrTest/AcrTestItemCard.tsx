import {TestItemModel} from "../../shared/models/BasicTestModel";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {TestItemType} from "../../shared/ReactEnums";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent} from "@material-ui/core";
import {SurveyControl} from "../../shared/components/SurveyControl";
import React, {CSSProperties} from "react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import TagsGroup from "../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import ExampleSettingsDialog from "../components/ExampleSettingsDialog";

const labelInputStyle = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  outline: 'none',
  border: 'none',
  width: '100%'
} as CSSProperties;

export default function AcrTestItemCard(props: {
  item: TestItemModel,
  onDelete: () => void,
  onChange: (item: TestItemModel) => void
}) {
  const {item, onDelete, onChange} = props;

  const handleExampleChange = (example: ItemExampleModel) => {
    onChange({...item, example: example});
  }

  const handleQuestionChange = (question: SurveyControlModel) => {
    onChange({...item, questionControl: question});
  }

  // Label methods
  const handleLabelChange = (event) => {
    onChange({...item, label: event.target.value});
  }

  if (item.type === TestItemType.example || item.type === TestItemType.training) return (
    <TestItemExampleCard example={item.example} onChange={handleExampleChange} title={
      <input style={labelInputStyle} value={item.label} onChange={handleLabelChange}
             onFocus={event => event.target.select()}/>
    } delButton={
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    } tags={item.type === TestItemType.example}/>
  );

  else if (item.type === TestItemType.question) return <Card>
    <CardHeader style={{paddingBottom: 0}} action={
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    } subheader="Question Card">
    </CardHeader>
    <CardContent>
      <SurveyControl control={item.questionControl} label={'Your question'} onChange={handleQuestionChange}/>
    </CardContent>
  </Card>;
  else return null;
}

function TestItemExampleCard(props: React.PropsWithChildren<{
  example: ItemExampleModel,
  onChange: (example: ItemExampleModel) => void,
  delButton: React.ReactNode,
  title: React.ReactNode,
  tags?: boolean
}>) {
  const {example, onChange, delButton, title, tags = true} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel, isReference: boolean = false) => {
    // If is Reference the audioRef will be added
    if (isReference) onChange({...example, audioRef: newAudio});
    else onChange({...example, audios: [...example.audios, newAudio]});
  }

  const handleDelete = (index: number) => {
    if (index === -1) onChange({...example, audioRef: undefined});
    else {
      example.audios.splice(index, 1);
      onChange({...example});
    }
  }

  const handleChange = (newAudio: AudioFileModel, index: number) => {
    if (index === -1) onChange({...example, audioRef: newAudio});
    else {
      example.audios[index] = newAudio;
      onChange({...example});
    }
  }

  // Question for example
  const handleQuestionChange = (question: SurveyControlModel, index: number) => {
    example.fields[index] = question;
    onChange({...example});
  }

  // Setting submitted
  const handleSettingChange = (settings) => onChange({...example, settings});

  return <Card>
    <CardHeader style={{paddingBottom: 0}} title={title} action={<span>{delButton}
                <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/></span>}/>
    <CardContent>
      <Grid container spacing={2}>
        {tags && <Grid item xs={12}>
          <TagsGroup tags={example.tags}
                     onChange={newTags => onChange({...example, tags: newTags})}/>
        </Grid>}
        {/*Reference*/}
        <Grid item xs={12} md={4}>
          <FileDropZone fileModel={example.audioRef} onChange={fm => handleAdd(fm, true)}
                        label="Reference"/>
        </Grid>
        {example.audios.map((a, i) => <Grid item xs={12} md={4} key={i}>
          <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)}/>
        </Grid>)}
        {/*Placeholder for adding to list*/}
        <Grid item xs={12} md={4}>
          <FileDropZone onChange={handleAdd} label="Drop or click to add a file"/>
        </Grid>
        {/*Questions for this example*/}
        {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
          <SurveyControl control={q} label={'Your question ' + (qi + 1)}
                         onChange={control => handleQuestionChange(control, qi)}/>
        </Grid>)}
      </Grid>
    </CardContent>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
}
