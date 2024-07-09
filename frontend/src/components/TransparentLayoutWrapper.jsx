import propTypes from 'prop-types';

function TransparentLayoutWrapper({ children }) {
  return (
    <div className="w-screen h-full px-[114px] py-6 max-w-[1432px] mx-auto max-xl:px-10 max-md:px-8 max-sm:px-6">
      {children}
    </div>
  );
}

TransparentLayoutWrapper.propTypes = {
  children: propTypes.node,
};

export default TransparentLayoutWrapper;
