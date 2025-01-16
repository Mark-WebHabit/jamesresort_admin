import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  convertDateStandard,
  isWithinTwoHours,
  addHoursToDate,
} from "../utilities/date";
import { ResortContext } from "../DataContext";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";
import DataColumns from "./DataColumns";
import PaymentModal from "./PaymentModal";
import { ReservationDataContext } from "../ReservationContext";
import { deleteReservation } from "../utilities/db";
// import ShowReceipt from "./ShowReceipt";

function RoomRow({ room, filterDate }) {
  const { reservations } = useContext(ResortContext);
  const {
    checkInDate,
    setCheckOutDate,
    numHours,
    setGetUserInfo,
    setChosenRoom,
  } = useContext(ReservationDataContext);

  const [matchedReservation, setMatchedReservation] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!reservations || reservations?.length <= 0) return;

    const matchedRoom = reservations.filter(
      (res) =>
        res.room == room.id && filterDate == convertDateStandard(res.monthYear)
    );
    if (matchedRoom.length >= 1) {
      setMatchedReservation(matchedRoom[0]);
    } else {
      setMatchedReservation(null);
    }
  }, [reservations, filterDate, room.id]);

  useEffect(() => {
    if (!checkInDate) return;

    const checkOut = addHoursToDate(checkInDate, numHours);
    setCheckOutDate(checkOut);
  }, [numHours, checkInDate, setCheckOutDate]);

  const handleCheckIn = () => {
    if (!matchedReservation) return;
    if (matchedReservation.status != "confirmed") return;
    const checkInDate = matchedReservation?.startingDate;

    const valid = isWithinTwoHours(checkInDate);

    if (valid) {
      // Update the reservation status to "checked in"
      update(ref(db, "reservations/" + matchedReservation.id), {
        status: "checked in",
      })
        .then(() => {
          console.log("Reservation status updated to 'checked in'");
        })
        .catch((error) => {
          console.error("Failed to update reservation status:", error);
        });

      // Update the room status to "booked"
      update(ref(db, "rooms/" + matchedReservation.room), { status: "booked" })
        .then(() => {
          console.log("Room status updated to 'booked'");
        })
        .catch((error) => {
          console.error("Failed to update room status:", error);
        });
    } else {
      alert(
        "Check-in can only be done within 2 hours from the scheduled time."
      );
    }
  };

  const handleCheckout = () => {
    if (!matchedReservation) return;
    if (matchedReservation.status != "checked in") return;

    const confirmCheckout = window.confirm(
      "Are you sure you want to check out?"
    );
    if (!confirmCheckout) return;

    // Update the reservation status to "checked in"
    update(ref(db, "reservations/" + matchedReservation.id), {
      status: "checked out",
    })
      .then(() => {
        console.log("Reservation status updated to 'checked out'");
      })
      .catch((error) => {
        console.error("Failed to update reservation status:", error);
      });

    // Update the room status to "booked"
    update(ref(db, "rooms/" + matchedReservation.room), {
      status: "available",
    })
      .then(() => {
        console.log("Room status updated to 'available'");
      })
      .catch((error) => {
        console.error("Failed to update room status:", error);
      });
  };

  return (
    <React.Fragment>
      <DataColumns
        room={room}
        matchedReservation={matchedReservation}
        handleCheckIn={handleCheckIn}
        handleCheckout={handleCheckout}
        filterDate={filterDate}
      />
      <div className="col-span-1 flex justify-center items-center border p-4 bg-black gap-2 rounded shadow">
        {(!matchedReservation || matchedReservation.status == "pending") && (
          <button
            className="bg-green-700 p-2 rounded-full cursor-pointer"
            onClick={() => {
              setChosenRoom(room);
              setGetUserInfo(true);
            }}
          >
            <img src="/images/edit.png" alt="Edit" className="w-[25px] " />
          </button>
        )}
        {matchedReservation && matchedReservation.status != "pending" && (
          <button
            className="bg-yellow-700 p-2 rounded-full cursor-pointer"
            onClick={() => setShowPaymentModal(true)}
          >
            <img src="/images/view.png" alt="View" className="w-[25px] " />
          </button>
        )}
        {matchedReservation && matchedReservation.status == "confirmed" && (
          <button
            className="bg-red-700 p-2 rounded-full cursor-pointer"
            onClick={() => {
              deleteReservation(matchedReservation.id);
              setMatchedReservation(null);
            }}
          >
            <img src="/images/delete.png" alt="Delete" className="w-[25px] " />
          </button>
        )}
      </div>
      {showPaymentModal && (
        <PaymentModal
          matchedReservation={matchedReservation}
          roomName={room.name}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </React.Fragment>
  );
}

RoomRow.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
  }),
  filterDate: PropTypes.string,
};

export default RoomRow;
