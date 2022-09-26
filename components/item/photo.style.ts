import styled from '@emotion/styled';

export const ItemWrapper = styled.div`
  background: white;
  cursor: pointer;
  padding: 20px;
  transition: background 0.2s ease-in;
  border-radius: 25px;
  &:hover {
    background: lightblue;
  }
`;

export const GalleryItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  height: 100%;
`;

export const VideoOverlay = styled.div`
  position: relative;
`;

export const VideoOverlayIcon = styled.div<{ small: boolean }>`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  color: white;
  svg {
    width: ${({ small }) => (small ? '32' : '64')}px;
    height: ${({ small }) => (small ? '32' : '64')}px;
  }
`;

export const ControlWrapper = styled.div<{ position: 'left' | 'right' }>`
  ${({ position }) => {
    if (position === 'left') {
      return 'left: 0;';
    }
    return 'right: 0;';
  }}
  cursor: pointer;
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  color: #fff;
  text-align: center;
  opacity: 0.5;
  &:hover,
  &:focus {
    ${({ position }) => {
      if (position === 'left') {
        return 'background: linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);';
      }
      return 'background: linear-gradient(270deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);';
    }}
    color: #fff;
    text-decoration: none;
    outline: 0;
    opacity: 0.9;
  }
`;

export const ControlButton = styled.span`
  display: inline-block;
  svg {
    width: 50px;
    height: 50px;
  }
`;
