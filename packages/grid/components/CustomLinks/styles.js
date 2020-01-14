import styled from 'styled-components';
import { grayLight, blue, grayLighter } from '@bufferapp/ui/style/colors';
import { borderRadius } from '@bufferapp/ui/style/borders';
import { Button } from '@bufferapp/ui';

export const DEFAULT_COLOR = '#000000';
export const DEFAULT_CONTRAST_COLOR = '#FFFFFF';

export const MyLinksSection = styled.div`
  width: 100%;
  border-radius: ${borderRadius};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const PreviewWrapper = styled.div`
  display: flex;
  position: relative;
  border-bottom: 1px solid ${grayLight};
  border-bottom: ${props =>
    props.index === props.totalLinks - 1 ? 'none' : `1px solid ${grayLight}`};
  transition: all 0.3s ease-in-out;
  box-shadow: ${props => (props.isTarget ? `0px 0px 4px 4px ${blue}` : 'none')};

  ::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-radius: 3px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s ease-in-out;
  }

  ${({ hasWriteAccess }) => hasWriteAccess && `
    :hover {
      cursor: move;
      transform: scale(1, 1);
      ::after {
        opacity: 1;
      }
    }
  `}
`;

export const LinkPreviewRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px;
  font-size: 14px;
  color: #636363;
  min-width: 0;
`;

export const MyLinksBody = styled.div`
  border: ${props => (props.total === 0 ? 'none' : `1px solid ${grayLight}`)};
  margin-top: 15px;
`;

export const Separator = styled.div`
  border-top: 1px solid ${grayLight};
  margin-top: 15px;
`;

export const EditingMyLinksItem = styled.div`
  display: flex;
  padding: 8px;
  background-color: ${grayLighter};
`;

export const LinkUrlInput = styled.div`
  margin: 8px;
  flex: 1;
`;

export const LinkTextInput = styled.div`
  margin: 8px;
  width: 230px;
`;

export const UrlPreview = styled.div`
  margin-left: 14px;
  flex-basis: 402px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 15px 15px;
  background-color: ${grayLighter};
`;

export const StyledButton = styled(Button)`
  :focus {
    box-shadow: none;
  }
`;
