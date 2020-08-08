import {Prompt, useHistory, useLocation, useParams} from "react-router";
import React, {
  FunctionComponent,
  FunctionComponentElement,
  MouseEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {GlobalDialog, GlobalSnackbar} from "../../shared/ReactContexts";
import {useScrollToView} from "../../shared/ReactHooks";
import Axios from "axios";
import Grid, {GridTypeMap} from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Icon, TextField} from "@material-ui/core";
import Loading from "../../layouts/components/Loading";
import {TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import {BasicTestModel, TestItemModel} from "../../shared/models/BasicTestModel";
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import TestSettingsDialog from ".//TestSettingsDialog";
import {DraggableZone} from "../../shared/components/DraggableZone";
import {testItemsValidateError} from "../../shared/ErrorValidators";
import {TestItemCard} from "../components/TestItemCard";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {DefaultComponentProps} from "@material-ui/core/OverridableComponent";

export const TestDetailView = observer(function ({testUrl, TestItemExampleCard, ButtonGroup}: {
  testUrl: TestUrl,
  TestItemExampleCard: FunctionComponent<{ example: ItemExampleModel, title: React.ReactNode, action: React.ReactNode, expanded?: boolean }>,
  ButtonGroup: FunctionComponent<{ onAdd: (type: TestItemModel) => void }>
}) {
  const {id} = useParams();
  const [tests, setTests] = useState<BasicTestModel>(null);
  const [isError, setIsError] = useState(false);
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const openSnackbar = useContext(GlobalSnackbar);
  // Scroll properties
  const viewRef = useRef(null);
  const {scrollToView} = useScrollToView(viewRef);
  // No submit alert variable
  const [isSubmitted, setIsSubmitted] = useState<boolean>(null);
  const location = useLocation();
  // Request for server methods
  useEffect(() => {
    // If it is edit page, get data from back end
    if (location.state || +id !== 0) Axios.get<BasicTestModel>('/api/' + testUrl, {params: {_id: location.state || id}})
      .then((res) => {
        if (location.state) templateProcess(res.data);
        setTests(observable(res.data));
      }, () => setIsError(true));
    // If in creation page
    else setTests(observable({name: '', description: '', items: []}));
  }, [id, testUrl]);

  const handleSubmit = () => {
    // Validate if all examples have been added audios
    const validationResult = testItemsValidateError(tests);
    if (validationResult) {
      openDialog(validationResult);
      return;
    }
    // Create a new text or modify current test
    if (+id === 0) requestServer(true);
    else Axios.get('/api/response-count', {params: {testId: id, testType: testUrl}}).then(res => {
      // After checking with server, if there are responses, it will create a new test.
      if (res.data > 0) openDialog(
        'This test already has some responses, save will create a new test. You can delete old one if you like.',
        'Reminder', null, () => requestServer(true));
      else requestServer(false);
    });
  }
  const requestServer = (isNew: boolean) => {
    setIsSubmitted(true);
    // Request server based on is New or not.
    Axios.request({
      method: isNew ? 'POST' : 'PUT', url: '/api/' + testUrl, data: tests
    }).then(() => {
      history.push('./');
      openSnackbar('Save successfully');
    }, reason => openDialog(reason.response.data, 'Something wrong'));
  }
  // Local methods
  const addItem = (newItem: TestItemModel) => {
    tests.items.push(newItem);
    scrollToView();
  }
  const deleteItem = (index: number) => tests.items.splice(index, 1);
  const handleReorder = (index: number, newIndex: number) => {
    // Insert and delete original
    const value = tests.items.splice(index, 1);
    tests.items.splice(newIndex, 0, ...value);
  }

  // Some components for performance boost
  const NameText = () => <TextField variant="outlined" label="Test Name" fullWidth defaultValue={tests.name}
                                    onChange={e => tests.name = e.target.value}/>;
  const DesText = () => <TextField variant="outlined" label="Test Description" rowsMax={8} multiline fullWidth
                                   defaultValue={tests.description}
                                   onChange={(e) => tests.description = e.target.value}/>;
  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Prompt when={!isSubmitted} message={'You have unsaved changes, are you sure you want to leave?'}/>
      {tests ? <React.Fragment>
        <Grid item xs={12} container alignItems="center" spacing={1}>
          <Grid item style={{flexGrow: 1}}/>
          <Grid item><TestSettingsDialog settings={tests.settings}
                                         onConfirm={settings => tests.settings = settings}/></Grid>
          <Grid item><Button color="primary" variant="contained" onClick={handleSubmit}>Save</Button></Grid>
        </Grid>

        <Grid item xs={12}><NameText/></Grid>
        <Grid item xs={12}><DesText/></Grid>
        {/*{tests.items.map((v, i) =>
          <Grid item xs={12} ref={viewRef} key={v.id}>
            <DraggableZone index={i} length={tests.items.length} onReorder={handleReorder}>
              <TestItemCard value={v} onDelete={() => deleteItem(i)} TestItemExampleCard={TestItemExampleCard}/>
            </DraggableZone>
          </Grid>
        )}*/}
        <TestItemCardList items={tests.items} TestItemExampleCard={TestItemExampleCard}/>
        <Grid item container justify="center" xs={12}>
          <ButtonGroup onAdd={addItem}/>
        </Grid>

        <Grid item xs={12} container alignItems="center" spacing={1}>
          <Grid item style={{flexGrow: 1}}/>
          <Grid item><TestSettingsDialog settings={tests.settings}
                                         onConfirm={settings => tests.settings = settings}/></Grid>
          <Grid item><Button color="primary" variant="contained" onClick={handleSubmit}>Save</Button></Grid>
        </Grid>
      </React.Fragment> : <Grid item><Loading error={isError}/></Grid>}
    </Grid>
  )
})

