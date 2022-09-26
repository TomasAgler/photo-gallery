import type { NextPage } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getUser, sessionOptions } from '../../../lib/session';
import {
  getGalleryDetail,
  getGalleryList,
  initializeDatabase,
} from '../../../lib/database';
import { CustomProps } from '../../../types/pages';
import { GalleryForm } from '../../../components/admin/gallery';
import { EmptyGalleryDetailDto } from '../../../types/dto';
import { isUserAdmin } from '../../../utils/auth';

export const getServerSideProps = withIronSessionSsr(async (context) => {
  const { req, locale } = context;
  const { id } = context.query;
  const user = getUser(req);
  const database = await initializeDatabase();
  const galleryList = getGalleryList(database, user);
  const galleryDetail = getGalleryDetail(database, user, String(id));
  if (!isUserAdmin(user) || !galleryDetail) {
    return {
      redirect: {
        destination: '/',
        statusCode: 307,
      },
      props: {
        user,
        galleryList,
        gallery: EmptyGalleryDetailDto,
      },
    };
  }
  return {
    props: {
      user,
      galleryList,
      gallery: galleryDetail,
      ...(await serverSideTranslations(String(locale), ['common'])),
    },
  };
}, sessionOptions);

const AdminGallery: NextPage = ({ gallery }: CustomProps) => {
  return <GalleryForm data={gallery || EmptyGalleryDetailDto} />;
};

export default AdminGallery;
