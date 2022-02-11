import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { asRem, Breakpoint } from '../../lib/css';

const ProductSpecLayoutWrapper = styled.div`
`;

export const ProductSpecLayout = ({ children }) => {
  return (
    <ProductSpecLayoutWrapper>
      {children}
    </ProductSpecLayoutWrapper>
  );
};

ProductSpecLayout.propTypes = {
  children: PropTypes.element,
};

export const BaseProductSpecGroupLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${asRem(40)};

  div {
    &:first-child {
      min-width: ${asRem(240)};
      padding-right: ${asRem(20)};
    }

    &:nth-child(2) {
      flex: 1;
    }
  }
    

  @media screen and (min-width: ${Breakpoint.sm}) {
    flex-direction: row;
  }
`;

export const ProductSpecGroupLayout = ({ groupName, children }) => {
  return (
    <ProductSpecGroupLayoutWrapper>
      <div>{groupName}</div>
      <div>{children}</div>
    </ProductSpecGroupLayoutWrapper>
  );
};

ProductSpecGroupLayout.propTypes = {
  groupName: PropTypes.element,
  children: PropTypes.element,
};

export const BaseProductSpecLineLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${asRem(10)} ${asRem(20)};
  div {
    :first-child {
      min-width: ${asRem(200)};
      padding-right: ${asRem(20)};
    }
  }

  &:nth-child(odd) {
    background-color: var(--color-disabled-5);
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    flex-direction: row;
  }
`;

export const ProductSpecLineLayout = ({ label, children }) => {
  return (
    <ProductSpecLineLayoutWrapper>
      <div>{label}</div>
      <div>{children}</div>
    </ProductSpecLineLayoutWrapper>
  );
};

ProductSpecLineLayout.propTypes = {
  label: PropTypes.element,
  children: PropTypes.element,
};

export const ProductSpecGroupLayoutWrapper = withDependencySupport(BaseProductSpecGroupLayoutWrapper, 'ProductSpecGroupLayoutWrapper');
export const ProductSpecLineLayoutWrapper = withDependencySupport(BaseProductSpecLineLayoutWrapper, 'ProductSpecLineLayoutWrapper');