function templateProcess(tem: BasicTestModel) {
  // Prevent it from becoming a template and some process
  tem.isTemplate = false;
  tem.name = 'Name of template ' + tem.name;
  tem.items.forEach(item => {
    // Remove the links of audios and audioRef
    if (item.type === TestItemType.example || item.type === TestItemType.training) {
      item.example.audios.forEach((_, index) => item.example.audios[index] = null);
      item.example.audioRef = null;
    }
  });
}

const TestItemCardList = observer(function ({items, TestItemExampleCard}: { items: TestItemModel[], TestItemExampleCard: FunctionComponent<{ example: ItemExampleModel, title: React.ReactNode, action: React.ReactNode, expanded?: boolean }> }) {
  const [draggingEle, setDraggingEle] = useState<React.FunctionComponentElement<DefaultComponentProps<GridTypeMap>>>();
  const [params] = useState(observable({start: null, shiftY: null, index: null}));
  useEffect(() => {
    if (!draggingEle) return;
    const onMouseMove = (event: any) => {
      // Dragging element to move
      // ref.current.style.left = event.pageX - shiftX + 'px';
      (draggingEle.ref as RefObject<HTMLDivElement>).current.style.top = event.pageY - params.shiftY + 'px';
      const end = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
      // When element position is relative
      // draggingRef.style.top = end - start + 'px';

      // Give a threshold for movement, and if dragging element is out of list
      if (end - params.start >= 80 && params.index < items.length - 1) {
        reorder(params.index, params.index + 1);
        params.start = end;
      } else if (end - params.start <= -80 && params.index > 0) {
        reorder(params.index, params.index - 1);
        params.start = end;
      }
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setDraggingEle(null);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [draggingEle]);

  const deleteItem = (index: number) => items.splice(index, 1);
  const handleMouseDown = (event: MouseEvent<any>, index: number) => {
    // Get index of the element
    params.index = index;
    console.log(params.index);
    const currentRef = (list[params.index].ref as RefObject<HTMLDivElement>).current;
    const shiftX = event.clientX - currentRef.getBoundingClientRect().left;
    const shiftY = event.clientY - currentRef.getBoundingClientRect().top;

    setDraggingEle(React.cloneElement(list[params.index], {
      ref: React.createRef<HTMLDivElement>(),
      style: {
        position: 'absolute',
        width: currentRef.clientWidth,
        height: currentRef.clientHeight,
        left: event.pageX - shiftX,
        top: event.pageY - shiftY,
        zIndex: 1000
      }
    }));
    params.start = event.pageY ? event.pageY : event.clientY ? event.clientY : 0
    params.shiftY = shiftY
  }

  const reorder = action((previousIndex: number, newIndex: number) => {
    params.index = newIndex;
    // Reorder the list
    items.splice(newIndex, 0, ...items.splice(previousIndex, 1));
  })
  const list = items.map((v, i) => React.createElement(Grid, {
      item: true, xs: 12, key: v.id, ref: React.createRef<HTMLDivElement>(),
      style: {position: 'relative', visibility: params.index === i && draggingEle ? 'hidden' : 'visible'}
    }, <div style={{
      position: 'absolute', display: v.collapsed ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center',
      height: '100%', width: 0, right: 8
    }}><Icon style={{width: 12, cursor: 'grab'}} onMouseDown={e => handleMouseDown(e, i)}>reorder</Icon></div>,
    <TestItemCard value={v} onDelete={() => deleteItem(i)} TestItemExampleCard={TestItemExampleCard}/>
  ));

  return <>{list}{draggingEle}</>
})
