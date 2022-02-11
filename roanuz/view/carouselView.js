import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

import { Button } from '@/roanuz/view/button';
import { ReactComponent as LeftArrowIcon } from '@/roanuz/view/imgs/LeftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@/roanuz/view/imgs/RightArrow.svg';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setWindowDimensions(getWindowDimensions());
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const CarouselLayoutWrapper = styled.div`

  ${(p) => p.padded && css`
    margin-top: ${asRem(40)};
  `}

  .left-arrow, .right-arrow {
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    width: ${asRem(48)};
    height: ${asRem(48)};
    background: transparent;
    display: none;
  }

  .left-arrow {
    left: ${asRem(-25)};
  }

  .right-arrow {
    right: ${asRem(-25)};
  }
  .carousel-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    ${(p) => (p.settings && p.settings.dots) && css`
      padding-bottom: ${asRem(50)};
    `}
  }

  .carousel-wrapper {
    display: flex;
    width: 100%;
    position: relative;
  }

  .carousel-content-wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .carousel-content {
    display: flex;
    transition: all 250ms linear;
    -ms-overflow-style: none;  /* hide scrollbar in IE and Edge */
    scrollbar-width: none;  /* hide scrollbar in Firefox */
    > * {
      width: 100%;
      flex-shrink: 0;
      flex-grow: 1;
    }
    &.show-6 > * {
      width: calc(100% / 6);
    }
    &.show-5 > * {
      width: calc(100% / 5);
    }
    &.show-4 > * {
      width: calc(100% / 4);
    }
    &.show-3 > * {
      width: calc(100% / 3);
    }
    &.show-2 > * {
      width: 50%;
    }
  }

  /* hide scrollbar in webkit browser */
  .carousel-content::-webkit-scrollbar, .carousel-content::-webkit-scrollbar {
    display: none;
  }

  .carousel-dots {
    position: absolute;
    bottom: -25px;
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center;
    li {
      margin-right: 0.5rem;
      width: ${asRem(8)};
      height: ${asRem(8)};
      display: inline-block;
      button {
        padding: 0px;
        width: ${asRem(8)};
        height: ${asRem(8)};
        &:before {
          content: "";
          background-color: var(--color-grey);
          border-radius: 50%;
          width: ${asRem(8)};
          height: ${asRem(8)};
          opacity: .25;
          color: #000;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      }
      &.active {
        button:before {
          background-color: var(--color-button);
          opacity: 1;
        }
      }
    }
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    .carousel-dots {
      display: none;
    }
    .left-arrow, .right-arrow {
      display: inherit;
    }
    .carousel-container {
      padding-bottom: 0;
    }
  }
`;

export const CarouselView = ({ children, settings, padded }) => {
  const { infiniteLoop } = settings || {
    show: 3,
    infiniteLoop: true,
  };
  const [show, setSlidesToShow] = useState(settings.show);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(infiniteLoop ? show : 0);
  const [length, setLength] = useState(children.length);
  const [pageLength, setPageLength] = useState(1);
  const [currentPage, setPageIndex] = useState(1);

  const [isRepeating, setIsRepeating] = useState(infiniteLoop && children.length > show);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const [touchPosition, setTouchPosition] = useState(null);

  useEffect(() => {
    if (width > 767 && width < 1194) {
      setSlidesToShow(settings.responsive[768].show);
    } else if (width < 768) {
      setSlidesToShow(settings.responsive[480].show);
    } else {
      setSlidesToShow(settings.show);
    }
  }, [width, settings]);

  // Set the length to match current children from props
  useEffect(() => {
    setLength(children.length);
    setPageLength(Math.ceil(children.length / show));
    setIsRepeating(infiniteLoop && children.length > show);
  }, [children, infiniteLoop, show, pageLength]);

  useEffect(() => {
    if (isRepeating) {
      if (currentIndex === show || currentIndex === length) {
        setTransitionEnabled(true);
      }
    }
  }, [currentIndex, isRepeating, show, length]);

  const next = () => {
    if (isRepeating || currentIndex < (length - show)) {
      setCurrentIndex((prevState) => prevState + show);
      setPageIndex((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (isRepeating || currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - show);
      setPageIndex((prevState) => prevState - 1);
    }
  };

  const slideToPage = (index) => {
    setPageIndex(index);
    const targetIndex = index * show;
    if (targetIndex < children.length) {
      setCurrentIndex(index * show);
    } else {
      setCurrentIndex(index - 1 * show);
    }
  };

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;
    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  };

  const handleTransitionEnd = () => {
    if (isRepeating) {
      if (currentIndex === 0) {
        setTransitionEnabled(false);
        setCurrentIndex(length);
      } else if (currentIndex === length + show) {
        setTransitionEnabled(false);
        setCurrentIndex(show);
      }
    }
  };

  const renderExtraPrev = () => {
    const output = [];
    for (let index = 0; index < show; index += 1) {
      output.push(children[length - 1 - index]);
    }
    output.reverse();
    return output;
  };

  const renderExtraNext = () => {
    const output = [];
    for (let index = 0; index < show; index += 1) {
      output.push(children[index]);
    }
    return output;
  };

  const renderDots = () => {
    const output = [];
    for (let index = 0; index < pageLength; index += 1) {
      output.push(
        <li
          className={index === currentPage ? 'active' : ''}
          key={index}
        >
          <Button
            mode="primary"
            noborder
            className="dot"
            onClick={() => { slideToPage(index); }}
            ariaLabel="Right Arrow Button"
          />
        </li>,
      );
    }
    return output;
  };

  return (
    <CarouselLayoutWrapper padded={padded}>
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {/* You can alwas change the content of the button to other things */}
          {
            (isRepeating || currentIndex > 0)
            && settings.arrows
            && (
            <Button
              icon={<LeftArrowIcon />}
              mode="primary"
              noborder
              className="left-arrow"
              onClick={prev}
              ariaLabel="Left Arrow Button"
            />
            )
          }
          <div
            className="carousel-content-wrapper"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div
              className={`carousel-content show-${show}`}
              style={{
                transform: `translateX(-${currentIndex * (100 / show)}%)`,
                transition: !transitionEnabled ? 'none' : undefined,
              }}
              onTransitionEnd={() => handleTransitionEnd()}
            >
              {
                (length > show && isRepeating)
                && renderExtraPrev()
              }
              {children}
              {
                (length > show && isRepeating)
                && renderExtraNext()
              }
            </div>
          </div>
          {/* You can alwas change the content of the button to other things */}
          {
            (isRepeating || currentIndex < (length - show))
            && settings.arrows
            && (
            <Button
              icon={<RightArrowIcon />}
              mode="primary"
              noborder
              className="right-arrow"
              onClick={next}
              ariaLabel="Right Arrow Button"
            />
            )
          }
          {
            settings.dots
            && (
            <ul className="carousel-dots">
              {
                pageLength && renderDots()
              }
            </ul>
            )
          }
        </div>
      </div>
    </CarouselLayoutWrapper>
  );
};

CarouselView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  settings: PropTypes.shape({
    show: PropTypes.number || 5,
    infiniteLoop: PropTypes.bool,
    arrows: PropTypes.bool,
    dots: PropTypes.bool,
    responsive: PropTypes.shape({
      768: PropTypes.shape({
        show: PropTypes.number || 3,
      }),
      480: PropTypes.shape({
        show: PropTypes.number || 2,
      }),
    }),
  }),
  padded: PropTypes.bool,
};
