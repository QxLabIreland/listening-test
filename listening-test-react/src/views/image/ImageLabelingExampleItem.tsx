import {observer} from "mobx-react";
import React from "react";
import {TestItemExampleCardProps} from "../components/TypesAndItemOverrides";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {TagsGroup} from "../../shared/components/TagsGroup";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {TestItemCardFileDropGrid} from "../components/TestItemCardFileDropGrid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {ImageFileModel} from "../../shared/models/ImageTaskModel";

export const ImageLabelingExampleItem = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, title, action, collapsed} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: ImageFileModel) => example.medias.push(newAudio);

  return <Card>
    <CardHeader title={title} action={action}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
          </Grid>
          {/*Description for this example*/}
          {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <SurveyControl control={q}/>
          </Grid>)}

          <TestItemCardFileDropGrid example={example} reference/>

          {/*Placeholder for adding to list*/}
          <Grid item xs={12} md={4}>
            <FileDropZone onChange={handleAdd} label="Drop or click to add a file"/>
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
})
