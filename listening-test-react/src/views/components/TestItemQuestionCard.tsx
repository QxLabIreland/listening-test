import React, {CSSProperties} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {SurveyControlType} from "../../shared/models/EnumsAndTypes";
import {CardContent, FormControlLabel, Switch} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "../../shared/components/SurveyControl";
import Card from "@material-ui/core/Card";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {observer} from "mobx-react";

export const labelInputStyle = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  outline: 'none',
  border: 'none',
  width: '100%'
} as CSSProperties;

export const TestItemQuestionCard = observer(function ({value, onDelete}: { value: TestItemModel, onDelete: () => void }) {

  return <Card>
    <CardHeader style={{paddingBottom: 0}} action={<>
      {value.questionControl.type !== SurveyControlType.description && <FormControlLabel label="Required" control={
        <Switch checked={value.questionControl.required}
                onChange={e => value.questionControl.required = e.target.checked}/>}
      />}
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    </>} title={<input style={labelInputStyle} value={value.title} onChange={e => value.title = e.target.value}
                       onFocus={event => event.target.select()}/>}>
    </CardHeader>
    <CardContent>
      <SurveyControl control={value.questionControl}/>
    </CardContent>
  </Card>
})

