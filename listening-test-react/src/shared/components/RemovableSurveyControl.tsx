import {observer} from "mobx-react";
import {FormControlLabel, Switch, Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "./SurveyControl";
import React from "react";
import {SurveyControlModel} from "../models/SurveyControlModel";
import {useMatStyles} from "../../views/SharedStyles";

export const RemovableSurveyControl = observer(function ({question, onRemove, hideRemoveButton}: {
  question: SurveyControlModel, onRemove: () => void, hideRemoveButton?: boolean
}) {
  const classes = useMatStyles();

  return <>
    <div className={classes.flexEnd}>
      <FormControlLabel label="Required" control={
        <Switch checked={question.required}
                onChange={e => question.required = e.target.checked}/>}
      />
      {!hideRemoveButton && <Tooltip title="Remove this question">
        <IconButton onClick={onRemove}><Icon>clear</Icon></IconButton>
      </Tooltip>}
    </div>
    <SurveyControl control={question}/>
  </>
})
