import {observer} from "mobx-react";
import {FormControlLabel, Switch, Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "./SurveyControl";
import React from "react";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {useMatStyles} from "../../shared/SharedStyles";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  controlGroup: {alignItems: 'start'},
  controlWrapper: {width: '100%'}
}))

export const RemovableSurveyControl = observer(function ({question, onRemove, hideRemoveButton, hideRequire, compactStyle}: {
  question: SurveyControlModel, onRemove: () => void, hideRemoveButton?: boolean, hideRequire?: boolean, compactStyle?: boolean
}) {
  const classes = {...useMatStyles(), ...useStyles()};

  const requireSwitch = !hideRequire && <FormControlLabel label="Required" control={
    <Switch checked={question.required}
            onChange={e => question.required = e.target.checked}/>}
  />
  const deleteButton = !hideRemoveButton && <Tooltip title="Remove this question">
    <IconButton onClick={onRemove}><Icon>clear</Icon></IconButton>
  </Tooltip>
  const surveyControl = <SurveyControl control={question}/>

  if (compactStyle) return <div className={classes.flexEnd + ' ' + classes.controlGroup}>
    <div className={classes.controlWrapper}>{surveyControl}</div>
    {requireSwitch}{deleteButton}
  </div>

  else return <>
    <div className={classes.flexEnd}>
      {requireSwitch}{deleteButton}
    </div>
    {surveyControl}
  </>
})
