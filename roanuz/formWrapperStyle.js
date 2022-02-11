import styled from 'styled-components';
import { withDependencySupport } from './lib/dep';

const BaseFormWrapperStyle = styled.div`
`;

export const FormWrapperStyle = withDependencySupport(BaseFormWrapperStyle, 'FormWrapperStyle');
