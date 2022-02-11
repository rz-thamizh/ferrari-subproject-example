import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from '@apollo/client';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import { CategoryNavQuery } from '@/store/category/query';
import Link from 'next/link';

export const MasterNavItems = ({ items }) => {
  if ((!items) || items.length === 0) {
    return null;
  }

  const elements = items.filter((x) => x.include_in_menu === 1).map((item) => (
    <li key={item.uid}>
      <>
        <Link href={`/${item.url_path}${item.url_suffix}`} prefetch={false}>
          <a>{item.name}</a>
        </Link>
        {item.children && (
        <MasterNavItems items={item.children} />
        )}
      </>
    </li>
  ));

  return (
    <ul className="debug-master-nav">
      {elements}
    </ul>
  );
};

MasterNavItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const MasterNav = ({ rootCategoryId }) => {
  const { loading, error, data } = useQuery(
    CategoryNavQuery, { variables: { parentCategory: rootCategoryId } },
  );

  if (loading) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);
  const { items } = data.categories;

  return (
    <MasterNavItems items={items} />
  );
};

MasterNav.propTypes = {
  rootCategoryId: PropTypes.number.isRequired,
};

export default MasterNav;
