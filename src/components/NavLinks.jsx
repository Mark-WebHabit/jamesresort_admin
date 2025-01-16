import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

function NavLinks({ text, path }) {
  return (
    <li className="text-white text-xl text-center w-full block mb-4">
      <NavLink
        to={path}
        end={path === "/home"}
        className={({ isActive }) =>
          isActive
            ? "px-8 py-2 font-bold text-white rounded-md w-full block ease-in-out duration-200 hover:scale-105 bg-[#c7c7c1]"
            : "px-8 py-2 font-bold text-white rounded-md w-full block ease-in-out duration-200 hover:scale-105"
        }
      >
        {text}
      </NavLink>
    </li>
  );
}

NavLinks.propTypes = {
  text: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default NavLinks;
