import PropTypes from "prop-types";
import { formatDateTime } from "../utilities/date";
import { useState } from "react";
import { ref, update, get } from "firebase/database";
import { db } from "../../firebase";

function PaymentModal({ matchedReservation, roomName, onClose }) {
  const [payment, setPayment] = useState("");

  const handleConfirm = () => {
    const paymentAmount = parseFloat(payment);
    if (
      isNaN(paymentAmount) ||
      paymentAmount < 0 ||
      paymentAmount > matchedReservation.totalFee
    ) {
      alert(
        "Invalid payment amount. Please enter a value between 0 and the total fee."
      );
      return;
    }

    // Get the current reservation data to check if 'paid' property exists
    get(ref(db, "reservations/" + matchedReservation.id))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const existingData = snapshot.val();
          const currentPaid = existingData.paid || 0;
          const updatedPaid = currentPaid + paymentAmount;
          const updatedTotalFee = matchedReservation.totalFee - paymentAmount;

          const updateData = {
            totalFee: updatedTotalFee,
            paid: updatedPaid,
          };

          update(ref(db, "reservations/" + matchedReservation.id), updateData)
            .then(() => {
              alert("Payment confirmed and reservation updated!");
              onClose();
            })
            .catch((error) => {
              console.error("Failed to update reservation:", error);
              alert("Failed to update reservation.");
            });
        } else {
          alert("Reservation not found.");
        }
      })
      .catch((error) => {
        console.error("Failed to get reservation data:", error);
        alert("Failed to get reservation data.");
      });
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-[rgba(255,255,255,0.3)] grid place-items-center">
      <div className="w-[500px] border-2 rounded-lg border-black bg-white flex flex-col">
        <div className="flex justify-between items-center">
          <p className="text-center text-3xl font-bold my-2 flex-1">
            Room Check in
          </p>
          <button
            onClick={onClose}
            className="text-red-500 font-bold p-2 ml-4 text-2xl"
          >
            X
          </button>
        </div>
        <div className="receipt flex-1 grid grid-cols-2">
          <div className="col-span-1 border-2 my-2 p-4">
            <p className="text-xl mb-2 h-[40px]">Customer Name</p>
            <p className="text-xl mb-2 h-[40px]">Room</p>
            <p className="text-xl mb-2 h-[40px]">Check In</p>
            <p className="text-xl mb-2 h-[40px]">Check out</p>
            {matchedReservation?.paid && (
              <p className="text-xl mb-2 h-[40px]">Paid</p>
            )}
            {matchedReservation?.reference && (
              <p className="text-xl mb-2 h-[40px]">DP Ref#</p>
            )}
            <p className="text-xl mb-2 h-[40px]">Remaining Price</p>
          </div>
          <div className="col-span-1 border-2 my-2 p-4">
            <p className="text-xl mb-2 h-[40px]">{matchedReservation.client}</p>
            <p className="text-xl mb-2 h-[40px]">{roomName}</p>
            <p className="text-sm mb-2 h-[40px]">
              {formatDateTime(matchedReservation.startingDate)}
            </p>
            <p className="text-sm mb-2 h-[40px]">
              {formatDateTime(matchedReservation.endingDate)}
            </p>
            {matchedReservation?.paid && (
              <p className="text-xl mb-2 h-[40px]">
                {matchedReservation?.paid}
              </p>
            )}
            {matchedReservation?.reference && (
              <p className="text-xs mb-2 h-[40px]">
                {matchedReservation.reference}
              </p>
            )}
            <p className="text-xl mb-2 h-[40px]">
              {matchedReservation.totalFee}
            </p>
          </div>
        </div>

        <label className="flex items-center w-9/12 mx-auto my-2">
          Payment
          <input
            type="number"
            className="flex-1 ml-4 py-2 px-4 rounded border border-black"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          />
        </label>
        <button
          onClick={handleConfirm}
          className="w-fit bg-[#6ccee6] px-12 py-2 block mx-auto my-4"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

PaymentModal.propTypes = {
  matchedReservation: PropTypes.object.isRequired,
  roomName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PaymentModal;
