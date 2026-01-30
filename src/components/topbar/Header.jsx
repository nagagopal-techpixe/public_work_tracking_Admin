// import { Menu, ChevronDown, Bell } from "lucide-react";
// import React, { useState, useContext } from "react";
// import { ThemeContext } from "../../utils/ThemeContexr";
// import { User, Settings, HelpCircle, LogOut } from "lucide-react";

// export default function Header({ toggleSidebar, sidebar }) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { Header } = useContext(ThemeContext);

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   return (
//     <header
//       className="z-[9999] h-[80px] fixed top-0 right-0 text-white flex items-center justify-between px-4 transition-all duration-500 ease-in-out"
//       style={{
//         backgroundColor: Header,
//         width: sidebar ? "calc(100% - 20vw)" : "calc(100% - 70px)",
//         marginLeft: sidebar ? "20vw" : "70px",
//       }}
//     >
//       {/* Sidebar toggle */}
//       <button
//         onClick={toggleSidebar}
//         className="p-2 rounded-md hover:bg-white/10 transition-all duration-300"
//       >
//         <Menu className="w-6 h-6" />
//       </button>
//       <button
//         onClick={toggleSidebar}
//         className="p-2 rounded-md hover:bg-white/10 transition-all duration-300"
//       >
//         <Bell className="w-6 h-6" />
//       </button>

//       {/* Right side profile */}
//       <div className="relative">
//         <button
//           onClick={toggleDropdown}
//           className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition-all duration-300"
//         >
//           {/* Profile icon */}
//           <div className="w-12 h-12 rounded-full overflow-hidden">
//             <img
//               src="/Component 12.png"
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <span className="text-sm font-medium">CHILUKA BHANU TEJA</span>
//           <ChevronDown
//             className={`transition-transform duration-300 ${
//               dropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {/* Dropdown menu */}
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn">
//             <ul>
//               <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2">
//                 <Settings className="w-5 h-5" />
//                 Settings
//               </li>
//               <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2">
//                 <LogOut className="w-5 h-5" />
//                 Logout
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
import { Menu, ChevronDown, Bell, LogOut } from "lucide-react";
import React, { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Header({ toggleSidebar, sidebar }) {
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { Header } = useContext(ThemeContext);
  const { auth, handleLogout } = useContext(AuthContext);

  const headerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setBellOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`z-[9999] h-[80px] bg-[#34658C] fixed top-0 right-0 text-white flex items-center justify-between px-4 transition-all duration-500 ease-in-out w-full 
        ${
          sidebar
            ? "md:ml-[18vw] md:w-[calc(100%-18vw)]"
            : "md:ml-[80px] md:w-[calc(100%-80px)]"
        }`}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Right profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((s) => !s)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={auth.profileUrl || "/assets/profiledefault.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-sm font-semibold">
              {auth.full_name || "Admin"}
            </span>

            <ChevronDown
              className={`transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
              <ul>
                <li>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="px-4 py-2 hover:bg-gray-200 flex items-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                </li>

                <li
                  onClick={() => {
                    setProfileOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Logout confirmation */}
      {logoutOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[99999]">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h1 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h1>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  handleLogout();
                  setLogoutOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setLogoutOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
