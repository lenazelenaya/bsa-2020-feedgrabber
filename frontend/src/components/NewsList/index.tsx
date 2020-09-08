import React from 'react';
import { useTranslation } from "react-i18next";
import { ICompanyFeedItem } from 'models/companyFeed/ICompanyFeedItem';
import { connect } from 'react-redux';
import { IAppState } from 'models/IAppState';
import GenericPagination from 'components/helpers/GenericPagination';
import { loadCompanyFeedRoutine, setCompanyFeedPaginationRoutine } from 'sagas/companyFeed/routines';
import { IPaginationInfo } from 'models/IPaginationInfo';
import { Button } from 'semantic-ui-react';
import { Permissions } from "../helpers/AccessManager/rbac-rules";
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';
import NewsItem from "../NewsItem/NewsItem";
import AccessManager from "../helpers/AccessManager";

interface INewsFeedProps {
  pagination?: IPaginationInfo<ICompanyFeedItem>;
  isLoading?: boolean;
  loadNews?(): void;
  setPagination?(pagination: IPaginationInfo<ICompanyFeedItem>): void;
}

const NewsList: React.FC<INewsFeedProps> = ({
  pagination,
  isLoading,
  loadNews,
  setPagination
}) => {
  const [t] = useTranslation();
  return (
    <div className={styles.newsItemContainer}>
      <AccessManager staticPermission={Permissions.createPostsAndPolls}>
        <Link to="/company/new">
          <Button>{t('Add news')}</Button>
        </Link>
      </AccessManager>
      <div className={styles.newsListMain}>
        <GenericPagination
          isLoading={isLoading}
          loadItems={loadNews}
          pagination={pagination}
          setPagination={setPagination}
          mapItemToJSX={(item: ICompanyFeedItem) => (<NewsItem item={item}/>)} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  pagination: state.companyFeed.list,
  isLoading: state.companyFeed.isLoading
});

const mapDispatchToProps = {
  loadNews: loadCompanyFeedRoutine,
  setPagination: setCompanyFeedPaginationRoutine
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsList);
