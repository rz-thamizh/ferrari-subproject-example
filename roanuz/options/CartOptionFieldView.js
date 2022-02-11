import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartOptionFieldView = ({ config, onChange }) => {
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
    <input
      key={config.uid}
      type="text"
      maxLength={config.max_characters ? config.max_characters : 512}
      value={value}
      onBlur={onValueChangeBlur}
      onChange={onValueChange}
    />
  );
};

CartOptionFieldView.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export default CartOptionFieldView;
