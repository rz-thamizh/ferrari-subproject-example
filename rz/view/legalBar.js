import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { asRem } from '@/roanuz/lib/css';

const RZLegalBarViewWrapper = styled.div`
  margin-bottom: ${asRem(54)};
  text-align: right;
  font-size: ${asRem(16)};
  line-height: ${asRem(20)};
  padding: ${asRem(20)} var(--space-page-side-padding) 0;
  ul {
    display: flex;
    justify-content: flex-end;
    li {
      span {
        color: var(--color-disabled);
      }

      &:last-child {
        span {
          display: none;
        }
      }
    }
  }
`;

export const RZLegalBarView = () => {
  const links = [
    { name: 'Viðskiptaskilmálar', href: '/privacy-policy-cookie-restriction-mode', alt: 'Links to Viðskiptaskilmálar' },
    { name: 'Vafrakökur', href: '/page/vafrakokur', alt: 'Links to Vafrakökur' },
  ];
  return (
    <RZLegalBarViewWrapper className="rz-page-content">
      <ul>
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} prefetch={false}>
              <a alt={link.alt} className="plain">{link.name}</a>
            </Link>
            {/* Design only had space not padding 🤷‍♀️ */}
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          </li>
        ))}
      </ul>
    </RZLegalBarViewWrapper>
  );
};

RZLegalBarView.propTypes = {
};
