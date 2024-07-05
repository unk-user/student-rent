function Header() {
  return (
    <header className="w-full flex justify-between items-center py-[10px] px-2 max-md:px-4 max-w-[1432px] mx-auto">
      <h1 className="text-xl max-sm:text-lg font-medium text-dark-blue">
        UROOM
      </h1>
      <p className="max-sm:hidden ml-auto">Here to post rent?</p>
      <a className="ml-3 max-sm:text-sm text-blue-300 hover:underline hover:cursor-pointer">
        Login as an owner
      </a>
    </header>
  );
}

export default Header;
