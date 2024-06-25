import { CiBellOn, CiSettings } from "react-icons/ci";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";

const NavBar = () => {
  return (
    <div className="navbar bg-[#F4F3F3]">
      <div className="navbar-start">
        <div className="dropdown">
          <div>
            <a className="btn text-[#7E2CE1] text-xl border-none bg-[#F4F3F3]">
              Inventory Buddy
            </a>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input w-24 md:w-auto bg-[#F4F3F3] border-[#7E2CE1] rounded-full px-16 py-0 h-7 text-start"
          />
        </div>
      </div>
      <div className="navbar-end pr-4">
        <div className="btn hover:bg-white text-[#7E2CE1] bg-[#F4F3F3] border-none text-2xl shadow-none p-2 ">
          <HiOutlineChatBubbleOvalLeft />
        </div>
        <button className="btn hover:bg-white text-[#7E2CE1] bg-[#F4F3F3] border-none text-2xl shadow-none p-2 ">
          <div className="indicator">
            <CiBellOn />
          </div>
        </button>
        <button className="btn text-[#7E2CE1] bg-[#F4F3F3] border-none text-2xl shadow-none p-2 ">
          <CiSettings />
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar text-white flex justify-center"
          >
            <div className="w-10 rounded-full bg-[#7E2CE1] "></div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
