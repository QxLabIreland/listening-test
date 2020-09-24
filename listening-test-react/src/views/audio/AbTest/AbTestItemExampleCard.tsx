import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, CardContent, Collapse, FormControlLabel, Icon, IconButton, Switch} from "@material-ui/core";
import {SurveyControl} from "../../../shared/components/SurveyControl";
import React from "react";
import {TagsGroup} from "../../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import AudioExampleSettingsDialog from "../AudioExampleSettingsDialog";
import {observer} from "mobx-react";
import {SurveyControlType} from "../../../shared/models/EnumsAndTypes";
import {TestItemExampleCardProps} from "../../components/TypesAndItemOverrides";
import {TestItemCardFileDropGrid} from "../../components/TestItemCardFileDropGrid";

export const AbTestItemExampleCard = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, action, title, collapsed} = props;
  // Methods for audios changed
  const handleDeletedQuestionAdd = () => example.fields.push({
    type: SurveyControlType.text, question: 'Briefly comment on your choice.', value: null, required: false
  });
  const SettingsDialog = () =>
    <AudioExampleSettingsDialog settings={example.settings} onConfirm={settings => example.settings = settings}/>

  return <Card>
    <CardHeader title={title} action={<>
      <SettingsDialog/>
      {action} </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
          </Grid>

          <TestItemCardFileDropGrid example={example} reference keepPlace/>
          {/*Special survey questions for ab test*/}
          {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <div style={{textAlign: 'right'}}>
              <FormControlLabel label="Required" control={
                <Switch checked={q.required} onChange={e => q.required = e.target.checked}/>}
              />
              {qi === 1 && <IconButton onClick={() => example.fields.splice(qi, 1)}>
                <Icon>clear</Icon>
              </IconButton>}
            </div>
            <SurveyControl control={q}/>
          </Grid>)}
          {/*An ability to delete one of special question*/}
          {example.fields?.length < 2 && <Grid item xs={12} style={{textAlign: 'right'}}>
            <Button color="primary" onClick={handleDeletedQuestionAdd}><Icon>add</Icon> Add an additional question</Button>
          </Grid>}
        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
})
