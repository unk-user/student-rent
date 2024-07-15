import FooterListItem from './FooterListItem';
import {
  Facebook02Icon,
  InstagramIcon,
  Linkedin02Icon,
} from 'hugeicons-react';

function Footer() {
  return (
    <div className="w-full p-3">
      <footer className="p-20 rounded-md bg-dark-blue text-white">
        <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-y-2">
          <ul>
            <FooterListItem to="/" label="About Us" />
            <FooterListItem to="/" label="Feedback" />
            <FooterListItem to="/" label="Community" />
          </ul>
          <ul>
            <FooterListItem to="/" label="trust, Safety & Security" />
            <FooterListItem to="/" label="Help & Support" />
            <FooterListItem to="/" label="UROOM Foundation" />
          </ul>
          <ul>
            <FooterListItem to="/" label="Terms of  Service" />
            <FooterListItem to="/" label="Privacy Policy" />
            <FooterListItem to="/" label="Cookie Settings" />
          </ul>
          <ul>
            <FooterListItem to="/" label="Accessibility" />
            <FooterListItem to="/" label="Cookie Policy" />
          </ul>
        </div>
        <div className="flex items-center mt-4 w-full py-2 border-b-2">
          <p className="text-sm mr-2">Follow Us</p>
          <a className="border-2 mr-1">
            <Facebook02Icon size={20} />
          </a>
          <a className="border-2 mr-1">
            <Linkedin02Icon size={20} />
          </a>
          <a className="border-2">
            <InstagramIcon size={20} />
          </a>
        </div>
        <div className="text-sm text-center mt-3">© 2024 UROOM</div>
      </footer>
    </div>
  );
}

export default Footer;
