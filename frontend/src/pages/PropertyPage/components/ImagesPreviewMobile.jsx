import { Carousel } from '@material-tailwind/react';
import propTypes from 'prop-types';

function ImagesPreviewMobile({ images }) {
  return (
    <Carousel className="w-full h-[340px]">
      {images.map((image, index) => (
        <img
          key={index}
          loading="lazy"
          src={image.url.replace('/upload/', '/upload/q_auto/')}
          alt="property image"
          className="w-full h-full object-cover"
        />
      ))}
    </Carousel>
  );
}

ImagesPreviewMobile.propTypes = {
  images: propTypes.array,
};

export default ImagesPreviewMobile;
