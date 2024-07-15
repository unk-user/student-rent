import AnalyticsItem from './AnalyticsItem';

function AnalyticsSection() {
  return (
    <div className="w-full max-w-[1432px] mx-auto py-12 px-24 grid grid-cols-3 gap-24 max-xl:px-12 max-md:gap-12 max-sm:gap-4 max-sm:grid-cols-1 text-xl text-dark-blue">
      <AnalyticsItem value="200" label="properties listed in various cities" />
      <AnalyticsItem value="329" label="users satisfied on average" />
      <AnalyticsItem value="400" label="created posts by students" />
    </div>
  );
}

export default AnalyticsSection;
