package com.feed_grabber.core.question;

import com.feed_grabber.core.question.dto.QuestionDto;
import com.feed_grabber.core.question.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    @Query("SELECT q FROM Question q INNER JOIN q.questionnaires que " +
            "WHERE que.questionnaire.id = :questionnaireId")
    List<Question> findAllByQuestionnaireId(@Param("questionnaireId") UUID questionnaireId);

    @Query("SELECT case when (COUNT(q) > 0) then true else false end " +
            "FROM Question q INNER JOIN q.questionnaires que " +
            "WHERE q.text = :text AND que.questionnaire.id = :questionnaireId AND q.category.id = :categoryId")
    boolean existsByTextAndQuestionnaireIdAndCategoryId
            (@Param("text") String text, @Param("questionnaireId") UUID questionnaireId,
             @Param("categoryId") UUID categoryId);

    @Query("SELECT case when (COUNT(q) > 0) then true else false end " +
            "FROM Question q INNER JOIN q.questionnaires que " +
            "WHERE q.text = :text AND que.questionnaire.id = :questionnaireId AND " +
            "q.category.id = :categoryId AND q.id <> :id")
    boolean existsByTextAndQuestionnaireIdAndCategoryIdAndIdIsNot
            (@Param("text") String text, @Param("questionnaireId") UUID questionnaireId,
             @Param("categoryId") UUID categoryId, @Param("id") UUID id);

    @Query("SELECT q from Question q inner join q.questionnaires que where q.id = ?1 and que.id = ?2")
    Optional<QuestionDto> findByIdAndQuestionnaireID(UUID questionId, UUID questionnaireId);

    @Query("delete from Question where id in (select q.id from Question q inner join q.questionnaires que on (q.id = ?2 and que.id = ?1))")
    void deleteByQuestionnaireId(UUID qId, UUID id);
}
