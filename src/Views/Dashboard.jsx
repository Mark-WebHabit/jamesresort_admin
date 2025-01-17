import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { ResortContext } from "../DataContext";
import { getMonthDateYear } from "../utilities/date";

function Dashboard() {
  const { rooms, staffs, complaints, reservations } = useContext(ResortContext);

  const [booked, setBooked] = useState(0);
  const [available, setAvailable] = useState(0);
  const [checkin, setCheckin] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (rooms?.length <= 0) return;
    const today = getMonthDateYear(new Date());

    let reservationsCount = reservations?.filter(
      (reserve) =>
        reserve?.monthYear == today &&
        (reserve?.status == "confirmed" || reserve?.status == "checked in")
    );

    if (!reservationsCount) reservationsCount = [];

    const availableCount = rooms.length - reservationsCount.length;

    setBooked(reservationsCount.length);
    setAvailable(availableCount);
  }, [rooms, reservations]);

  useEffect(() => {
    if (reservations?.length <= 0) return;

    const checkinCount = reservations.filter(
      (ppl) => ppl.status === "checked in"
    )?.length;

    const pendingCount = reservations.filter(
      (ppl) => ppl.status === "pending"
    )?.length;
    setCheckin(checkinCount);
    setPending(pendingCount);
  }, [reservations]);

  const Card = ({ image, text }) => {
    const words = text.split(" ");

    return (
      <div className="px-14 py-8 rounded-lg flex flex-col justify-center items-center bg-[rgba(0,0,0,0.8)] max-w-[250px] ease-out duration-200 hover:scale-110">
        <img src={`/images/${image}.png`} alt="Rooms" />
        <p className="text-4xl text-white font-bold text-center mt-2">
          {words[0]}
        </p>
        <p className="text-xl text-white font-bold text-center mt-2">
          {words[1]}
        </p>
      </div>
    );
  };

  Card.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  return (
    <div className="w-full h-full grid place-items-center overflow-scroll scroll-smooth hide-scrollbar">
      <div className="flex items-center justify-center gap-4 flex-wrap ">
        <Card image={"bed"} text={`${rooms?.length} rooms`} />
        <Card image={"staff"} text={`${staffs?.length} staffs`} />
        <Card image={"booked"} text={`${booked} booked`} />
        <Card image={"available"} text={`${available} available`} />
        <Card image={"checkin"} text={`${checkin} check-in`} />
        <Card image={"complaint"} text={`${complaints?.length} complaints`} />
      </div>
    </div>
  );
}

export default Dashboard;
