import { useContext, useState } from "react";
import TableHeaderStaff from "../components/TableHeaderStaff";
import { StaffDataContext } from "../StaffContext";
import Staffs from "../components/Staffs";

import SwitchShift from "../components/SwitchShift";
import EmployeeInfo from "../components/EmployeeInfo";
import AddStaff from "../components/AddStaff";
import HighBookings from "../components/HighBookings";

function Staff() {
  const { showSwitchShift, employeeInfo, addEmployee, setAddEMployee } =
    useContext(StaffDataContext);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col h-full overflow-scroll hide-scrollbar">
      {!employeeInfo && !addEmployee && (
        <>
          <div className="flex h-fit w-full justify-between items-center">
            <div className="flex  items-center gap-4">
              <div className="flex bg-white h-[50px] px-2 w-[250px] items-center rounded-md">
                <img
                  src="/images/search.png"
                  alt="search"
                  className="w-[30px]"
                />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 h-full w-full border-none focus:outline-none pl-2"
                />
              </div>

              <p
                className={`text-2xl text-white font-bold font-sans cursor-pointer ${
                  page === 1 ? "bg-[rgba(0,0,0,0.5)]" : "bg-[#c7c7c1]"
                }  py-2 px-4 rounded`}
                onClick={() => setPage(1)}
              >
                Overview
              </p>
              <p
                className={`text-2xl text-white font-bold font-sans cursor-pointer ${
                  page === 2 ? "bg-[rgba(0,0,0,0.5)]" : "bg-[#c7c7c1]"
                }  py-2 px-4 rounded`}
                onClick={() => setPage(2)}
              >
                High Bookings
              </p>
            </div>

            <div className="add-employee">
              <button
                className="px-12 py-2 bg-[#8e8e8d] text-white text-2xl font-bold rounded-md"
                onClick={() => setAddEMployee(true)}
              >
                Add
              </button>
            </div>
          </div>

          <div
            className={`${
              page === 1 ? "table" : "flex"
            }  flex-1 border-4 overflow-hidden mt-2 hide-scrollbar p-4 bg-white`}
          >
            {page === 1 ? (
              <div className="grid grid-cols-5 gap-0 h-full">
                <TableHeaderStaff />
                <Staffs search={search} />
              </div>
            ) : (
              <HighBookings />
            )}
          </div>
        </>
      )}

      {showSwitchShift && <SwitchShift />}
      {employeeInfo && <EmployeeInfo />}
      {addEmployee && <AddStaff />}
    </div>
  );
}

export default Staff;
