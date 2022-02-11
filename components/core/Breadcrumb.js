import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';

const Breadcrumb = ({ items }) => (
  <ul className="debug-breadcrumb-links">
    {items.map((item) => (
      <li key={item.key}>
        <Link href={item.url}>
          <a>{item.name}</a>
        </Link>
      </li>
    ))}
  </ul>
);

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

export const CategoryBreadcrumb = ({ breadcrumbs, urlSuffix, addHome = true }) => {
  let items = [];

  if (addHome) {
    items.push({ key: '/', name: 'Home', url: '/' });
  }

  if (breadcrumbs) {
    const bitems = breadcrumbs.map((item) => {
      let categoryPath = item.category_url_path;
      if (!categoryPath.startsWith('/')) {
        categoryPath = `/${categoryPath}`;
      }
      return {
        key: item.category_uid,
        name: item.category_name,
        url: `${categoryPath}${urlSuffix}`,
      };
    });

    items = [...items, ...bitems];
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb items={items} />
  );
};

CategoryBreadcrumb.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
  urlSuffix: PropTypes.string.isRequired,
  addHome: PropTypes.bool,
};

CategoryBreadcrumb.defaultProps = {
  addHome: true,
};

export default Breadcrumb;
