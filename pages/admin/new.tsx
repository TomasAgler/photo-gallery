import type { NextPage } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getUser, sessionOptions } from '../../lib/session';
import { getGalleryList, initializeDatabase } from '../../lib/database';
import { GalleryForm } from '../../components/admin/gallery';
import { EmptyGalleryDetailDto } from '../../types/dto';
import { isUserAdmin } from '../../utils/auth';

export const getServerSideProps = withIronSessionSsr(
  async ({ req, locale }) => {
    const user = getUser(req);
    const database = await initializeDatabase();
    const galleryList = getGalleryList(database, user);
    if (!isUserAdmin(user)) {
      return {
        redirect: {
          destination: '/',
          statusCode: 307,
        },
        props: {
          user,
          galleryList,
        },
      };
    }
    return {
      props: {
        user,
        galleryList,
        ...(await serverSideTranslations(String(locale), ['common'])),
      },
    };
  },
  sessionOptions,
);

const NewGallery: NextPage = () => {
  return <GalleryForm data={EmptyGalleryDetailDto} isNew />;
};

export default NewGallery;
