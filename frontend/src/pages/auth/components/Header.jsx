function Header() {
  return (
    <header className="w-full flex justify-between items-center py-[10px] px-2 sm:px-4 max-w-[1600px] mx-auto">
      <h1 className="text-xl font-medium text-dark-blue">UROOM</h1>
      <p className="flex flex-col sm:flex-row">
        Here to post rent?
        <a className="sm:ml-3 text-blue-300 hover:underline hover:cursor-pointer">
          Login as an owner
        </a>
      </p>
    </header>
  );
}

export default Header;
