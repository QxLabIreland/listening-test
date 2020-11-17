import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, CardContent, Collapse, Icon} from "@material-ui/core";
import React, {ReactNode} from "react";
import {TagsGroup} from "../../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {observer} from "mobx-react";
import {SurveyControlType} from "../../../shared/models/EnumsAndTypes";
import {RemovableSurveyControl} from "../../../shared/components/RemovableSurveyControl";
import {TestItemDropGridList} from "../../components/TestItemDropGridList";
import {useMatStyles} from "../../SharedStyles";
import {ImageExampleModel} from "../../../shared/models/ImageTaskModel";
import {ImageAbExampleSettings} from "./ImageAbExampleSettings";

export const ImageAbExampleItem = observer((props: React.PropsWithChildren<{
  example: ImageExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean, mediaType?: 'image' | 'video'
}>) => {
  const {example, action, title, collapsed, mediaType = 'image'} = props;
  const classes = useMatStyles();
  // Methods for audios changed
  const handleDeletedQuestionAdd = () => example.fields.push({
    type: SurveyControlType.text, question: 'Briefly comment on your choice.', value: null, required: false
  });

  return <Card>
    <CardHeader title={title} action={<>
      <ImageAbExampleSettings settings={example.settings} onConfirm={newSettings => example.settings = newSettings}/>
      {action}
    </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
          </Grid>
          <Grid item xs={12}>
            <TestItemDropGridList example={example} type={mediaType} disableUpload keepSlot/>
          </Grid>
          {/*Special survey questions for ab test*/}
          {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <RemovableSurveyControl question={q} hideRemoveButton={qi < 1}
                                    onRemove={() => example.fields.splice(qi, 1)}/>
          </Grid>)}
          {/*An ability to delete one of special question*/}
          {example.fields?.length < 2 && <Grid item xs={12} className={classes.flexEnd}>
            <Button color="primary" onClick={handleDeletedQuestionAdd}>
              <Icon>add</Icon> Add an additional question
            </Button>
          </Grid>}
        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
})
