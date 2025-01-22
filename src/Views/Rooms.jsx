import { useContext, useEffect, useState } from "react";
import { ResortContext } from "../DataContext";
import TableHeader from "../components/TableHeader";
import RoomRow from "../components/RoomRow";
import GetReservationSummary from "../components/GetReservationSummary";
import { ReservationDataContext } from "../ReservationContext";
import GetUserInfo from "../components/GetUserInfo";
import ShowReceipt from "../components/ShowReceipt";

function Rooms() {
  const {
    getUserInfo,
    getReservationSummary,
    setGetReservationSummary,
    showReceipt,
  } = useContext(ReservationDataContext);
  const { rooms, staffs } = useContext(ResortContext);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Initial value
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [shift, setShift] = useState("day");

  useEffect(() => {
    if (rooms) {
      setFilteredRooms(
        rooms.filter((room) =>
          room.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [rooms, search]);

  const toggleShift = () => {
    setShift((prevShift) => (prevShift === "day" ? "night" : "day"));
  };

  return (
    <div className="flex flex-col h-full overflow-scroll hide-scrollbar">
      <div className="flex h-fit w-full justify-between items-center">
        <div className=" flex items-center gap-4">
          <div className="flex bg-white h-[50px] px-2 w-[250px] items-center rounded-md">
            <img src="/images/search.png" alt="search" className="w-[30px]" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 h-full w-full border-none focus:outline-none pl-2"
            />
          </div>

          <div
            className="w-[200px] h-[50px] bg-white rounded-md relative grid place-items-center cursor-pointer"
            onClick={() => setShowStaffModal(true)}
          >
            <p className="text-center">Staff</p>
          </div>
        </div>
        <div className="monthYear">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 rounded-md"
          />
        </div>
      </div>
      <div className="table flex-1 border-4 overflow-hidden mt-2 hide-scrollbar p-4 bg-white">
        <div className="grid grid-cols-5 gap-0 h-full">
          <TableHeader />
          {filteredRooms.map((room) => (
            <RoomRow key={room.id} room={room} filterDate={filterDate} />
          ))}
        </div>
      </div>

      {showReceipt && <ShowReceipt />}

      {getReservationSummary && (
        <GetReservationSummary
          onBack={() => {
            setGetReservationSummary(false);
            // setGetUserInfo(true);
          }}
        />
      )}

      {getUserInfo && <GetUserInfo />}

      {showStaffModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Staff List</h2>
            <div className="mb-4">
              <button
                onClick={toggleShift}
                className="px-10 py-2 bg-blue-500 text-white rounded-md"
              >
                {shift === "day" ? "Night" : "Day"} Shift
              </button>
            </div>
            <ul>
              {staffs
                ?.filter((emp) =>
                  shift == "day"
                    ? emp.current == "DAY - 8:00AM - 8:00PM"
                    : emp.current == "NIGHT - 8:00PM - 8:00AM"
                )
                ?.map((staff) => (
                  <li key={staff.id} className="mb-2">
                    {staff.name}
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setShowStaffModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
