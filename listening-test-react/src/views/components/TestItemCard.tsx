import {observer} from "mobx-react";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import React, {ReactNode} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse, createStyles, FormControlLabel, Switch, Theme, Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {labelInputStyle} from "../SharedStyles";
import {makeStyles} from "@material-ui/core/styles";
import {GotoQuestionItemModel} from "../../shared/models/SurveyControlModel";
import {TestItemExampleCardType} from "./TypesAndItemOverrides";
import {BasicTaskItemModel} from "../../shared/models/BasicTaskModel";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) => {
  const trans = theme.transitions.create('all', {duration: theme.transitions.duration.shortest});
  return createStyles({
    expand: {transform: 'rotate(0deg)', transition: trans},
    expandOpen: {transform: 'rotate(180deg)', transition: trans},
    innerQuestionContainer: {display: 'flex', justifyContent: 'flex-end'}
  });
});
/** To render item into different card based on type */
export const TestItemCard = observer(function (props: {
  value: BasicTaskItemModel, onDelete: () => void, TestItemExampleCard: TestItemExampleCardType,
  gotoQuestionItems?: GotoQuestionItemModel[], disableGoto?: boolean, TestItemTrainingCard: TestItemExampleCardType,
  onCopy: (_: BasicTaskItemModel) => void
}) {
  const {value, TestItemExampleCard, TestItemTrainingCard} = props;
  // Label methods
  const handleLabelChange = (event: any) => {
    value.title = event.target.value;
  }

  const labelInput = <input style={labelInputStyle} onFocus={event => event.target.select()}
                            value={value.title} onChange={handleLabelChange}/>;
  // Switch to correct card
  const ExampleCard: TestItemExampleCardType = value.type === TestItemType.example ? TestItemExampleCard : TestItemTrainingCard;
  if (value.type === TestItemType.example || value.type === TestItemType.training) return <ExampleCard
    title={labelInput} example={value.example} collapsed={value.collapsed} action={<HeaderIconButtons {...props}/>}
  />
  else if (value.type === TestItemType.question) return <TestItemQuestionCard
    {...props} action={<HeaderIconButtons {...props}/>} collapsed={value.collapsed}
  />
  else return <Typography style={{display: 'flex'}} variant="h4">{labelInput}<SectionHeaderSettings/></Typography>;
})
// Buttons group for common operations
const HeaderIconButtons = observer(function ({onDelete, value, onCopy}: { value: BasicTaskItemModel, onDelete: () => void, onCopy: (_: BasicTaskItemModel) => void }) {
  const classes = useStyles();
  return <>
    <Tooltip title={`${value.collapsed ? 'Expand' : 'Collapse'} Question`}>
      <IconButton className={value.collapsed ? classes.expand : classes.expandOpen}
                  onClick={() => value.collapsed = !value.collapsed}>
        <Icon>{value.collapsed ? 'unfold_more' : 'unfold_less'}</Icon>
      </IconButton>
    </Tooltip>
    <Tooltip title="Copy This Question">
      <IconButton onClick={() => onCopy(value)}><Icon>content_copy</Icon></IconButton>
    </Tooltip>
    <Tooltip title="Delete Question">
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    </Tooltip>
  </>
})
/** Question Card for survey questions*/
const TestItemQuestionCard = observer(function ({value, action, collapsed, gotoQuestionItems, disableGoto}: {
  value: BasicTaskItemModel, action: ReactNode, collapsed?: boolean,
  gotoQuestionItems?: GotoQuestionItemModel[], disableGoto?: boolean
}) {
  // If the index is at end of list, the goto feature will be delete
  const gotoQuestionItemsFiltered = gotoQuestionItems.findIndex(cur => cur.id === value.id) >= gotoQuestionItems.length - 1
    ? undefined : gotoQuestionItems.filter(cur => cur.id !== value.id);
  return <Card>
    <CardHeader title={<input style={labelInputStyle} value={value.title} onChange={e => value.title = e.target.value}
                              onFocus={event => event.target.select()}/>} action={<>
      {value.questionControl.type !== SurveyControlType.description && <FormControlLabel label="Required" control={
        <Switch checked={value.questionControl.required}
                onChange={e => value.questionControl.required = e.target.checked}/>
      }/>} {action}
    </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <SurveyControl control={value.questionControl} disableGoto={disableGoto}
          // Filter current item out of list
                       gotoQuestionItems={gotoQuestionItemsFiltered}/>
      </CardContent>
    </Collapse>
  </Card>
});

const SectionHeaderSettings = observer(function () {
  return <Tooltip title="Section settings">
    <IconButton><Icon>settings</Icon></IconButton>
  </Tooltip>
});
