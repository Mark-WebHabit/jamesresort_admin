import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { convertDateStandard } from "../utilities/date";

function DataColumns({
  room,
  matchedReservation,
  handleCheckIn,
  handleCheckout,
  filterDate,
}) {
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (!matchedReservation) {
      setIsBooked(false);
      return;
    }

    if (
      convertDateStandard(matchedReservation?.monthYear) === filterDate &&
      matchedReservation.status !== "pending" &&
      matchedReservation.status !== "checked out"
    ) {
      setIsBooked(true);
    } else {
      setIsBooked(false);
    }
  }, [filterDate, matchedReservation]);

  return (
    <>
      <p className="col-span-1 flex justify-center items-center border p-4 bg-black text-white rounded shadow">
        {room.name}
      </p>
      <p
        className={`col-span-1 flex justify-center items-center border p-4 ${
          !isBooked ? "bg-green-700" : "bg-red-700"
        } text-white rounded shadow uppercase`}
      >
        {isBooked ? "Booked" : "Available"}
      </p>
      <p
        className={`col-span-1 flex justify-center items-center border p-4 font-bold text-xl ${
          matchedReservation
            ? matchedReservation.status === "pending"
              ? "bg-black"
              : matchedReservation.status === "confirmed"
              ? "bg-yellow-700"
              : matchedReservation.status === "checked in"
              ? "bg-red-700"
              : matchedReservation.status === "checked out"
              ? "bg-red-700"
              : "bg-black"
            : "bg-black"
        } text-white rounded shadow`}
        onClick={() => handleCheckIn()}
      >
        {matchedReservation
          ? matchedReservation.status == "pending"
            ? "-"
            : matchedReservation.status == "confirmed"
            ? "Check in"
            : matchedReservation.status == "checked in"
            ? "Checked In"
            : matchedReservation.status == "checked out"
            ? "Checked In"
            : "-"
          : "-"}
      </p>
      <p
        className={`col-span-1 flex justify-center items-center border p-4 text-white rounded shadow font-bold text-xl ${
          matchedReservation
            ? matchedReservation.status === "checked out"
              ? "bg-red-700"
              : matchedReservation.status === "checked in"
              ? "bg-yellow-600"
              : "bg-black"
            : "bg-black"
        }`}
        onClick={handleCheckout}
      >
        {matchedReservation
          ? matchedReservation.status === "checked out"
            ? "Checked out"
            : matchedReservation.status === "checked in"
            ? "Check out"
            : "-"
          : "-"}
      </p>
    </>
  );
}

DataColumns.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
  }),
  matchedReservation: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    monthYear: PropTypes.string,
  }),
  handleCheckIn: PropTypes.func,
  handleCheckout: PropTypes.func,
  filterDate: PropTypes.string,
};

export default DataColumns;
