import { Global, css } from '@emotion/react';

export const GlobalStyle = () => {
  return (
    <Global
      styles={css`
        body {
          font-family: sans-serif;
        }
      `}
    />
  );
};
