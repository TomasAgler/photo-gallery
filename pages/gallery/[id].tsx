import type { NextPage } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getUser, sessionOptions } from '../../lib/session';
import {
  getGalleryDetail,
  getGalleryList,
  initializeDatabase,
} from '../../lib/database';
import { CustomProps } from '../../types/pages';
import { ItemList } from '../../components/item-list/item-list.component';
import { isUserAllowed } from '../../utils/auth';

export const getServerSideProps = withIronSessionSsr(async (context) => {
  const { req, locale } = context;
  const { id } = context.query;
  const user = getUser(req);
  const database = await initializeDatabase();
  const galleryList = getGalleryList(database, user);
  const galleryDetail = getGalleryDetail(database, user, String(id));
  return {
    props: {
      galleryList,
      gallery: galleryDetail,
      user,
      requestAuth: !isUserAllowed(user, String(id)),
      ...(await serverSideTranslations(String(locale), ['common'])),
    },
  };
}, sessionOptions);

const Home: NextPage = ({ gallery }: CustomProps) => {
  const { t } = useTranslation('common');
  return (
    <>
      <h1>{gallery?.title}</h1>
      <ItemList items={gallery?.items || []} gallery={String(gallery?.id)} />
    </>
  );
};

export default Home;
