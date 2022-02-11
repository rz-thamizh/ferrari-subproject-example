import React from 'react';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { ReactComponent as VanImage } from '@/roanuz/view/imgs/DeliveryVan.svg';
import { ReactComponent as ReturnImage } from '@/roanuz/view/imgs/Warrenty.svg';
import { ReactComponent as WarrentyImage } from '@/roanuz/view/imgs/Assured.svg';
import { BottomContentView, BottomContentViewWrapper } from '@/roanuz/view/bottomContentView';

const RZPageBottomContentViewWrapper = styled(BottomContentViewWrapper)`
  margin-top: ${asRem(60)};

  background-color: var(--color-bottom-content-bg);
  color: var(--color-text-rev);
`;

export const RZPageBottomContentView = () => {
  const items = [
    {
      title: 'AFHENDING',
      subtitle: 'Fjölbreyttir möguleikar',
      desc: 'Þú getur sótt til okkar eða fengið sent. Ef pantað er fyrir hádegi virka daga á höfuðborgarsvæðinu þá er samdægurs heimsending í boði',
      image: <VanImage />,
      slug: '/afhendingarmatar',
    },
    {
      title: 'SKILAREGLUR',
      subtitle: '365 daga skilafrestur',
      desc: 'Hægt að skila vörum í 1 ár frá kaupum ef þær eru ónotaðar og í upprunalegum óskemmdum umbúðum',
      image: <ReturnImage />,
      slug: '/skilarettur',
    },
    {
      title: 'ÁBYRGÐ',
      subtitle: 'Allt að 5 ára ábyrgð',
      desc: '2-5 ára ábyrgð til neytenda samkvæmt neytendalögum og hægt að kaupa viðbótar kaskótryggingu á flestar vörur',
      image: <WarrentyImage />,
      slug: '/abyrg',
    },
  ];
  return (
    <RZPageBottomContentViewWrapper>
      <BottomContentView items={items} />
    </RZPageBottomContentViewWrapper>
  );
};

RZPageBottomContentView.propTypes = {
};
