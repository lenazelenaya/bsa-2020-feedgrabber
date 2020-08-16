import { FreeTextResponse } from "components/ResponseQuestion/FreeTextResponse";
import { DateSelectionResponse } from "components/ResponseQuestion/DateSelectionResponse";
import { IQuestionResponse } from "models/IQuestionResponse";
import React from "react";
import { ITextQuestion } from "./IQuesion";

export default new Map([
    ['FREE_TEXT', ({ question, answerHandler }: IQuestionResponse<ITextQuestion>) => {
        return <FreeTextResponse question={question} answerHandler={answerHandler} />;
    }],
    ['DATE', ({ question, answerHandler }: IQuestionResponse) => {
        return <DateSelectionResponse question={question} answerHandler={answerHandler} />;
    }]
    // ,['RADIO', ({ question, answerHandler }: IQuestionResponse) => {
    //    return <RadioResponse question={question} answerHandler={answerHandler} />;
    // }] and other...
]);