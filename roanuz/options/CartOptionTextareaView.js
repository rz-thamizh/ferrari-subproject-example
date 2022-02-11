import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartOptionTextareaView = ({ config, onChange }) => {
  const [value, setValue] = useState('');
  const [finalText, setFinalText] = useState('');
  const onValueChange = (event) => {
    const changeValue = event.target.value;
    setValue(changeValue);
  };

  useEffect(() => {
    onChange(finalText);
  }, [finalText]);

  const onValueChangeBlur = () => {
    setFinalText(value);
  };

  return (
    <textarea
      type="text"
      maxLength={config.max_characters ? config.max_characters : 512}
      value={value}
      onChange={onValueChange}
      rows="3"
      key={config.uid}
      onBlur={onValueChangeBlur}
    />
  );
};

CartOptionTextareaView.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export default CartOptionTextareaView;
