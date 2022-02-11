import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import KeenSlider from 'keen-slider';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Button } from '@/roanuz/view/button';
import { CircleIcon } from '@/roanuz/view/icon';
import { ReactComponent as RightArrowIcon } from '@/roanuz/view/imgs/RightArrow.svg';

export const SliderChildClassName = 'keen-slider__slide';

export const sliderPropTypes = PropTypes.shape({
  slidesPerView: PropTypes.string,
  spacing: PropTypes.int,
});

export function useCustomKeenSlider(options = {}) {
  const ref = useRef();
  const [slider, setSlider] = useState(null);

  useEffect(() => {
    const newSlider = new KeenSlider(ref.current, options);
    // console.log('Creating new Slider', options, ref.current, newSlider);
    setSlider(newSlider);
    return () => {
      newSlider.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, options);
  return [ref, slider];
}

export const ArrowButtonView = ({
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      icon={<RightArrowIcon />}
      noborder
      ariaLabel="Right Arrow Button"
    />
  );
};

ArrowButtonView.propTypes = {
  onClick: PropTypes.func,
};

export const PageButton = styled(Button)`
  color: var(--color-grey);
  &:hover {
    color: var(--color-button);
  }

  .rz-svg-icon {
    padding-right: 0;
  }

  ${(props) => props.isActive && css`
    color: var(--color-button);
  `};
`;
export const PageButtonView = ({
  onClick,
  isActive,
}) => {
  return (
    <PageButton
      onClick={onClick}
      icon={<CircleIcon heightPx={8} />}
      noborder
      isActive={isActive}
    />
  );
};

PageButtonView.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

const SliderViewWrapper = styled.div`
  --arrow-button-width: ${asRem(40)};
  
  .slider-container {
    display: flex;
    >.arrow {
      display: none;
      min-width: var(--arrow-button-width);
  
      &.arrow-left {
        svg {
          transform: rotate(-180deg);
        }
      }
    }
  }

  .slider-tools {
    margin-top: ${asRem(20)};
    text-align: center;
  }

  .rz-product-card {
      @media screen and (max-width: ${Breakpoint.sm}) {
        &.OneByThree {
        --card-width: 100%;
      }
    }
  }


  @media screen and (min-width: ${Breakpoint.lg}) {

    ${(props) => props.showArrows && css`
      width: calc(100% + (2 * var(--arrow-button-width)));
      transform: translateX(calc(-1 * var(--arrow-button-width)));

      >.slider-container {
        align-items: center;
        align-content: center;
      }
    `}

    .slider-container {
      >.arrow {
        display: block;
      }
    }

    .slider-tools {
      display: none;
    }
  }

`;

export const SliderView = ({
  children, responsive, slider,
  showPagingTools,
}) => {
  const defaults = {
    initial: 0,
    centered: false,
  };
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pages, setPages] = React.useState([1]);

  const updateState = (s) => {
    const state = s.details();
    const slide = state.relativeSlide || 0;
    const slidePerView = state.slidesPerView || 1;
    let newCurrentPage = Math.floor(slide / slidePerView) + 1;
    const newTotalPages = Math.ceil(state.size / slidePerView);

    if (slide >= (state.size - slidePerView)) {
      // Last page may have previous page slides
      newCurrentPage = newTotalPages;
    }

    if (slidePerView === 1) {
      newCurrentPage = slide + 1;
    }

    const newPages = [];
    for (let i = 0; i < newTotalPages; i += 1) {
      newPages.push(i + 1);
    }

    setTotalPages(newTotalPages);
    setPages(newPages);
    setCurrentPage(Math.max(1, newCurrentPage));
  };

  const options = { ...defaults, ...slider };
  const breakpoints = {};

  Object.keys(responsive).forEach((key) => {
    breakpoints[`(min-width: ${Breakpoint[key]})`] = responsive[key];
  });

  options.breakpoints = { ...(options.breakpoints || {}), ...breakpoints };
  options.slideChanged = (s) => {
    updateState(s);
  };

  options.created = (s) => {
    updateState(s);
  };

  const [sliderRef, silderInstance] = useCustomKeenSlider(options);

  const gotoPage = (page) => {
    const state = silderInstance.details();
    silderInstance.moveToSlideRelative((page - 1) * state.slidesPerView);
  };

  const nextPage = (e) => {
    e.stopPropagation();
    const page = Math.min(
      totalPages,
      currentPage + 1,
    );
    gotoPage(page);
  };

  const prevPage = (e) => {
    e.stopPropagation();
    const page = Math.max(
      1,
      currentPage - 1,
    );

    gotoPage(page);
  };

  return (
    <SliderViewWrapper
      showArrows={showPagingTools}
    >
      <div className="slider-container">
        {showPagingTools && (
          <div className="arrow arrow-left">
            {currentPage !== 1 && (
              <ArrowButtonView
                onClick={prevPage}
              />
            )}
          </div>
        )}
        <div className="keen-slider" ref={sliderRef}>
          {children}
        </div>
        {showPagingTools && (
          <div className="arrow arrow-right">
            {(totalPages - currentPage) !== 0 && (
              <ArrowButtonView
                onClick={nextPage}
              />
            )}
          </div>
        )}
      </div>
      {showPagingTools && totalPages > 1 && (
        <div className="slider-tools">
          {pages.map((page) => (
            <PageButtonView
              key={page}
              onClick={(e) => e.stopPropagation() || gotoPage(page)}
              isActive={currentPage === page}
            />
          ))}
        </div>
      )}
    </SliderViewWrapper>
  );
};

SliderView.propTypes = {
  children: PropTypes.element.isRequired,
  responsive: PropTypes.shape({
    xs: sliderPropTypes,
    sm: sliderPropTypes,
    md: sliderPropTypes,
    lg: sliderPropTypes,
  }),
  slider: sliderPropTypes,
  showPagingTools: PropTypes.bool,
};
