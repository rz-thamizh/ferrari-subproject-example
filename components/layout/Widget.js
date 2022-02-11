import PropTypes from 'prop-types';
import React from 'react';
import MagentoHtml from './MagentoHtml';
import { BlocksListView } from './Block';

const Widget = ({ widget }) => {
  const isBlock = widget.widget.type === 'Magento\\Cms\\Block\\Widget\\Block';

  // Not a right way but magento 🤷‍♀️
  if (isBlock && widget.widget.html && widget.widget.html.startsWith('Error filtering template')) {
    const blockIds = widget.widget.parameters.map((x) => x.value);
    return (
      <BlocksListView widget={widget} blockIds={blockIds} />
    );
  }

  return (
    <MagentoHtml html={widget.widget.html} />
  );
};

Widget.propTypes = {
  widget: PropTypes.object.isRequired,
};

export default Widget;
