import PropTypes from 'prop-types';
import React from 'react';
import Widget from './Widget';

const ContainerWidgets = ({ container, widgets, className }) => {
  if ((!widgets) || (!widgets[container])) {
    return null;
  }

  const widgetsElement = (
    <>
      {widgets[container].map((widget) => (
        <Widget
          key={widget.widget.id}
          widget={widget}
        />
      ))}
    </>
  );

  if (className) {
    return (
      <div className={className}>
        <div className="container-widgets">
          {widgetsElement}
        </div>
      </div>
    );
  }

  return widgetsElement;
};

ContainerWidgets.propTypes = {
  container: PropTypes.string.isRequired,
  widgets: PropTypes.object,
  className: PropTypes.string,
};

export default ContainerWidgets;
