import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { asRem } from '@/roanuz/lib/css';

const PrivacyLinksViewWrapper = styled.div`
  padding: ${asRem(20)} 0;
  padding-bottom: ${asRem(100)};
  ul {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    li {
      &:last-child {
        span {
          display: none;
        }
      }
    }
  }
`;

export const PrivacyLinksView = () => {
  const links = [
    { name: 'Viðskiptaskilmálar', href: '/vidskiptaskilmalar', alt: 'Links to Viðskiptaskilmálar' },
    { name: 'Vafrakökur', href: '/vafrakokur', alt: 'Links to Vafrakökur' },
  ];
  return (
    <PrivacyLinksViewWrapper className="rz-page-content">
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
    </PrivacyLinksViewWrapper>
  );
};

PrivacyLinksView.propTypes = {
};
