import React, {
  useEffect, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { formatPriceLabel } from '@/roanuz/lib/cart';
import { Text14 } from '@/roanuz/typopgraphy';

const CarouselLayoutWrapper = styled.div`
  margin-top: ${asRem(20)};
  >.slider-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .slider-tools {
    position: relative;
    width: 100%;
  }

  .entire-bar,
  .difference-bar {
    // position: absolute;
    position: relative;
    height: ${asRem(2)};
  }

  .entire-bar {
    background-color: var(--color-border-2);
    width: 100%;
    z-index: 1;
    border-radius: ${asRem(3)};
  }

  .difference-bar {
    background-color: var(--color-button);
    z-index: 2;
    margin-top: -${asRem(2)};
    border-radius: ${asRem(3)};
  }

  /* Removing the default appearance */
  .knob,
  .knob::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }

  .knob {
    pointer-events: none;
    position: absolute;
    height: 0;
    width: 100%;
    outline: none;
  }

  .knob-left {
    z-index: 3;
    left: -${asRem(2)};
  }

  .knob-right {
    z-index: 4;
  }

  .knob-overlap {
    z-index: 5;
  }

  /* For Chrome browsers */
  .knob::-webkit-slider-thumb {
    background-color: var(--color-button);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    height: ${asRem(18)};
    width: ${asRem(18)};
    pointer-events: all;
    position: relative;
  }

  /* For Firefox browsers */
  .knob::-moz-range-thumb {
    background-color: var(--color-button);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    height: ${asRem(18)};
    width: ${asRem(18)};
    pointer-events: all;
    position: relative;
  }

  .range-display {
    margin: ${asRem(18)} 0 ${asRem(10)};
  }
`;

export const PriceSliderController = ({
  options, onChange, priceSliderReset, onResetPriceFilter,
  ispriceActive,
}) => {
  // Below code can be optimises, once approach is finalised.
  let allValues = [];
  options.forEach((field) => {
    const parts = field.value.split('_').map((x) => parseInt(x, 10));
    allValues = [...allValues, ...parts];
  });
  const start = allValues[0];
  const end = allValues[allValues.length - 1];

  const [startRef, setStartRef] = useState(start);
  const [endRef, setEndRef] = useState(end);

  useEffect(() => {
    if (!ispriceActive) {
      setStartRef(start);
    }
  }, [start]);

  useEffect(() => {
    if (!ispriceActive) {
      setEndRef(end);
    }
  }, [end]);

  const initState = () => ({
    minVal: null,
    maxVal: null,
  });
  const [initialSlabs, setInitialSlabs] = useState({ ...initState() });

  if (!initialSlabs.minVal && !initialSlabs.maxVal) {
    setInitialSlabs({
      ...initialSlabs,
      minVal: start,
      maxVal: end,
    });
  }

  useEffect(() => {
    if (priceSliderReset) {
      onResetPriceFilter();
      setStartRef(initialSlabs.minVal);
      setEndRef(initialSlabs.maxVal);
    }
  }, [priceSliderReset, onResetPriceFilter]);

  return (
    <PriceSliderView
      min={startRef}
      max={endRef}
      onChange={onChange}
      priceSliderReset={priceSliderReset}
      initialSlabs={initialSlabs}
      ispriceActive={ispriceActive}
    />
  );
};

PriceSliderController.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  priceSliderReset: PropTypes.bool,
  onResetPriceFilter: PropTypes.func,
  ispriceActive: PropTypes.bool,
};

export const PriceSliderView = ({
  min, max, onChange, priceSliderReset, initialSlabs,
  ispriceActive,
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);
  const [previousMinVal, setPreviousMinVal] = useState(min);
  const [previousMaxVal, setPreviousMaxVal] = useState(max);

  const getPercent = (value) => {
    return Math.round(((value - min) / (max - min)) * 100);
  };

  useEffect(() => {
    if (!ispriceActive) {
      setMinVal(min);
    }
  }, [min]);

  useEffect(() => {
    if (!ispriceActive) {
      setMaxVal(max);
    }
  }, [max]);

  useEffect(() => {
    setMinVal(initialSlabs.minVal);
    setMaxVal(initialSlabs.maxVal);
  }, [priceSliderReset]);

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(parseInt(maxValRef.current.value, 10));

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(parseInt(minValRef.current.value, 10));
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal]);

  // useEffect(() => {
  //   onChange({ min: minVal, max: maxVal });
  // }, [minVal, maxVal, onChange]);

  const minValChange = (event) => {
    const value = Math.min(parseInt(event.target.value, 10), maxVal - 1);
    setMinVal(value);
    // eslint-disable-next-line no-param-reassign
    event.target.value = value.toString();
  };

  const maxValChange = (event) => {
    const value = Math.max(parseInt(event.target.value, 10), minVal + 1);
    setMaxVal(value);
    // eslint-disable-next-line no-param-reassign
    event.target.value = value.toString();
  };

  const onSubmit = () => {
    if ((previousMinVal !== minVal) || (previousMaxVal !== maxVal)) {
      onChange({ min: minVal, max: maxVal });
      setPreviousMinVal(minVal);
      setPreviousMaxVal(maxVal);
    }
  };

  return (
    <CarouselLayoutWrapper>
      <div className="slider-bar">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={(val) => minValChange(val)}
          onMouseUp={() => onSubmit()}
          onTouchEnd={() => onSubmit()}
          className={`knob knob-left ${(minVal > max - 100) ? 'knob-overlap' : null}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(val) => maxValChange(val)}
          onMouseUp={() => onSubmit()}
          onTouchEnd={() => onSubmit()}
          className="knob knob-right"
        />

        <div className="slider-tools">
          <div className="entire-bar" />
          <div ref={range} className="difference-bar" />
        </div>
      </div>
      <div className="range-display">
        <Text14>{formatPriceLabel(`${minVal}-${maxVal}`)}</Text14>
      </div>
    </CarouselLayoutWrapper>
  );
};

PriceSliderView.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  priceSliderReset: PropTypes.bool,
  initialSlabs: PropTypes.object,
  ispriceActive: PropTypes.bool,
};
