import type { NextPage } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getUser, sessionOptions } from '../lib/session';
import { getGalleryList, initializeDatabase } from '../lib/database';
import { CustomProps } from '../types/pages';
import { GalleryList } from '../components/item-list/gallery-list.component';

export const getServerSideProps = withIronSessionSsr(
  async ({ req, locale }) => {
    const user = getUser(req);
    const database = await initializeDatabase();
    const galleryList = getGalleryList(database, user);
    return {
      props: {
        galleryList,
        user,
        ...(await serverSideTranslations(String(locale), ['common'])),
      },
    };
  },
  sessionOptions,
);

const Home: NextPage = ({ galleryList }: CustomProps) => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('all-galeries')}</h1>
      <GalleryList galleries={galleryList} />
    </div>
  );
};

export default Home;
