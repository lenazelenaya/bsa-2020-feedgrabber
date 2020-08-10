import React from "react";
import {History} from 'history';
import {Button, Form, Segment} from "semantic-ui-react";
import {Formik, FormikProps} from "formik";
import {multichoiceSchema} from "./schemas";
import * as Yup from 'yup';
import "./styles.sass";
import {IQuestion, QuestionType} from "../../models/IQuesion";

const questions: IQuestion[] = [
    {
        id: "1",
        categoryName: "Soft skills",
        text: "Can you tell me about a time when you successfully led a team through a sticky situation?",
        type: QuestionType.multiChoice,
        questionnaireId: "1",
        payload: {
            answerOptions: ["1", "2"]
        }
    },
    {
        id: "2",
        categoryName: "Leadership",
        text: "Are you able to delegate responsibilities efficiently?",
        questionnaireId: "1",
        type: QuestionType.freeText
    }
];

interface IQuestionProps {
    saveQuestion(question: IQuestion): void;

    match: {
        params: {
            id?: string;
        };
    };
    history: History;
}

interface IQuestionState {
    initialValues: any;
    validationSchema: any;
    question: IQuestion;
    type: QuestionType;
}

class QuestionDetails extends React.Component<IQuestionProps, IQuestionState> {
    constructor(props: IQuestionProps) {
        super(props);
        this.state = {
            validationSchema: Yup.object({}),
            initialValues: {name: "", answers: []},
            question: {
                id: "",
                text: "",
                questionnaireId: "",
                categoryName: "",
                type: undefined
            },
            type: undefined
        };
        this.onClose = this.onClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getForm = this.getForm.bind(this);
        this.setQuestionType = this.setQuestionType.bind(this);
    }

    componentDidMount() {
        const {match} = this.props;
        this.getQuestion(match.params.id);
    }

    getQuestion = async (id: string) => {
        const question = questions.find(question => question.id === id);
        if (id !== "new") {
            if (question.type === QuestionType.multiChoice
                || question.type === QuestionType.checkbox
                || question.type === QuestionType.radio) {
                this.setState({
                    ...this.state,
                    question,
                    validationSchema: multichoiceSchema,
                    initialValues: {name: question.text, answers: question.payload.answerOptions},
                    type: question.type
                });
            } else if (question.type === QuestionType.freeText
                || question.type === QuestionType.scale) {
                this.setState({
                    ...this.state,
                    question,
                    validationSchema: {},
                    initialValues: {name: question.text},
                    type: question.type
                });
            }
        }
    }

    onClose = () => {
        this.props.history.push("/questions");
    };

    onSubmit = () => {
        if (this.state.question) {
            this.props.saveQuestion(this.state.question);
            this.props.history.push("/questions");
        }
    };

    questionTypeOptions = [
        {
            key: 'Radio',
            text: 'Radio',
            value: QuestionType.radio
        }, {
            key: 'CheckBoxes',
            text: 'CheckBoxes',
            value: QuestionType.checkbox
        }, {
            key: 'Multichoice',
            text: 'Multichoice',
            value: QuestionType.multiChoice
        }, {
            key: 'TextArea',
            text: 'TextArea',
            value: QuestionType.freeText
        }, {
            key: 'Scaled',
            text: 'Scaled',
            value: QuestionType.scale
        }
    ];
    getForm = (type: QuestionType, initialValues: any, formik: FormikProps<any>) => {
        switch (type) {
            case QuestionType.radio:
                return <span>radio</span>; // <RadioButton />;
            case QuestionType.checkbox:
                return <span>checkbox</span>; // <CheckBox />;
            case QuestionType.multiChoice:
                return <span>multichoice</span>; // <MultichoiceQuestion formik={formik}/>;
            case QuestionType.scale:
                return <span>scale</span>; // <Scale />
            case QuestionType.freeText:
                return <span>freeeeeeeeee</span>; // <FreeText/>
            default:
                return <span className="question_default">Default choice</span>;
        }
    };

    setQuestionType = (data: any) => {
        const type: QuestionType = data.value;
        this.setState({
            ...this.state, type
        });
    }

    render() {
        const {initialValues, validationSchema, type, question} = this.state;
        return (
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={() => console.log('submitted')}
            >
                {
                    formik => (
                        <div className="question_container">
                            <Form className="question_form" onSubmit={formik.handleSubmit}>
                                <Segment className="question_header">
                                    <Form.Input
                                        className="question_name_input"
                                        fluid
                                        placeholder="Type your question"
                                        type="text"
                                        value={formik.values.name}
                                        name="name"
                                        error={formik.touched.name &&
                                        formik.errors.name ? formik.errors.name : undefined}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {question.type ?
                                        <Form.Dropdown
                                            className="question_disabled"
                                            selection
                                            options={this.questionTypeOptions}
                                            placeholder={type} disabled
                                            onChange={(event, data) => this.setQuestionType(data)}
                                        /> :
                                        <Form.Dropdown
                                            selection
                                            options={this.questionTypeOptions}
                                            placeholder={'Choose type'}
                                            onChange={(event, data) => this.setQuestionType(data)}
                                        />}
                                </Segment>
                                <Segment className="question_form-answers">
                                    {this.getForm(type, initialValues, formik)}
                                </Segment>
                                <Segment className="question_actions">
                                    <Button color="red" size="tiny"
                                            onClick={this.onClose}>
                                        Cancel
                                    </Button>
                                    <Button color="green" size="tiny" onClick={this.onSubmit}>
                                        Save
                                    </Button>
                                </Segment>
                            </Form>
                        </div>
                    )}
            </Formik>
        );
    }
}

export default QuestionDetails;
