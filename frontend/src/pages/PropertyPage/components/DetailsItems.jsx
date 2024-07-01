import propTypes from 'prop-types';

function DetailsItem({ icon, label, children }) {
  return (
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">{label}</p>
        <span className="flex items-center gap-1 text-sm">
          {icon}
          {children}
        </span>
      </div>
  );
}

DetailsItem.propTypes = {
  icon: propTypes.node,
  label: propTypes.string,
  children: propTypes.node,
};

export default DetailsItem;
