import dynamic from 'next/dynamic';
import Image from 'next/image';
import IconPlay from '@mui/icons-material/PlayArrow';
import { Video } from '../../types/database';
import { VideoOverlay, VideoOverlayIcon } from './photo.style';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

type GalleryVideoProps = {
  data?: Video;
  size?: 'thumbnail' | 'sm' | 'lg';
};

export const GalleryVideo = ({ data, size }: GalleryVideoProps) => {
  if (!data) {
    return <div />;
  }
  const width = size === 'thumbnail' ? 160 : size === 'sm' ? 550 : 1920;
  const height = size === 'thumbnail' ? 100 : size === 'sm' ? 300 : 1080;
  return (
    <div>
      {size !== 'lg' && (
        <VideoOverlay>
          <Image
            src={data.thumbnailUrl}
            width={width}
            height={height}
            alt='video'
          />
          <VideoOverlayIcon small={size === 'thumbnail'}>
            <IconPlay />
          </VideoOverlayIcon>
        </VideoOverlay>
      )}
      {size === 'lg' && (
        <ReactPlayer url={data.url} width={width} height={height} />
      )}
    </div>
  );
};
