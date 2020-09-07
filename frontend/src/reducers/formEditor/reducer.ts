import {IQuestionnaire} from "../../models/forms/Questionnaires/types";
import {IAppState} from "../../models/IAppState";
import {IQuestion} from "../../models/forms/Questions/IQuesion";
import {
    addQuestionToSectionRoutine,
    createSectionRoutine,
    deleteQuestionFromSectionRoutine,
    loadSavedSectionsByQuestionnaireRoutine,
    loadSectionsByQuestionnaireRoutine,
    setCurrentQuestionInSection,
    setCurrentSectionRoutine,
    updateQuestionInSectionRoutine,
    updateSectionRoutine,
    updateSections
} from "sagas/sections/routines";
import {
    addSelectedQuestionsRoutine,
    loadQuestionsBySectionRoutine,
    saveQuestionRoutine
} from "sagas/questions/routines";
import {loadOneQuestionnaireRoutine, saveAndGetQuestionnaireRoutine} from "../../sagas/qustionnaires/routines";

const init = {
    questionnaire: {} as IQuestionnaire,
    sections: {
        list: [] as ISection[],
        current: {title: ''} as ISection
    },
    currentQuestion: {} as IQuestion,
    isLoading: false
};

const formEditorReducer = (state: IAppState["formEditor"] = init, {type, payload}) => {
    switch (type) {
        case setCurrentSectionRoutine.TRIGGER:
            return {
                ...state,
                sections: {
                    ...state.sections,
                    current: payload
                }
            };
        case createSectionRoutine.SUCCESS:
            payload.questions = [];
            return {
                ...state,
                sections: {
                    list: [...state.sections.list, payload],
                    current: payload
                },
                isLoading: false
            };
        case updateSectionRoutine.SUCCESS:
            return {
                ...state,
                sections: {
                    current: {...state.sections.current, ...payload},
                    list: state.sections.list.map(s => s.id === payload.id ? {...s, ...payload} : s)
                },
                isLoading: false
            };
        case loadOneQuestionnaireRoutine.SUCCESS:
        case saveAndGetQuestionnaireRoutine.SUCCESS:
            return {
                ...state,
                questionnaire: payload,
                isLoading: false
            };
        case loadSectionsByQuestionnaireRoutine.SUCCESS:
        case loadSavedSectionsByQuestionnaireRoutine.SUCCESS:
            return {
                ...state,
                sections: {
                    list: payload,
                    current: payload[0]
                },
                isLoading: false
            };
        case loadQuestionsBySectionRoutine.SUCCESS:
            return {
                ...state,
                sections: {
                    ...state.sections,
                    current: {
                        ...state.sections.current,
                        questions: payload
                    }
                },
                isLoading: false
            };
        case setCurrentQuestionInSection.TRIGGER:
            return {
                ...state,
                sections: {
                    ...state.sections,
                    current: state.sections.list?.find(s => s.questions.find(q => q.id === payload.id))
                },
                currentQuestion: payload
            };
        case updateSections.TRIGGER:
            return {
                ...state,
                sections: {
                    list: payload,
                    current: payload.find(s => s.id === state.sections.current.id)
                }
            };
        case updateQuestionInSectionRoutine.SUCCESS:
        case addQuestionToSectionRoutine.SUCCESS:
        case deleteQuestionFromSectionRoutine.SUCCESS:
            const {sectionId, questions} = payload;
            const list = state.sections.list.map(s => s.id === sectionId ? {...s, questions} : s);
            return {
                ...state,
                sections: {
                    current: {...state.sections.current, questions},
                    list
                },
                isLoading: false
            };
        case loadOneQuestionnaireRoutine.TRIGGER:
        case saveAndGetQuestionnaireRoutine.TRIGGER:
        case loadSectionsByQuestionnaireRoutine.TRIGGER:
        case createSectionRoutine.TRIGGER:
        case loadSavedSectionsByQuestionnaireRoutine.TRIGGER:
        case loadQuestionsBySectionRoutine.TRIGGER:
            return {
                ...state,
                isLoading: true
            };
        case addSelectedQuestionsRoutine.FAILURE:
        case updateQuestionInSectionRoutine.FAILURE:
        case saveAndGetQuestionnaireRoutine.FAILURE:
        case loadSectionsByQuestionnaireRoutine.FAILURE:
        case loadSavedSectionsByQuestionnaireRoutine.FAILURE:
        case loadQuestionsBySectionRoutine.FAILURE:
        case loadOneQuestionnaireRoutine.FAILURE:
        case saveQuestionRoutine.FAILURE:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
};

export default formEditorReducer;

export interface ISectionsState {
    questionnaireId?: string;
    list?: ISection[];
    current?: ISection;
}

export interface ISection {
    id?: string;
    title: string;
    description?: string;
    questions?: IQuestion[];
}
