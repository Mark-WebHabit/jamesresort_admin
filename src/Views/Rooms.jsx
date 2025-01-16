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
  const { rooms } = useContext(ResortContext);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Initial value

  useEffect(() => {
    if (rooms) {
      setFilteredRooms(
        rooms.filter((room) =>
          room.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [rooms, search]);

  return (
    <div className="flex flex-col h-full overflow-scroll hide-scrollbar">
      <div className="flex h-fit w-full justify-between items-center">
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
    </div>
  );
}

export default Rooms;
