import React from 'react';
import styled from 'styled-components';
import { ReactComponent as CartIcon } from '@/roanuz/view/imgs/CartIcon.svg';
import { ReactComponent as HeartIcon } from '@/roanuz/view/imgs/HeartIcon.svg';
import { Button, ButtonList } from './button';

export default {
  title: 'View / Button',
  component: Button,
};

const Template = (args) => (
  <Button {...args}>Normal</Button>
);

const AllWrapper = styled.div`
  ul {
    li {
      display: block;
      padding: 10px 20px;
    }
  }
`;
export const All = () => (
  <AllWrapper>
    <ul>
      <li>
        <Button>Normal</Button>
      </li>
      <li>
        <Button mode="primary">Primary</Button>
      </li>
      <li>
        <Button mode="sale">Sale</Button>
      </li>
      <li>
        <Button mode="special">Special</Button>
      </li>
      <li>
        <Button noborder>Noborder</Button>
      </li>
      <li>
        <Button mode="primary" noborder>Noborder (P)</Button>
      </li>
      <li>
        <Button mode="link" noborder>Noborder (L)</Button>
      </li>
      <li>
        <Button disabled>Disabled</Button>
      </li>
      <li>
        <Button mode="sale" icon={<CartIcon />}>With Icon</Button>
      </li>
      <li>
        <Button icon={<HeartIcon />} noborder />
        <hr />
      </li>
      <li>
        <ButtonList>
          <Button mode="sale" icon={<CartIcon />}>With Icon</Button>
          <Button icon={<HeartIcon />} noborder />
        </ButtonList>
        <hr />
      </li>
      <li>
        <ButtonList reverse>
          <Button mode="sale" icon={<CartIcon />}>With Icon</Button>
          <Button icon={<HeartIcon />} noborder />
        </ButtonList>
        <hr />
      </li>
      <li>
        <ButtonList asList>
          <Button mode="sale" icon={<CartIcon />}>With Icon</Button>
          <Button mode="sale" icon={<HeartIcon />} noborder />
        </ButtonList>
        <hr />
      </li>
      <li>
        <ButtonList asList block>
          <Button mode="primary">Save</Button>
          <Button mode="normal" icon={<HeartIcon />}>Later</Button>
        </ButtonList>
        <hr />
      </li>
    </ul>
  </AllWrapper>
);

export const Normal = Template.bind({});
Normal.args = {};
