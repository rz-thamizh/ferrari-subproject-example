import styled, { css } from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

export const Title1 = styled.h1`
  font-family: var(--tg-title-1-family);
  font-size: var(--tg-title-1-size);
  padding: ${asRem(20)};
`;

export const Bold = styled.b.attrs(() => ({
  className: 'rz-tg-bold-12',
}))`
  font-family: var(--tg-bold-family);
  font-weight: bold;
  ${(props) => props.small && css`
    font-size: ${asRem(12)};
    line-height: ${asRem(16)};
    letter-spacing: ${asRem(0.2)};
  `}
`;

export const Bold16 = styled(Bold).attrs(() => ({
  className: 'rz-tg-bold-16',
}))`
  font-weight: 700;
  font-size: ${asRem(16)};
  line-height: ${asRem(22)};
`;

export const Small = styled.p`
  font-family: var(--tg-family);
  font-weight: normal;
  font-size: ${asRem(12)};
  line-height: ${asRem(14)};
`;

export const Tiny = styled.small`
  font-family: var(--tg-family);
  font-weight: 500;
  font-size: ${asRem(10)};
  line-height: ${asRem(12)};
`;

export const Display30 = styled.h1.attrs(() => ({
  className: 'rz-tg-display-30',
}))`
  font-family: var(--tg-family);
  font-size: ${asRem(30)};
  line-height: ${asRem(40)};
`;

export const Display18 = styled.p.attrs(() => ({
  className: 'rz-tg-display-18',
}))`
  font-family: var(--tg-family);
  font-size: ${asRem(18)};
  line-height: ${asRem(24)};
  font-weight: 400;
`;

export const Display20 = styled.p.attrs(() => ({
  className: 'rz-tg-display-20',
}))`
  font-family: var(--tg-family);
  font-size: ${asRem(20)};
  line-height: ${asRem(28)};
  font-weight: 400;
`;

export const Display24 = styled.h4.attrs(() => ({
  className: 'rz-tg-display-24',
}))`
  font-family: var(--tg-bold-family);
  font-weight: 400;
  font-size: ${asRem(20)};
  line-height: ${asRem(28)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    font-size: ${asRem(24)};
    line-height: ${asRem(32)};
  }
`;

export const Display50 = styled.h4.attrs(() => ({
  className: 'rz-tg-display-50',
}))`
  font-family: var(--tg-family);
  font-weight: 900;
  font-size: ${asRem(50)};
  line-height: ${asRem(60)};
`;

export const DisplayMedium20 = styled.h4.attrs(() => ({
  className: 'rz-tg-display-medium-20',
}))`
  font-family: var(--tg-bold-family);
  font-weight: 500;
  font-size: ${asRem(20)};
  line-height: ${asRem(26)};
`;

export const DisplayMedium18 = styled.p.attrs(() => ({
  className: 'rz-tg-display-medium-18',
}))`
  font-family: var(--tg-family);
  font-size: ${asRem(18)};
  line-height: ${asRem(25)};
`;

export const DisplayBold20 = styled.h4.attrs(() => ({
  className: 'rz-tg-display-bold-20',
}))`
  font-family: var(--tg-bold-family);
  font-weight: bold;
  font-size: ${asRem(20)};
  line-height: ${asRem(26)};
`;

export const DisplayBold18 = styled.h4.attrs(() => ({
  className: 'rz-tg-display-bold-18',
}))`
  font-family: var(--tg-bold-family);
  font-weight: bold;
  font-size: ${asRem(18)};
  line-height: ${asRem(24)};
`;

export const DisplayBold24 = styled.h4.attrs(() => ({
  className: 'rz-tg-display-bold-24',
}))`
  font-family: var(--tg-bold-family);
  font-weight: bold;
  font-size: ${asRem(24)};
  line-height: ${asRem(32)};
`;

export const DisplayBold30 = styled(DisplayBold24).attrs(() => ({
  className: 'rz-tg-display-bold-30',
}))`
  font-size: ${asRem(20)};
  line-height: ${asRem(26)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    font-size: ${asRem(30)};
    line-height: ${asRem(40)};
  }
`;

export const DisplayBold40 = styled.h2.attrs(() => ({
  className: 'rz-tg-display-bold-40',
}))`
font-family: var(--tg-bold-family);
font-weight: 900;
font-size: ${asRem(40)};
line-height: ${asRem(53)};
`;

export const Text16 = styled.p.attrs(() => ({
  className: 'rz-tg-text-16',
}))`
  font-family: var(--tg-family);
  font-size: ${asRem(16)};
  line-height: ${asRem(22)};
`;

export const Text16Anchor = styled.a`
  font-family: var(--tg-family);
  font-size: ${asRem(16)};
  line-height: ${asRem(22)};
  text-decoration: none;
`;

export const Text14 = styled.p.attrs(() => ({
  className: 'rz-tg-text-medium-14',
}))`
  font-family: var(--tg-family);
  font-size: ${asRem(14)};
  line-height: ${asRem(20)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    font-size: ${asRem(16)};
  }
`;

export const Text12 = styled.p.attrs(() => ({
  className: 'rz-tg-label-medium-12',
}))`
  font-family: var(--tg-family);
  font-size: ${asRem(12)};
  line-height: ${asRem(16)};
`;

export const TextMedium16 = styled.p.attrs(() => ({
  className: 'rz-tg-label-medium-16',
}))`
  font-family: var(--tg-bold-family);
  font-weight: 500;
  font-size: ${asRem(16)};
  line-height: ${asRem(22)};
  letter-spacing: ${asRem(0.2)};
`;

export const TextMedium16Anchor = styled.a`
  font-family: var(--tg-bold-family);
  font-weight: 500;
  font-size: ${asRem(16)};
  line-height: ${asRem(22)};
  letter-spacing: ${asRem(0.2)};
  text-decoration: none;
`;

export const TextMedium14 = styled.p.attrs(() => ({
  className: 'rz-tg-text-medium-14',
}))`
  font-family: var(--tg-bold-family);
  font-weight: 500;
  font-size: ${asRem(14)};
  line-height: ${asRem(20)};
`;

export const TextBold14 = styled(TextMedium14).attrs(() => ({
  className: 'rz-tg-text-bold-14',
}))`
  font-weight: bold;
`;

export const TextBold16 = styled(TextMedium16).attrs(() => ({
  className: 'rz-tg-text-bold-16',
}))`
  font-weight: bold;
  letter-spacing: initial;
`;

export const LabelMedium12 = styled.span.attrs(() => ({
  className: 'rz-tg-label-medium-12',
}))`
  font-family: var(--tg-bold-family);
  font-weight: 500;
  font-size: ${asRem(12)};
  line-height: ${asRem(16)};
  letter-spacing: ${asRem(0.2)};
`;

export const LabelBold10 = styled.span`
  font-family: var(--tg-bold-family);
  font-weight: bold;
  font-size: ${asRem(10)};
  line-height: ${asRem(13)};
  letter-spacing: ${asRem(0.2)};
`;

export const DisplayBold28 = styled(DisplayBold24).attrs(() => ({
  className: 'rz-tg-display-bold-28',
}))`
  font-size: ${asRem(28)};
  line-height: ${asRem(36)};
`;
