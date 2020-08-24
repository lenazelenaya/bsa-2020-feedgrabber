import React, {FC, useEffect} from 'react';
import {connect, ConnectedProps} from "react-redux";
import { IAppState } from 'models/IAppState';
import {
    loadQuestionnaireReportRoutine,
    loadReportRoutine,
    loadRespondentReportRoutine,
    loadRespondentReportsRoutine
} from "../../sagas/report/routines";
import UIPageTitle from "../../components/UI/UIPageTitle";
import UIContent from "../../components/UI/UIContent";
import UIColumn from "../../components/UI/UIColumn";
import UICard from "../../components/UI/UICard";
import UICardBlock from "../../components/UI/UICardBlock";
import UITab from "../../components/UI/UITab";
import LoaderWrapper from "../../components/LoaderWrapper";
import { Tab, Segment, Header } from 'semantic-ui-react';
import { IQuestion, QuestionType } from "../../models/forms/Questions/IQuesion";
import {
    IQuestionReport,
    IQuestionReportCheckboxData,
    IQuestionReportFreeTextData,
    IQuestionReportRadioData,
    IQuestionReportScaleData,
    IQuestionReportDateData, IQuestionReportFileData, IRespondentReportPreview
} from "../../models/report/IReport";
import RadioQuestionReport from "./RadioQuestionReport";
import FreeTextQuestionReport from "./FreeTextQuestionReport";
import CheckboxQuestionReport from "./CheckboxQuestionReport";
import ScaleQuestionReport from "./ScaleQuestionReport";
import DateSelectionReport from "./DateSelectionReport";
import { FileQuestionReport } from './FileQuestionReport';
import { Link } from 'react-router-dom';
import styles from './styles.module.sass';

const ReportPage: FC<ConnectedReportPageProps & { match }> = (
  {
    match,
    report,
    isLoadingReport,
    currentUsersReports,
    isLoadingUsersReports,
    loadReport,
    loadUsersReports
  }
) => {
    useEffect(() => {
        loadReport(match.params.id);
    }, [loadReport, match.params.id]);

  useEffect(() => {
    loadUsersReports(match.params.id);
  }, [loadUsersReports, match.params.id]);

    console.log(currentUsersReports);

    const panes = [
    {
      menuItem: 'General',
      render: () => (
        <Tab.Pane>
          <LoaderWrapper loading={isLoadingReport}>
            <UIColumn>
              {report.questions && (
                <UICard>
                  <UICardBlock>
                    <h3>{report.questionnaireTitle}</h3>
                  </UICardBlock>
                  {report.questions.map(q => (
                    <UICardBlock>
                      <h4>{q.title}</h4>
                      <p><b>{q.answers} answers</b></p>
                      {renderQuestionData(q)}
                    </UICardBlock>
                  ))}
                </UICard>
              )}
            </UIColumn>
          </LoaderWrapper>
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Respondents',
      render: () => (
        <Tab.Pane>
          <LoaderWrapper loading={isLoadingUsersReports}>
            <div className={styles.respondent_reports_container}>
              {currentUsersReports &&
                currentUsersReports.map(reportPreview =>
                  renderUserReportPreview(reportPreview, match.params.id))
              }
            </div>
          </LoaderWrapper>
        </Tab.Pane>
      )
    }
  ];

  return (
    <>
      <UIPageTitle title="Report"/>
      <UIContent>
        <UITab panes={panes} menuPosition="left" />
      </UIContent>
    </>
  );
};

const mapStateToProps = (rootState: IAppState) => ({
  report: rootState.questionnaireReports.currentFullReport,
  isLoadingReport: rootState.questionnaireReports.isLoading,
  currentUserReport: rootState.questionnaireReports.currentUserReport,
  currentUsersReports: rootState.questionnaireReports.responsesPreview,
  isLoadingUsersReports: rootState.questionnaireReports.isLoadingPreviews
});

const mapDispatchToProps = {
  loadReport: loadReportRoutine,
  loadUsersReports: loadRespondentReportsRoutine
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectedReportPageProps = ConnectedProps<typeof connector>;

export default connector(ReportPage);

function renderUserReportPreview(userReport: IRespondentReportPreview, id: string) {
  return (
    <Link to={`/report/${id}/${userReport.id}`} className={styles.respondent_report_preview}>
      <Segment>
        <Header as="h4">{userReport.firstName} {userReport.lastName}</Header>
        <span>{userReport.answeredAt}</span>
      </Segment>
    </Link>
  );
}

function renderQuestionData(question: IQuestionReport) {
    switch (question.type) {
        case QuestionType.radio:
            return <RadioQuestionReport data={question.data as IQuestionReportRadioData}/>;
        case QuestionType.checkbox:
            return <CheckboxQuestionReport data={question.data as IQuestionReportCheckboxData}/>;
        case QuestionType.date:
            return <DateSelectionReport data={question.data as IQuestionReportDateData}/>;
        case QuestionType.fileUpload:
            return <FileQuestionReport data={question.data as IQuestionReportFileData}/>;
        case QuestionType.freeText:
            return <FreeTextQuestionReport data={question.data as IQuestionReportFreeTextData}/>;
        case QuestionType.scale:
            return <ScaleQuestionReport data={question.data as IQuestionReportScaleData}/>;
        default:
            return undefined;
    }
}
