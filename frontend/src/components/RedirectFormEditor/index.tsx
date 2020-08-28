import React, {FC, useEffect, useState} from "react";
import {IAppState} from "../../models/IAppState";
import {connect, ConnectedProps} from "react-redux";
import {saveAndGetQuestionnaireRoutine} from "../../sagas/qustionnaires/routines";
import {history} from "../../helpers/history.helper";
import {toastr} from 'react-redux-toastr';
import moment from "moment";
import {Modal, Button, Icon, Input} from "semantic-ui-react";

const RedirectFormEditor: FC<Props> = ({current, saveAndGet}) => {
    const [title, setTitle] = useState<string>();
    const [open, setOpen] = useState<boolean>(!current.id);

    function handleCancel() {
        history.goBack();
        setOpen(false);
    }

    function handleSubmit() {
        saveAndGet({title: title ?? `New Form created ${moment().calendar()}`});
        setOpen(false);
        toastr.success("Form created");
    }

    useEffect(() => {
        current.id && history.push(`/questionnaires/${current.id}`);
    }, [current]);

    return (
    <Modal
        open={open}
        onClose={handleCancel}
        style={{textAlign: "center"}}
    >
        <Modal.Content>
            <Modal.Description as="h3">
                Looks like you don't have currently edited form, create new!
            </Modal.Description>
            <Input
                icon='hashtag'
                iconPosition='left'
                label={{ tag: true, content: 'Add Title' }}
                labelPosition='right'
                value={title}
                fluid
                placeholder={`New Form created ${moment().calendar()}`}
                onChange={e => setTitle(e.target.value)}
            />
        </Modal.Content>
        <Modal.Actions>
            <Button primary onClick={handleSubmit}>
                Create <Icon name='chevron right' />
            </Button>
        </Modal.Actions>
    </Modal>
    );
};

const mapState = (state: IAppState) => ({
    current: state.questionnaires.current.get
});

const mapDispatch = {
    saveAndGet: saveAndGetQuestionnaireRoutine
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

export default connector(RedirectFormEditor);
