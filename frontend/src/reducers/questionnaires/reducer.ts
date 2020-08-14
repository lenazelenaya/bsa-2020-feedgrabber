import {
  addQuestionnaireRoutine,
  deleteQuestionnaireRoutine,
  hideModalQuestionnaireRoutine,
  loadQuestionnairesRoutine, setQuestionnairePaginationRoutine,
  showModalQuestionnaireRoutine,
  updateQuestionnaireRoutine,
  loadCurrentQuestionnaireRoutine
} from '../../sagas/qustionnaires/routines';
import {IAppState} from "../../models/IAppState";
import {combineReducers} from "redux";
import {addSelectedQuestionsRoutine, loadQuestionnaireQuestionsRoutine} from "../../sagas/questions/routines";
import {IQuestionnaire} from "../../models/forms/Questionnaires/types";

const questionnairesListReducer = (state: IAppState['questionnaires']['list'] = {}, action) => {
    switch (action.type) {
        case setQuestionnairePaginationRoutine.TRIGGER:
            return {
                ...state,
                pagination: action.payload
            };
        case loadQuestionnairesRoutine.TRIGGER:
        case deleteQuestionnaireRoutine.TRIGGER:
            return {
                ...state,
                isLoading: true
            };
        case loadQuestionnairesRoutine.FAILURE:
        case deleteQuestionnaireRoutine.SUCCESS:
        case deleteQuestionnaireRoutine.FAILURE:
            return {
                ...state,
                isLoading: false
            };
        case loadQuestionnairesRoutine.SUCCESS:
            return {
                ...state,
                pagination: action.payload,
                isLoading: false
            };
        case addQuestionnaireRoutine.TRIGGER:
        case updateQuestionnaireRoutine.TRIGGER:
            return {
                ...state,
                modalError: undefined,
                modalLoading: true
            };
        case updateQuestionnaireRoutine.FAILURE:
        case addQuestionnaireRoutine.FAILURE:
            return {
                ...state,
                modalError: action.payload,
                modalLoading: false
            };
        case showModalQuestionnaireRoutine.TRIGGER:
            return {
                ...state,
                modalShown: true,
                modalQuestionnaire: action.payload
            };
        case hideModalQuestionnaireRoutine.TRIGGER:
            return {
                ...state,
                modalError: undefined,
                modalShown: false,
                modalQuestionnaire: undefined,
                modalLoading: false
            };
        default:
            return state;
    }
};

const currentQuestionnaireReducer = (state: IAppState['questionnaires']['current'] =
                                         {questions:[], get:{} as IQuestionnaire}, {payload, type}) => {
    switch (type) {
        case addSelectedQuestionsRoutine.TRIGGER:
            return {
                ...state,
                questions : [...state.questions, ...payload]
            };
        case loadCurrentQuestionnaireRoutine.SUCCESS:
            return {
                ...state,
                get: payload,
                isLoading: false
            };
        case loadQuestionnaireQuestionsRoutine.SUCCESS:
            return {
                ...state,
                questions: payload,
                isLoading: false
            };
        case loadCurrentQuestionnaireRoutine.TRIGGER:
        case loadQuestionnaireQuestionsRoutine.TRIGGER:
            return {
                ...state,
                isLoading: true
            };
        case loadCurrentQuestionnaireRoutine.FAILURE:
        case loadQuestionnaireQuestionsRoutine.FAILURE:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
};

const questionnairesReducer = combineReducers({
    list: questionnairesListReducer,
    current: currentQuestionnaireReducer
});

export default questionnairesReducer;
