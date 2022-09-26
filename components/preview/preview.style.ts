import styled from '@emotion/styled';

export const GalleryPreviewWrapper = styled.div`
  backgroud: white;
  position: relative;
  cursor: pointer;
  padding: 20px;
  border-radius: 25px;
  transition: background 0.2s ease-in;
  &:hover {
    background: lightblue;
  }
`;

export const GalleryPreviewTitle = styled.div`
  font-size: 3em;
  font-family: sans-serif;
  color: white;
  text-shadow: 3px 3px 6px black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
