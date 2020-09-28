import {observer} from "mobx-react";
import React from "react";
import {TestItemExampleCardProps} from "../components/TypesAndItemOverrides";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {TagsGroup} from "../../shared/components/TagsGroup";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {TestItemDropGridList} from "../components/TestItemDropGridList";
import {AddQuestionButton} from "../../shared/components/AddQuestionButton";
import {RemovableSurveyControl} from "../../shared/components/RemovableSurveyControl";
import {useMatStyles} from "../SharedStyles";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";

export const ImageLabelingExampleItem = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, title, action, collapsed} = props;
  const classes = useMatStyles();

  const addAdditionalQuestion = (question: SurveyControlModel) => example.fields.push(question);
  const deleteAdditionalQuestion = () => example.fields.pop();

  return <Card>
    <CardHeader title={title} action={action}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
          </Grid>
          {/*Description for this example*/}
          {example.fields && example.fields[0] && <Grid item xs={12}>
            <SurveyControl control={example.fields[0]}/>
          </Grid>}
          {/*Question fields*/}
          {example.fields && !(example.fields.length > 1) ? <Grid item xs={12} className={classes.flexEnd}>
            <AddQuestionButton onQuestionAdd={addAdditionalQuestion} onlyCore/>
          </Grid> : <Grid item xs={12}>
            <RemovableSurveyControl question={example.fields[1]} onRemove={deleteAdditionalQuestion}/>
          </Grid>}
          {/*File drop grid with type*/}
          <Grid item xs={12}>
            <TestItemDropGridList example={example}/>
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
})
