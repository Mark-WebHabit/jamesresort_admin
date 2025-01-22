import { useContext } from "react";
import { ReservationDataContext } from "../ReservationContext";
import { getMonthDateYear, getTimeInAMPM } from "../utilities/date";
import { ammenities, tourFeee } from "../utilities/extras";

function ShowReceipt() {
  const {
    checkInDate,
    checkOutDate,
    numberOfGuest,
    chosenRoom,
    dayTour,
    beds,
    pillows,
    comforter,
    request,
    cancelReservation,
    handleConfirm,
    reference,
  } = useContext(ReservationDataContext);

  const bedFee = ammenities.bed * beds;
  const pillowFess = ammenities.pillow * pillows;
  const comforterFee = ammenities.comforter * comforter;
  const guestFee =
    dayTour === true
      ? numberOfGuest * tourFeee.day
      : numberOfGuest * tourFeee.overnight;

  console.log(dayTour, numberOfGuest, tourFeee);

  const subTotal =
    bedFee + pillowFess + comforterFee + guestFee + chosenRoom.price;

  return (
    <div className="w-screen h-screen fixed top-0 left-0 grid place-items-center bg-black bg-opacity-50">
      <div className="wrapper w-full max-w-[500px] p-8 rounded-xl bg-black bg-opacity-90">
        <h1 className="text-white text-3xl font-bold text-center mb-4">
          Details
        </h1>
        <div className="text-white text-lg">
          <div className="flex justify-between">
            <strong>Check-in Date:</strong>
            <span>{getMonthDateYear(checkInDate)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Check-out Date:</strong>
            <span>{getMonthDateYear(checkOutDate)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Check-in Time:</strong>
            <span>{getTimeInAMPM(checkInDate)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Check-out Time:</strong>
            <span>{getTimeInAMPM(checkOutDate)}</span>
          </div>
          <div className="flex justify-between">
            <strong>No. of Guests:</strong>
            <span>{numberOfGuest}</span>
          </div>
          <div className="flex justify-between">
            <strong>Room:</strong>
            <span>{chosenRoom.name}</span>
          </div>
          <div className="flex justify-between">
            <strong>Guest Fee:</strong>
            <span>₱{guestFee}</span>
          </div>
          <div className="flex justify-between">
            <strong>Room Fee:</strong>
            <span>₱{chosenRoom.price}</span>
          </div>
          <div>
            <strong>Additional Amenities:</strong>
            <ul className="ml-4">
              <li className="flex justify-between">
                <span>Beds</span>
                <span>₱{bedFee}</span>
              </li>
              <li className="flex justify-between">
                <span>Pillows</span>
                <span>₱{pillowFess}</span>
              </li>
              <li className="flex justify-between">
                <span>Comforter</span>
                <span>₱{comforterFee}</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-between">
            <strong>Additional Request:</strong>
            <span>{request}</span>
          </div>
          {reference && (
            <div className="flex justify-between">
              <strong>Reference:</strong>
              <span>{reference}</span>
            </div>
          )}
          <div className="flex justify-between">
            <strong>Sub Total:</strong>
            <span>₱{subTotal}</span>
          </div>
        </div>
        <div className="flex">
          <button
            className="mt-4 bg-red-500 mx-auto block text-white py-2 px-4 rounded text-lg"
            onClick={cancelReservation}
          >
            Cancel
          </button>
          <button
            className="mt-4 bg-yellow-500 mx-auto block text-white py-2 px-4 rounded text-lg"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowReceipt;
