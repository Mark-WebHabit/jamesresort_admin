import { Outlet, useNavigate } from "react-router-dom";
import Body from "../components/Body";
import NavLinks from "../components/NavLinks";
import { useEffect } from "react";
import { isLocalStorageTruthy } from "../utilities/extras";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const isTrue = isLocalStorageTruthy();

    if (isTrue) return;
    navigate("/");
  }, [navigate]);

  return (
    <Body>
      <div className="body w-full h-full bg-[rgba(0,0,0,0.6)] flex gap-8 p-10">
        <div className="nav w-1/2 max-w-[250px] h-full bg-[rgba(0,0,0,0.8)] rounded-lg">
          <img
            src="/images/resort_logo.png"
            alt="logo"
            className="w-8/12 bock mx-auto mb-10"
          />

          <ul className="links w-11/12 mx-auto  ">
            <NavLinks text="Dashboard" path="/home" />
            <NavLinks text="Rooms" path="/home/rooms" />
            <NavLinks text="Staff" path="/home/staff" />
            <NavLinks text="Notification" path="/home/notifs" />
            <NavLinks text="Reviews" path="/home/reviews" />

            <p className="text-white text-xl w-full block mb-4">Reports</p>
            <NavLinks text="Transactions" path="/home/transaction" />
            <NavLinks text="Revenue" path="/home/revenue" />
            <NavLinks text="Statistics" path="/home/statistics" />
            <li className="text-white text-xl text-center w-full block mb-4">
              <p
                className="px-8 py-2 font-bold text-white rounded-md w-full block ease-in-out
              duration-200 hover:scale-105"
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/");
                }}
              >
                Logout
              </p>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </Body>
  );
}

export default Home;
