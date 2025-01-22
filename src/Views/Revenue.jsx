import { getCurrentMonthAndYear } from "../utilities/date";
import { months } from "../utilities/date";
import RevenueContent from "../components/RevenueContent";
import RevenueContentWithData from "../components/RevenueContentWIthData";
import RevenueHeader from "../components/RevenueHEader";
import { useContext, useEffect, useState } from "react";
import { ResortContext } from "../DataContext";

function Revenue() {
  const { month, year } = getCurrentMonthAndYear();
  const { reservations, rooms } = useContext(ResortContext);
  const [roomGrouped, setRoomGrouped] = useState([]);
  const [selectedReservationSpan, setSelectedReservationSpan] = useState([]);
  const [entranceFeeTotal, setEntranceFeeTotal] = useState(0);
  const [ammenitiesTotal, setAmmenitiesTotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!reservations || reservations.length <= 0) return;
    const thisMonthReservation = reservations.filter((val) => {
      const my = val.monthYear.split(" ");
      const reservationMonth = my[0];
      const reservationYear = my[2];
      return (
        months[month] === reservationMonth && reservationYear === String(year)
      );
    });

    setSelectedReservationSpan(thisMonthReservation);
  }, [reservations, month, year]);

  useEffect(() => {
    if (!rooms || rooms?.length <= 0) return;

    function groupRoomsByCategory(rooms) {
      return rooms.reduce((grouped, room) => {
        const category = room.category;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(room);
        return grouped;
      }, {});
    }

    setRoomGrouped(groupRoomsByCategory(rooms));
  }, [rooms]);

  return (
    <div className="flex flex-col flex-1 bg-black bg-opacity-80 rounded-md overflow-scroll hide-scrollbar p-4">
      <div className="flex gap-4">
        <RevenueHeader text={"Resort Name"} />
        <RevenueHeader text={"Month/year"} />
      </div>

      <div className="flex gap-4 mt-2">
        <RevenueContent text={"James G Hotel And Resort"} />
        <RevenueContent text={months[month] + " " + year} />
      </div>

      <div className="flex gap-4 mt-2">
        <RevenueHeader text={"Room Revenue"} />
      </div>
      {roomGrouped &&
        Object.keys(roomGrouped).map((categ) => {
          return (
            <div className="flex gap-4 mt-2" key={categ}>
              <RevenueContent text={categ} room={categ} />
              <RevenueContentWithData
                categ={categ}
                selectedReservationSpan={selectedReservationSpan}
                room={rooms[categ]}
                setEntranceFeeTotal={setEntranceFeeTotal}
                setAmmenitiesTotal={setAmmenitiesTotal}
                setTotal={setTotal}
              />
            </div>
          );
        })}

      <div className="flex gap-4 mt-2">
        <RevenueHeader text={"Other"} />
      </div>
      <div className="flex gap-4 mt-2">
        <RevenueContent text={"Entrance Fee Revenue"} />
        <RevenueContent text={`Php ${entranceFeeTotal}`} />
      </div>
      <div className="flex gap-4 mt-2">
        <RevenueContent text={"Ammenities Revenue"} />
        <RevenueContent text={`Php ${ammenitiesTotal}`} />
      </div>
      <div className="flex gap-4 mt-2">
        <RevenueHeader text={"Total"} />
        <RevenueHeader text={`Php ${total}`} />
      </div>
    </div>
  );
}

export default Revenue;
