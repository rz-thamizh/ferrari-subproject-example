/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Easing, getTime } from '@/roanuz/lib/easing';
import { useMediaMatchedConfig, createBreakpointConfig } from '@/roanuz/lib/css';
import { ArrowButtonView, DotButtonView } from './tools';
import { SweetSliderWrapper } from './style';
import { SweetSliderItemView } from './item';

export const SweetSlider = ({
  items,
  columns = 0,
  scrollAnimationDuration = 750,
  useAnimatedScroll = true,
  showPageArrows = true,
  showPageDots = false,
  showProgressBar = true,
  showDebugger = false,
  space = '0px',
  responsive = {},
}) => {
  const [sliderState, setSliderState] = useState({
    pages: [],
    positions: [],
    nextIndex: null,
    prevIndex: null,
    nextScroll: null,
    prevScroll: null,
    firstVisibleIndex: null,
    currentPage: null,
  });
  const [progressPosition, setProgressPosition] = useState({
    progressWidth: 0,
    progressLeft: 0,
  });
  const [progressBarDragging, setProgressBarDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationId, setAnimationId] = useState(null);
  const [inTransition, setInTransition] = useState(false);
  const ele = useRef(null);

  const defaultConfig = {
    showPageArrows,
    showPageDots,
    showProgressBar,
    scrollAnimationDuration,
    columns,
    space,
  };

  const config = useMediaMatchedConfig(defaultConfig, responsive);
  const allConfig = createBreakpointConfig(defaultConfig, responsive);
  const configForWidth = {};
  Object.keys(allConfig).forEach((bk) => {
    configForWidth[bk] = {
      columns: allConfig[bk].columns,
      space: allConfig[bk].space,
    };
  });

  const setupSlider = () => {
  };

  const onObserved = () => {
    setTimeout(() => {
      if (!inTransition) {
        requestAnimationFrame(() => {
          buildElementPosition();
        });
      }

    // Need a better way to wait for scroll to complete.
    }, 300);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  });

  useEffect(() => {
    let observer = null;
    if (IntersectionObserver && ele.current) {
      setupSlider();
      observer = new IntersectionObserver(onObserved, {
        root: ele.current,
      });
      Array.from(ele.current.children).forEach((child) => {
        observer.observe(child);
      });

      onScroll();
    }

    return () => {
      if (IntersectionObserver && observer && observer.disconnect) {
        // console.log('Disconnecting scroll observer');
        observer.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ele]);

  const onScroll = () => {
    const el = ele.current;
    const box = el.getBoundingClientRect();
    const sw = el.scrollWidth;
    const cw = box.width;
    const left = el.scrollLeft;

    const progressWidth = (cw / sw) * 100;
    const progressLeft = (left / sw) * 100;
    const updates = {
      progressWidth,
      progressLeft,
    };
    setProgressPosition({
      ...progressPosition,
      ...updates,
    });
  };

  const buildElementPosition = () => {
    const el = ele.current;
    const box = el.getBoundingClientRect();
    // const cw = el.clientWidth;
    const cw = box.width;
    // const offset = el.offsetLeft;
    const offset = box.left;
    const sw = el.scrollWidth;
    const left = el.scrollLeft;

    const maxScrollLeft = sw - cw;

    const visibleArea = [left, left + cw];
    const positions = [];

    // Identify child visible state
    Array.from(el.children).forEach((child) => {
      const childBox = child.getBoundingClientRect();
      // const childWidth = child.clientWidth;
      const childWidth = childBox.width;
      // const childLeft = child.offsetLeft - offset;
      const childLeft = childBox.left + left - offset;
      const childRight = childLeft + childWidth;
      const childArea = [childLeft, childRight];
      let visibleState = 'left';
      if (childArea[0] >= visibleArea[0]) {
        if (childArea[1] <= visibleArea[1]) {
          visibleState = 'visible';
        } else if (childArea[0] >= visibleArea[1]) {
          visibleState = 'right';
        } else {
          visibleState = 'partial';
        }
      } else if (childArea[1] > visibleArea[0]) {
        visibleState = 'partial-left';
      }
      positions.push({
        right: childLeft + childWidth,
        left: childLeft,
        visible: visibleState,
      });
    });

    // console.log('Positions');
    // console.table(positions);

    // Identify Scroll positions
    let firstVisibleIndex = null;
    let firstPartialLeftIndex = null;
    let firstPartialIndex = null;
    let possiblePrevScroll = null;
    let nextIndex = null;
    positions.forEach((position, i) => {
      if (
        firstVisibleIndex === null
        && position.visible === 'visible'
      ) {
        firstVisibleIndex = i;
      }

      if (
        firstPartialLeftIndex === null
        && position.visible === 'partial-left'
      ) {
        firstPartialLeftIndex = i;
      }

      if (
        firstPartialIndex === null
        && position.visible === 'partial'
      ) {
        firstPartialIndex = i;
      }

      if (
        nextIndex === null
        && (position.visible === 'partial' || position.visible === 'right')
      ) {
        nextIndex = i;
      }
    });

    // Nothing is fully visible
    if (firstVisibleIndex === null) {
      firstVisibleIndex = (firstPartialIndex !== null) ? firstPartialIndex : firstPartialIndex;
    }

    if (firstVisibleIndex !== null) {
      possiblePrevScroll = Math.max(0, positions[firstVisibleIndex].left - cw);
    }

    let prevIndex = null;
    if (possiblePrevScroll !== null) {
      positions.forEach((position, i) => {
        if (prevIndex == null && position.left >= possiblePrevScroll) {
          prevIndex = i;
        }
      });
    }

    const nextScroll = nextIndex !== null && Math.min(maxScrollLeft, positions[nextIndex].left);
    const prevScroll = prevIndex !== null && Math.max(0, positions[prevIndex].left);

    // Identify possible pages
    const pages = [];
    let currentPage = null;
    let pagedScroll = 0;
    let maxRight = cw;
    let scrollingItems = [];
    positions.forEach((position, i) => {
      const isLast = i === (positions.length - 1);
      const fullyVisible = (
        position.left >= pagedScroll
        && position.right <= maxRight
      );

      if ((!isLast) && fullyVisible) {
        scrollingItems.push(i);
      } else {
        if (isLast && fullyVisible) {
          scrollingItems.push(i);
        }

        const createPage = () => {
          if (scrollingItems.length === 0) return;
          pagedScroll = position.left;
          maxRight = pagedScroll + cw;
          const firstItemIndex = scrollingItems[0];
          const lastItemIndex = scrollingItems[scrollingItems.length - 1];
          if (firstItemIndex <= firstVisibleIndex && firstVisibleIndex <= lastItemIndex) {
            currentPage = pages.length;
          }
          pages.push({
            first: firstItemIndex,
            last: lastItemIndex,
            scroll: Math.min(maxScrollLeft, positions[firstItemIndex].left),
          });
          scrollingItems = [i];
        };

        createPage();
        if (isLast && !fullyVisible) {
          createPage();
        }
      }
    });

    const showPrevPage = prevIndex !== null && left > positions[0].left;
    const showNextPage = nextIndex !== null && currentPage !== (pages.length - 1);
    // console.log('Pages', firstVisibleIndex);
    // console.table(pages);

    const newState = {
      showPrevPage,
      showNextPage,
      firstVisibleIndex,
      nextIndex,
      prevIndex,
      nextScroll,
      prevScroll,
      positions,
      pages,
      currentPage,
    };

    // console.log('State updated');
    setSliderState({
      ...sliderState,
      ...newState,
    });

    return newState;
  };

  const animate = (to, duration, easing) => {
    const start = ele.current.scrollLeft;
    const end = to;
    const el = ele.current;

    if (!useAnimatedScroll || !requestAnimationFrame) {
      ele.current.scrollLeft = to;
      return;
    }

    if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }

    setInTransition(true);

    const delta = end - start;
    const startTime = getTime();
    const animateLoop = (time) => {
      const t = (!time ? 0 : time - startTime);
      const factor = easing(null, t, 0, 1, duration);
      el.scrollLeft = start + delta * factor;
      if (t < duration && el.scrollLeft !== end) {
        const newAnimationId = requestAnimationFrame(animateLoop);
        setAnimationId(newAnimationId);
      } else {
        // console.log('Animation Completed');
        // Make sure its moved to end
        el.scrollLeft = end;
        setInTransition(false);
        buildElementPosition();
      }
    };
    animateLoop();
  };

  const scrollTo = (to) => {
    animate(to, config.scrollAnimationDuration, Easing.easeOutQuad);
  };

  const goNext = () => {
    if (sliderState.nextScroll) {
      scrollTo(sliderState.nextScroll);
    }
  };
  const goPrev = () => {
    if (sliderState.prevScroll !== null) {
      scrollTo(sliderState.prevScroll);
    }
  };
  const gotoPageIndex = (index) => {
    scrollTo(sliderState.pages[index].scroll);
  };

  const onProgressBarClick = (e) => {
    if (progressBarDragging) return;
    if (e.target.className !== 'full-bar') return;

    const el = ele.current;
    const box = el.getBoundingClientRect();
    const sw = el.scrollWidth;
    const cw = box.width;

    let scrollX = (e.clientX - ele.current.getBoundingClientRect().left) * (sw / cw);
    const maxX = sliderState.positions[sliderState.positions.length - 1].left;
    scrollX = Math.min(scrollX, maxX);

    if (scrollX < 0) {
      scrollX = 0;
    }

    // console.log('Click Move', scrollX, e.clientX, ele.current.getBoundingClientRect().left);
    scrollTo(scrollX);
  };

  const onProgressBarDragging = (e) => {
    // if (!progressBarDragging) return;
    // console.log('E', e);
    if (e.movementX) {
      const el = ele.current;
      const box = el.getBoundingClientRect();
      const sw = el.scrollWidth;
      const cw = box.width;
      ele.current.scrollLeft += (sw / cw) * (e.movementX);
    }
  };

  const onMouseMove = (e) => {
    // console.log('Mouse move', e);
    onProgressBarDragging(e);
  };
  const onMouseUp = (event) => {
    // console.log('Mouse up', event);
    event.stopPropagation();
    event.preventDefault();
    setProgressBarDragging(false);
    document.body.style.cursor = 'default';

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onProgressBarMouseDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    // console.log('Mouse down begin x', event.clientX - event.target.getBoundingClientRect().left);
    document.body.style.cursor = 'grabbing';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    setProgressBarDragging(true);
  };

  const hasPages = sliderState.pages.length > 1;
  // console.log('Config', config, responsive);

  return (
    <SweetSliderWrapper
      progressBarDragging={progressBarDragging}
      showPageArrows={hasPages && config.showPageArrows}
    >
      <div className="sweetslider-container">
        {hasPages && config.showPageArrows && (
          <div className="arrow-item arrow-left">
            {sliderState.showPrevPage && (
              <ArrowButtonView
                onClick={goPrev}
              />
            )}
          </div>
        )}
        <div
          className="sweetslider-container-items"
          ref={ele}
          onScroll={onScroll}
        >
          {items.map((item, index) => (
            <SweetSliderItemView
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              config={configForWidth}
              isLastItem={(index + 1) === items.length}
            >
              {item}
            </SweetSliderItemView>
          ))}
        </div>
        {hasPages && config.showPageArrows && (
          <div className="arrow-item arrow-right">
            {sliderState.showNextPage && (
              <ArrowButtonView
                onClick={goNext}
              />
            )}
          </div>
        )}
      </div>
      {hasPages && config.showPageDots && (
        <div className="pager-dots-container">
          {sliderState.pages.map((page, index) => (
            <DotButtonView
              key={page.first}
              onClick={() => { gotoPageIndex(index); }}
              isActive={index === sliderState.currentPage}
            />
          ))}
        </div>
      )}
      {hasPages && config.showProgressBar && (
        <div
          className="sweetslider-progress-bar"
          onClick={onProgressBarClick}
        >
          <div
            className="full-bar"
          >
            <div
              className="active-bar"
              style={{
                width: `${progressPosition.progressWidth}%`,
                transform: `translateX(${(100.0 / progressPosition.progressWidth) * progressPosition.progressLeft}%)`,
              }}
              onMouseDown={onProgressBarMouseDown}
            />
          </div>
        </div>
      )}
      {showDebugger && (
        <div className="sweetslider-debugger">
          <div>
            {sliderState.showPrevPage && (
              <button
                type="button"
                onClick={goPrev}
              >
                Fyrri:
                {sliderState.prevIndex}
              </button>
            )}
            {sliderState.showNextPage && (
              <button
                type="button"
                onClick={goNext}
              >
                Næst:
                {sliderState.nextIndex}
              </button>
            )}
          </div>
          <div>
            Current:
            {sliderState.currentPage}
          </div>
          <div>
            {sliderState.pages.map((page, index) => (
              <button
                key={page.first}
                type="button"
                onClick={() => { gotoPageIndex(index); }}
              >
                {page.first}
                {`(${index})`}
                {index === sliderState.currentPage && (
                  <span>*</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </SweetSliderWrapper>
  );
};

const ResponsiveProps = {
  scrollAnimationDuration: PropTypes.number,
  showPageArrows: PropTypes.bool,
  showPageDots: PropTypes.bool,
  showProgressBar: PropTypes.bool,
  space: PropTypes.string,
  columns: PropTypes.number,
};

SweetSlider.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
  useAnimatedScroll: PropTypes.bool,
  showDebugger: PropTypes.bool,
  scrollAnimationDuration: PropTypes.number,
  ...ResponsiveProps,
  responsive: PropTypes.shape({
    xs: PropTypes.shape({ ...ResponsiveProps }),
    sm: PropTypes.shape({ ...ResponsiveProps }),
    md: PropTypes.shape({ ...ResponsiveProps }),
    lg: PropTypes.shape({ ...ResponsiveProps }),
  }),
};
