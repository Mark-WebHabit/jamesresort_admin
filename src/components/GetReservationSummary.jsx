import { useContext } from "react";
import PropTypes from "prop-types";
import { formatDateTime } from "../utilities/date";
import { ReservationDataContext } from "../ReservationContext";

function GetReservationSummary({ onBack }) {
  const {
    handleChangeCheckInDate,
    checkInDate,
    setNumHours,
    checkOutDate,
    setRoomId,
    numberOfGuest,
    setNumberOfGuest,
    setDayTour,
    beds,
    setBeds,
    pillows,
    setPillows,
    comforter,
    setComforter,
    setRequest,
    request,
    handleNext,
    chosenRoom,
    dayTour,
    reference,
    setReference,
  } = useContext(ReservationDataContext);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-40 grid place-items-center z-50">
      <div className="w-full max-w-[600px] rounded-lg bg-black bg-opacity-70 p-8">
        <div className="relative">
          <p
            className="text-4xl font-bold text-white absolute -top-4 left-4"
            onClick={onBack}
          >
            {"<"}
          </p>
          <h1 className="text-center text-white font-bold text-3xl">
            Registration Details
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex-1 flex flex-col text-white text-lg font-bold">
            Check-in Date
            <input
              type="datetime-local"
              className="py-2 px-4 rounded-md text-black"
              onChange={handleChangeCheckInDate}
            />
          </label>

          <label className="flex-1 flex flex-col text-white text-lg font-bold">
            Hours of stay
            <input
              type="number"
              className="py-2 px-4 rounded-md text-black"
              min={"8"}
              max={"22"}
              disabled={checkInDate == "" || checkInDate?.length < 1}
              onChange={(e) => setNumHours(parseInt(e.target.value))}
            />
          </label>
        </div>

        <p className="flex items-center text-white gap-4 text-2xl my-4">
          Check out:
          {checkOutDate?.length > 0 && (
            <span>{formatDateTime(checkOutDate)}</span>
          )}
        </p>

        <select
          name=""
          id=""
          className="w-full py-4 px-8 mb-4"
          onChange={(e) => setRoomId(e.target.value)}
        >
          <option value={chosenRoom.id}>{chosenRoom.name}</option>
        </select>

        <div className="flex gap-4 items-center">
          <input
            type="number"
            className="flex-1 py-2 px-4 rounded-md"
            min={"1"}
            placeholder="No. of Guests"
            value={numberOfGuest}
            onChange={(e) => setNumberOfGuest(e.target.value)}
          />

          <select
            name=""
            className="flex-1 py-2 px-8 rounded-md"
            value={dayTour}
            onChange={(e) => setDayTour(e.target.value)}
          >
            <option value={true}>Daytour</option>
            <option value={false}>Overnight</option>
          </select>
        </div>
        <div className="flex items-center gap-4 w-full mt-4">
          <label className="w-3/12 flex flex-col text-white font-bold">
            Beds{" "}
            <input
              type="number"
              min={"0"}
              className="text-black px-4 py-2"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
            />
          </label>
          <label className="w-3/12 flex flex-col text-white font-bold">
            Pillows{" "}
            <input
              type="number"
              min={"0"}
              className="text-black px-4 py-2"
              value={pillows}
              onChange={(e) => setPillows(e.target.value)}
            />
          </label>
          <label className="w-3/12 flex flex-col text-white font-bold">
            Comforter{" "}
            <input
              type="number"
              min={"0"}
              className="text-black px-4 py-2"
              value={comforter}
              onChange={(e) => setComforter(e.target.value)}
            />
          </label>
        </div>

        <input
          type="text"
          className="w-full mt-4 p-4 rounded-md"
          placeholder="Reference Number"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <input
          type="text"
          className="w-full mt-4 rounded-md py-6 px-4"
          placeholder="Requets..."
          maxLength={200}
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />

        <button
          className="block w-fit px-12 py-4 bg-yellow-700 mt-4 mx-auto rounded-xl"
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

GetReservationSummary.propTypes = {
  onBack: PropTypes.func,
};

export default GetReservationSummary;
