import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Button } from '@/roanuz/view/button';
import { DisplayBold20 } from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const MobileFilterViewWrapper = styled.div`
  position: fixed;
  top: 0;
  left: -${asRem(340)};
  bottom: 0;
  overflow-y: auto;
  background: #FFFFFF;
  box-shadow: 0px 0px 12px rgba(51, 51, 51, 0.18);
  padding: ${asRem(20)};
  z-index: 998;
  width: ${asRem(280)};
  transition: all .3s ease-in-out;  
  &.show {
    left: 0;
  }
  >.section-filter {
    .filter-heading {
      padding-bottom: ${asRem(20)};
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rz-svg-icon {
        padding-right: 0;
      }

      .rz-button {
        padding-right: 0;
      }
    }

    @media screen and (min-width: ${Breakpoint.sm}) {
      position: initial;
      top: auto;
      left: auto;
      z-index: auto;
      background-color: transparent;
      border-radius: var(--color-card-radius);

      .filter-heading {
        display: none;
      }
    }    
  }
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  bottom: 0;
  background-color: rgba(51, 51, 51, 0.48);
  z-index: 8;
  opacity: 0;
  ${(p) => p.show && css`
    opacity: 1;
    width: 100%;
  `}
`;

export const MobileFilterView = ({ filter, mobileFilterVisible, onCloseFilterModal }) => {
  const [showFilterModal, setShowFilterModal] = useState(mobileFilterVisible);
  useEffect(() => {
    setShowFilterModal(mobileFilterVisible);
  }, [mobileFilterVisible]);

  return (
    <>
      <ModalBackground
        show={showFilterModal}
        onClick={onCloseFilterModal}
      />
      <MobileFilterViewWrapper className={`hide-desktop ${showFilterModal ? 'show' : ''}`}>
        <div className="section-filter">
          <div className="filter-heading">
            <DisplayBold20>Vörusía</DisplayBold20>
            <Button
              noborder
              onClick={onCloseFilterModal}
              mode="primary"
            >
              Staðfesta
            </Button>
          </div>
          {filter}
        </div>
      </MobileFilterViewWrapper>
    </>
  );
};

MobileFilterView.propTypes = {
  filter: PropTypes.element,
  mobileFilterVisible: PropTypes.bool,
  onCloseFilterModal: PropTypes.func,
};
