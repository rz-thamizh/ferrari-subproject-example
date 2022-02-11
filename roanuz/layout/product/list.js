import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { Button } from '@/roanuz/view/button';
import { ReactComponent as LeftArrowIcon } from '@/roanuz/view/imgs/LeftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@/roanuz/view/imgs/RightArrow.svg';

const ProductListLayoutWrapper = styled.div`
  display: flex;

  > div {
    margin-right: ${asRem(45)};
    &:last {
      margin-right: 0;
    }
  }
`;

export const ProductListLayout = ({ children }) => {
  return (
    <ProductListLayoutWrapper>
      {children}
    </ProductListLayoutWrapper>
  );
};

ProductListLayout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

const NextArrowButton = ({
  className,
  style,
  onClick,
}) => {
  return (
    <Button
      icon={<RightArrowIcon />}
      mode="primary"
      noborder
      className={className}
      style={{ ...style }}
      onClick={onClick}
      ariaLabel="Right Arrow Button"
    />
  );
};

NextArrowButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

const PrevArrowButton = ({
  className,
  style,
  onClick,
}) => {
  return (
    <Button
      icon={<LeftArrowIcon />}
      mode="primary"
      noborder
      className={className}
      style={{ ...style }}
      onClick={onClick}
      ariaLabel="Left Arrow Button"
    />
  );
};

PrevArrowButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};
