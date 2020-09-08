import React, {useEffect, useState} from "react";
import {CommentGroup, Comment, Divider, Dropdown} from "semantic-ui-react";
import CommentInput from "./CommentInput";
import {IAppState} from "../../models/IAppState";
import {connect, ConnectedProps} from "react-redux";
import NewsItem from "../NewsItem/NewsItem";
import {loadCompanyFeedItemRoutine} from "../../sagas/companyFeed/routines";
import {ICompanyFeedItem} from "../../models/companyFeed/ICompanyFeedItem";
import UIContent from "../UI/UIContent";
import UIColumn from "../UI/UIColumn";
import UIPageTitle from "../UI/UIPageTitle";
import {saveCommentRoutine} from "../../sagas/comments/routines";
import moment from "moment";
import styles from "./styles.module.sass";
import LoaderWrapper from "../LoaderWrapper";

const defaultItem: ICompanyFeedItem = {
    id: "",
    title: "",
    body: "",
    type: "",
    createdAt: "",
    user: {
        id: "",
        username: ""
    },
    commentsCount: 0
};

const ExpandedNewsItem: React.FC<ExpandedNewsProps & { match }> = ({
        newsItem,
        isLoading,
        loadNews,
        saveComment,
        match
}) => {

    useEffect(() => {
        loadNews({ id: match.params.id });
    }, [loadNews, match.params.id]);

    const [body, setBody] = useState('');

    const handleCommentChange = (body: string) => {
       setBody(body);
    };

    const handleSubmit = () => {
        if (body) {
            saveComment({
                body,
                newsId: match.params.id
            });
            setBody("");
        }
    };

    return (
        <UIContent>
            <UIPageTitle title={""}/>
            <UIColumn wide >
                <NewsItem item={newsItem ? newsItem : defaultItem} />
                <Divider />
                <LoaderWrapper loading={isLoading}>
                <CommentGroup className={styles.comments}>
                    {newsItem?.comments?.map(comment => (
                        <Comment>
                            <Comment.Avatar src={comment.user.avatar} />
                            <Comment.Content>
                                <Comment.Author>
                                    {comment.user.username}
                                    <Comment.Metadata>
                                    {moment(comment.createdAt).fromNow()}
                                    </Comment.Metadata>
                                    <Dropdown>
                                    <Dropdown.Menu size="sm" title="">
                                      <Dropdown.Item>Edit</Dropdown.Item>
                                      <Dropdown.Item>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </Comment.Author>
                                <Comment.Text>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                </CommentGroup>
                </LoaderWrapper>
                <CommentInput
                    className={styles.commentInput}
                    value={body}
                    onChange={handleCommentChange}
                    onSubmit={handleSubmit}
                />
            </UIColumn>
        </UIContent>
    );
};

const mapStateToProps = (state: IAppState) => ({
    newsItem: state.companyFeed.current,
    isLoading: state.companyFeed.isLoading
});

const mapDispatchToProps = {
    loadNews: loadCompanyFeedItemRoutine,
    saveComment: saveCommentRoutine
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type ExpandedNewsProps = ConnectedProps<typeof connector>;
export default connector(ExpandedNewsItem);
