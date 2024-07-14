import propTypes from 'prop-types';
import Footer from './Footer';

function TransparentLayoutWrapper({ children }) {
  return (
    <>
      <div className="w-full px-[114px] py-6 max-w-[1432px] mx-auto max-xl:px-8 max-md:px-4 max-sm:px-4  mb-32">
        {children}
      </div>
      <Footer />
    </>
  );
}

TransparentLayoutWrapper.propTypes = {
  children: propTypes.node,
};

export default TransparentLayoutWrapper;
