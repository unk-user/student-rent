import { Button, Carousel, Dialog, IconButton } from '@material-tailwind/react';
import { Cancel01Icon, Image01Icon } from 'hugeicons-react';
import propTypes from 'prop-types';
import { useState } from 'react';
function ImagesPreview({ images }) {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(!openDialog);

  return (
    <div className="grid grid-cols-5 grid-rows-2 w-full gap-4 max-md:gap-2 max-sm:gap-1 h-1/2">
      <div className="col-span-3 row-span-2 bg-gray-600 aspect-[1.618]">
        <img
          src={images[0].url.replace('/upload/', '/upload/q_auto/')}
          alt="property-image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-gray-600 col-span-2 row-span-1 overflow-hidden">
        <img
          src={images[1].url.replace(
            '/upload/',
            '/upload/q_auto,ar_2.3,c_crop/'
          )}
          className="object-cover h-full"
        />
      </div>
      <div className="bg-gray-600 col-span-2 row-span-1 overflow-hidden relative">
        <img
          src={images[2]?.url.replace(
            '/upload/',
            '/upload/q_auto,ar_2.3,c_crop/'
          )}
          className="object-cover h-full"
        />
        <div className="absolute right-3 bottom-4">
          <Button
            size="sm"
            ripple={false}
            onClick={handleOpen}
            className="text-black bg-white focus:!opacity-100 active:scale-[0.99] flex items-center gap-1 rounded-[6px] shadow-md"
          >
            <Image01Icon size={24} />
            <span className="leading-7 !text-xs">View all photos</span>
          </Button>
          <Dialog
            open={openDialog}
            handler={handleOpen}
            className="!w-screen !max-w-none !h-screen rounded-none !m-0 px-[98px] max-xl:px-10 max-md:px-0"
          >
            <div className="max-w-[1304px] relative mx-auto w-full h-full py-8 px-[50px] max-xl:px-10 max-md:px-8 flex items-center">
              <IconButton
                onClick={handleOpen}
                className="!absolute !top-4 !right-4 rounded-none"
                size='sm'
                variant="text"
              >
                <Cancel01Icon size={28} />
              </IconButton>
              <Carousel className="max-h-[600px]">
                {images?.map((image) => (
                  <img
                    key={image.publicId}
                    loading='lazy'
                    src={image.url.replace('/upload/', '/upload/q_auto/')}
                    alt="property-image"
                    className="w-full h-full object-cover"
                  />
                ))}
              </Carousel>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

ImagesPreview.propTypes = {
  images: propTypes.array,
};

export default ImagesPreview;
