import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Button } from '@/roanuz/view/button';
import { UserConsumer } from '@/store/core/context';
import {
  DisplayBold24,
  DisplayBold20,
} from '@/roanuz/typopgraphy';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseMyAccountViewWrapper = styled.div`
  padding-top: ${asRem(20)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    padding-top: ${asRem(40)};
  }
  h1 {
    padding-top: ${asRem(18)};
    padding-bottom: ${asRem(18)};
  }

  .page-section-quick-links {
    display: block;
  }

  >.row-wrapper {
    display: flex;
    flex-direction: column;

    .top-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: ${asRem(20)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        padding-bottom: ${asRem(40)};
      }
      border-bottom: solid 1px var(--color-disabled-3);
    }
  }
`;

export const MyAccountView = ({ pageTitle }) => {
  return (
    <MyAccountViewWrapper>
      <UserConsumer>
        {({ logoutUser }) => (
          <Row className="row-wrapper">
            <Col className="top-container">
              <DisplayBold24>{pageTitle}</DisplayBold24>
              <div className="page-section-quick-links">
                <Button
                  onClick={() => logoutUser()}
                  noborder
                  mode="primary"
                  nomargin
                  ariaLabel="Logout"
                >
                  <DisplayBold20>
                    Útskrá
                  </DisplayBold20>
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </UserConsumer>
    </MyAccountViewWrapper>
  );
};

MyAccountView.propTypes = {
  pageTitle: PropTypes.string,
};

export const MyAccountViewWrapper = withDependencySupport(BaseMyAccountViewWrapper, 'MyAccountViewWrapper');
