import QueryOption from './QueryOption';

function OptionBar() {
  return (
    <div className="bg-white h-12 flex items-center gap-3 text-base">
      <QueryOption label="Best matches" to="./best-matches" />
      <QueryOption label="Most recent" to="./most-recent" />
      <QueryOption label="My posts" to="./my-posts" />
      <div className="h-full flex-1 border-b-2 border-gray-300"></div>
    </div>
  );
}

export default OptionBar;
