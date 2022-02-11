import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from '@apollo/client';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import { cmsBlocksQuery } from '@/store/cms/query';
import MagentoHtml from './MagentoHtml';

export const BlocksListView = ({ blockIds }) => {
  const { loading, error, data } = useQuery(
    cmsBlocksQuery, { variables: { identifiers: blockIds } },
  );

  if (loading) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);
  const { items } = data.cmsBlocks;

  return (
    <>
      {items.map((item) => <BlockView content={item} key={item.identifier} />)}
    </>
  );
};

BlocksListView.propTypes = {
  blockIds: PropTypes.arrayOf(PropTypes.string),
};

export const BlockView = ({ content }) => {
  return (
    <MagentoHtml html={content.content} />
  );
};

BlockView.propTypes = {
  content: PropTypes.shape({
    content: PropTypes.string,
  }),
};
