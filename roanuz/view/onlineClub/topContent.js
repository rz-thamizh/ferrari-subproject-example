import React from 'react';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { DisplayBold30 } from '@/roanuz/typopgraphy';

const TopContentWrapper = styled.div`
  border-bottom: 1px solid  var(--color-border-2);  
  padding: ${asRem(20)} 0;
  margin-bottom: ${asRem(30)};
`;

export const TopContent = () => {
  return (
    <TopContentWrapper>
      <DisplayBold30 as="h1">
        Netklúbbur
      </DisplayBold30>
    </TopContentWrapper>
  );
};
