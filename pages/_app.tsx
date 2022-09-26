import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Layout } from '../components/layout/layout.component';
import { GlobalStyle } from '../components/layout/global-style.component';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>{pageProps.gallery?.title} - Photogallery</title>
      </Head>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default appWithTranslation(MyApp);
