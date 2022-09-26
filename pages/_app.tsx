import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Layout } from '../components/layout/layout.component';
import { GlobalStyle } from '../components/layout/global-style.component';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default appWithTranslation(MyApp);
