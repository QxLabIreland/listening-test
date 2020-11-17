import {observer} from "mobx-react";
import {SurveyControlType, TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import React, {ChangeEvent, ReactNode, useContext} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {
  CardContent,
  Checkbox,
  Collapse,
  createStyles,
  FormControlLabel,
  FormGroup,
  Switch,
  Theme,
  Tooltip
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {labelInputStyle} from "../SharedStyles";
import {makeStyles} from "@material-ui/core/styles";
import {overrideExampleItem, overrideTrainingItem, TestItemExampleCardType} from "./ComponentsOverrider";
import {BasicTaskItemModel} from "../../shared/models/BasicTaskModel";
import Typography from "@material-ui/core/Typography";
import {DetailTaskModel} from "../../shared/ReactContexts";

const useStyles = makeStyles((theme: Theme) => {
  const trans = theme.transitions.create('all', {duration: theme.transitions.duration.shortest});
  return createStyles({
    expand: {transform: 'rotate(0deg)', transition: trans},
    expandOpen: {transform: 'rotate(180deg)', transition: trans},
    innerQuestionContainer: {display: 'flex', justifyContent: 'flex-end'}
  });
});
/** To display item in different card based on type */
export const TestItemCard = observer(function (props: {
  item: BasicTaskItemModel, testUrl: TestUrl, onDelete: () => void, onCopy: (_: BasicTaskItemModel) => void
}) {
  const {item, testUrl} = props;

  // Switch to correct card
  const ExampleCard: TestItemExampleCardType = item.type === TestItemType.example ? overrideExampleItem(testUrl) : overrideTrainingItem(testUrl);
  if (item.type === TestItemType.example || item.type === TestItemType.training) return <ExampleCard
    title={<TitleInput item={item}/>} example={item.example} collapsed={item.collapsed}
    action={<HeaderIconButtons {...props}/>}
  />
  else if (item.type === TestItemType.question) return <TestItemQuestionCard
    {...props} action={<HeaderIconButtons {...props}/>} collapsed={item.collapsed}
  />
  else return <SectionHeaderSettings {...props}/>;
});

/** This an input that can be edited with transparent background */
const TitleInput = observer(function ({item}: {item: BasicTaskItemModel}) {
  const handleLabelChange = (event: any) => item.title = event.target.value;

  return <input style={labelInputStyle} onFocus={event => event.target.select()}
                value={item.title} onChange={handleLabelChange}/>
});

// Buttons group for common operations
const HeaderIconButtons = observer(function ({onDelete, item, onCopy}: { item: BasicTaskItemModel, onDelete: () => void, onCopy: (_: BasicTaskItemModel) => void }) {
  const classes = useStyles();
  return <>
    <Tooltip title={`${item.collapsed ? 'Expand' : 'Collapse'} Question`}>
      <IconButton className={item.collapsed ? classes.expand : classes.expandOpen}
                  onClick={() => item.collapsed = !item.collapsed}>
        <Icon>{item.collapsed ? 'unfold_more' : 'unfold_less'}</Icon>
      </IconButton>
    </Tooltip>
    <Tooltip title="Copy This Question">
      <IconButton onClick={() => onCopy(item)}><Icon>content_copy</Icon></IconButton>
    </Tooltip>
    <Tooltip title="Delete Question">
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    </Tooltip>
  </>
})
/** Question Card for survey questions*/
const TestItemQuestionCard = observer(function ({item, action, collapsed}: {
  item: BasicTaskItemModel, action: ReactNode, collapsed?: boolean, disableGoto?: boolean
}) {
  const taskModel = useContext(DetailTaskModel);
  // Find the index of current item
  const curIndex = taskModel.items.findIndex(value => value.id === item.id);
  // If the index is at end of list, the goto feature will be delete
  const gotoQuestionItems = curIndex >= taskModel.items.length - 1 ? undefined :
    taskModel.items.slice(curIndex + 2).map(item => ({id: item.id, title: item.title}));

  return <Card>
    <CardHeader title={<input style={labelInputStyle} value={item.title} onChange={e => item.title = e.target.value}
                              onFocus={event => event.target.select()}/>} action={<>
      {item.questionControl.type !== SurveyControlType.description && <FormControlLabel label="Required" control={
        <Switch checked={item.questionControl.required}
                onChange={e => item.questionControl.required = e.target.checked}/>
      }/>} {action}
    </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <SurveyControl control={item.questionControl} disableGoto={!taskModel.settings?.isIndividual}
          // Filter current item out of list
                       gotoQuestionItems={gotoQuestionItems}/>
      </CardContent>
    </Collapse>
  </Card>
});

const sectionUseStyles = makeStyles((_theme) => ({
  header: {display: 'flex', marginRight: 8}
}));

/** Section header to group questions together */
const SectionHeaderSettings = observer(function (props: { item: BasicTaskItemModel, onDelete: () => void, onCopy: (_: BasicTaskItemModel) => void}) {
  const {item} = props;
  const classes = sectionUseStyles();

  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (!item.sectionSettings) item.sectionSettings = {};
    item.sectionSettings.randomQuestions = checked;
  }

  return <div>
    <Typography variant="h4" className={classes.header}>
      <TitleInput item={item}/>
      <HeaderIconButtons {...props}/>
    </Typography>
    <Collapse in={!item.collapsed} timeout="auto" unmountOnExit>
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={item.sectionSettings?.randomQuestions} onChange={handleChange}/>}
        label="Randomize question for this section"
      />
    </FormGroup>
  </Collapse>
  </div>
});
