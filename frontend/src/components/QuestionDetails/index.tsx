import React, {useEffect, useState} from "react";
import {Divider, Dropdown, Form, Icon, Radio, Segment} from "semantic-ui-react";
import {Formik} from "formik";
import styles from "./styles.module.sass";
import {IQuestion, QuestionType} from "../../models/forms/Questions/IQuesion";
import {IComponentState} from "../ComponentsQuestions/IQuestionInputContract";
import CheckboxQuestion from "../ComponentsQuestions/CheckboxQuestion";
import MultichoiseQuestion from "../ComponentsQuestions/MultichoiseQuestion";
import ScaleQuestion from "../ComponentsQuestions/ScaleQuestion";
import DateSelectionQuestionUI from "../ComponentsQuestions/DateSelectionQuestionUI";
import FileUploadQuestion from "../ComponentsQuestions/FileUploadQuestion";
import {mainSchema} from "./schemas";
// import {questionTypeOptions} from "./questionTypeOptions";
import RadioButtonQuestionUI from "../ComponentsQuestions/RadioButtonQuestionUI";
import FreeTextQuestionUI from "../ComponentsQuestions/FreeTextQuestionUI";
import QuestionDetailsOptions from "./QuestionDetailsOptions";

interface IQuestionProps {
    currentQuestion: IQuestion;
    categories: string[];
    onValueChange(state: IComponentState<IQuestion>): void;
}

const QuestionD: React.FC<IQuestionProps> = ({
                                                 currentQuestion,
                                                 categories,
                                                 onValueChange
                                             }) => {
    const [question, setQuestion] = useState<IQuestion>(currentQuestion);
    const [nameIsValid, setNameIsValid] = useState<boolean>(currentQuestion.name.length > 0);
    const [categoryIsValid, setCategoryIsValid] = useState<boolean>(currentQuestion.categoryTitle.length > 0);
    const [innerFormIsValid, setInnerFormIsValid] = useState<boolean>(true);
    const [addedCategories, setNewCategories] = useState([]);

    useEffect(() => {
        onValueChange({value: question, isCompleted:
                categoryIsValid &&
                nameIsValid &&
                innerFormIsValid &&
                !!question.type
        });
    }, [nameIsValid, categoryIsValid, onValueChange, question, innerFormIsValid]);

    const handleQuestionDetailsUpdate = (state: IComponentState<{}>) => {
        const {isCompleted, value} = state;
        setInnerFormIsValid(isCompleted);
        setQuestion({...question, details: value as any});
        onValueChange({value: question, isCompleted:
                nameIsValid &&
                categoryIsValid &&
                innerFormIsValid&&
                !!question.type
        });
    };

    const handleQuestionUpdate = (question: IQuestion) => {
        setQuestion(question);
        onValueChange({value: question, isCompleted:
                nameIsValid &&
                categoryIsValid &&
                innerFormIsValid &&
                !!question.type});
    };

    const renderForm = () => {
        switch (question.type) {
            case QuestionType.radio:
                return (
                    <RadioButtonQuestionUI
                        value={question.details}
                        onValueChange={handleQuestionDetailsUpdate}/>
                );
            case QuestionType.checkbox:
                return (
                    <CheckboxQuestion
                        onValueChange={handleQuestionDetailsUpdate}
                        value={question.details}
                    />
                );
            case QuestionType.multichoice:
                return (
                    <MultichoiseQuestion
                        onValueChange={handleQuestionDetailsUpdate}
                        value={question.details}
                    />
                );
            case QuestionType.scale:
                return (
                    <ScaleQuestion
                        onValueChange={handleQuestionDetailsUpdate}
                        value={question.details}
                    />
                );
            case QuestionType.freeText:
                return <FreeTextQuestionUI/>;
            case QuestionType.date:
                return <DateSelectionQuestionUI/>;
            case QuestionType.fileUpload:
                return <FileUploadQuestion
                        onValueChange={handleQuestionDetailsUpdate}
                        value={question.details}
                    />;
            default:
                return <span className={styles.question_default}>You should choose the type of the question :)</span>;
        }
    };

    const setQuestionType = (data: any) => {
        const type: QuestionType = data.value;
        setInnerFormIsValid(true);
        setQuestion({...question, type, details: undefined});
    };

    const categoriesOptions = (cat: string[]) => {
        return cat.map(cat => {
            return {
                key: cat,
                value: cat,
                text: cat
            };
        });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{name: question.name, categoryTitle: question.categoryTitle}}
            validationSchema={mainSchema}
            onSubmit={() => console.log()}
        >
            {formik => (
                <div className={styles.question_container}>
                    <Form className={styles.question_form}>
                        <Segment className={styles.question_header}>
                            <div className={styles.question_input_type}>
                                <Form.Input
                                    className={styles.question_input}
                                    fluid
                                    placeholder="Type your question"
                                    type="text"
                                    value={formik.values.name}
                                    name="name"
                                    error={
                                        formik.touched.name && formik.errors.name
                                            ? formik.errors.name
                                            : undefined
                                    }
                                    onChange={(e, {value}) => {
                                        setNameIsValid(value.length > 0);
                                        handleQuestionUpdate({...question, name: value as string});
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                <QuestionDetailsOptions question={question} setQuestionType={setQuestionType} />
                            </div>
                            <Form.Dropdown
                                placeholder='Choose category or type custom'
                                closeOnBlur
                                allowAdditions
                                additionLabel='Add new category: '
                                onChange={(e, {value}) => {
                                    setCategoryIsValid(true);
                                    handleQuestionUpdate({...question, categoryTitle: value as string});
                                }}
                                value={formik.values.categoryTitle}
                                onAddItem={(e, {value}) => {
                                    setNewCategories(
                                        [value, ...addedCategories]
                                    );
                                    setQuestion({
                                        ...question, categoryTitle: value as string
                                    });
                                    setCategoryIsValid(true);
                                }}
                                search
                                selection
                                error={formik.touched.categoryTitle && formik.errors.categoryTitle
                                    ? formik.errors.categoryTitle
                                    : undefined}
                                options={categoriesOptions(
                                    [...addedCategories, ...categories])}
                                onBlur={formik.handleBlur}
                            />{' '}
                            <Divider />
                            <div className={styles.question_form_answers}>
                                {renderForm()}
                            </div>
                            <Divider />
                            <div className={styles.actions}>
                                <span className={styles.icon}>
                                    <Icon name="plus square outline" size="large" />
                                </span>
                                <span className={styles.icon}>
                                    <Icon name="trash alternate outline" size="large" />
                                </span>
                                <Radio toggle />
                                <Dropdown
                                    className={styles.icon}
                                    text=" "
                                    icon="ellipsis vertical"
                                    options={[
                                        {
                                            text: "option1"
                                        },
                                        {
                                            text: "option2"
                                        }
                                    ]}
                                />
                            </div>
                        </Segment>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default QuestionD;