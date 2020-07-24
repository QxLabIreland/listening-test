import {observer} from "mobx-react";
import React, {useRef} from "react";
import {CardContent, Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {useScrollToView} from "../../shared/ReactHooks";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {AddQuestionButton} from "../../shared/components/AddQuestionButton";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";

export const SurveySetUpView = observer(function (props: {items: SurveyControlModel[]}) {
  // Create an array for survey
  const {items} = props;
  const viewRef = useRef(null);
  const {scrollToView} = useScrollToView(viewRef);

  const handleQuestionAdd = question => {
    scrollToView();
    items.push(question);
  }

  const handleDelete = (control) => items.splice(items.indexOf(control), 1)

  return <Card>
    <CardHeader title="Create a survey before the test"/>
    <CardContent>
      <Grid container spacing={2}>
        {items.map((c, i) =>
          <Grid item xs={12} key={i} ref={viewRef} style={{scrollMarginTop: 100}}>
            <SurveyControl control={c} label={'Your question ' + (i+1)} onDelete={handleDelete}/>
          </Grid>
        )}
        <Grid item container justify="center" xs={12}>
          <Grid item>
            <AddQuestionButton onQuestionAdd={handleQuestionAdd}/>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
});
