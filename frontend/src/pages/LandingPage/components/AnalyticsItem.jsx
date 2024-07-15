import propTypes from 'prop-types';

function AnalyticsItem({ value, label }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl border-b-2 border-gray-400">{value}</h1>
      <p className="text-base">{label}</p>
    </div>
  );
}

export default AnalyticsItem;

AnalyticsItem.propTypes = {
  value: propTypes.number,
  label: propTypes.string,
};
