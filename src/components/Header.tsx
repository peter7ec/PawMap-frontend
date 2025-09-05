import { Link } from "react-router";
import { useContext, useState } from "react";
import { User2 } from "lucide-react";
import headerLogo from "../assets/petHouseLogo.png";
import AuthContext from "../contexts/AuthContext";
import MobileView from "./MobileMenu";
import DropdownMenu from "./DropDownMenu";

export default function Header() {
  const [navigationMenuOpened, setNavigationMenuOpened] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const auth = useContext(AuthContext);

  return (
    <header className=" flex items-center justify-between px-6 md:px-10 h-16 shadow-md">
      <div className="flex items-center gap-2 md:gap-2">
        <img
          className="w-10 h-10  md:w-14 md:h-14"
          src={headerLogo}
          alt="logo"
        />
        <Link to="/" className="font-bold text-lg md:text-2xl text-black ">
          PawMap
        </Link>
      </div>

      <nav className="hidden md:flex gap-6 font-bold ">
        <Link className="hover:underline" to="/">
          Home
        </Link>
        <Link className="hover:underline" to="/search">
          Search Locations
        </Link>
        <Link className="hover:underline" to="/eventSearch">
          Search Events
        </Link>
        <Link className="hover:underline" to="/about">
          About
        </Link>
        <Link className="hover:underline" to="/contact">
          Contact
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {!auth?.user?.id ? (
          <Link to="/login" className="hover:underline font-bold">
            Sign In
          </Link>
        ) : (
          <DropdownMenu
            dropDownOpened={dropdownOpen}
            setDropDownOpened={setDropdownOpen}
          >
            {auth.user.profile_avatar ? (
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={auth.user.profile_avatar}
                alt="profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            ) : (
              <User2
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            )}
          </DropdownMenu>
        )}
      </div>
      <div className="md:hidden">
        <MobileView
          navigationMenuOpened={navigationMenuOpened}
          setNavigationMenuOpened={setNavigationMenuOpened}
        />
      </div>
    </header>
  );
}
