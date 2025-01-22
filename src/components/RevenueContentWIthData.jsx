import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { ResortContext } from "../DataContext";

function RevenueContentWithData({
  categ,
  selectedReservationSpan,
  setEntranceFeeTotal,
  setAmmenitiesTotal,
  setTotal,
}) {
  const { rooms } = useContext(ResortContext);
  const [matchedRoomReservation, setMatchedRoomReservation] = useState([]);
  // fees
  const [roomFee, setRoomFee] = useState(0);

  useEffect(() => {
    if (!selectedReservationSpan || selectedReservationSpan.length <= 0) return;

    const roomsCategory = rooms
      .filter((rm) => rm.category === categ)
      .map((rm) => rm.id);

    const matchedReservation = selectedReservationSpan.filter((rm) =>
      roomsCategory.includes(rm.room)
    );

    setMatchedRoomReservation(matchedReservation ?? []);
  }, [selectedReservationSpan, categ, rooms]);

  useEffect(() => {
    if (!matchedRoomReservation || matchedRoomReservation.length <= 0) return;

    let paid = 0;
    let entranceFee = 0;
    let ammenities = 0;

    for (let i = 0; i < matchedRoomReservation.length; i++) {
      const reservation = matchedRoomReservation[i];
      const paidTotal = reservation?.paid;

      if (paidTotal) {
        paid += paidTotal;
        setTotal((old) => (old += paidTotal));
      }
      // console.log(reservation);

      if (reservation.totalFee === 0) {
        const bed = reservation.amenitiesFee.beds;

        const pillow = reservation.amenitiesFee.pillows;
        const comforter = reservation.amenitiesFee.comforter;

        const amenitiesFeeTotal = bed + pillow + comforter;

        paid -= amenitiesFeeTotal;
        paid -= reservation.guestFee;
        entranceFee += reservation.guestFee;
        ammenities += amenitiesFeeTotal;
      }
    }

    setRoomFee(paid);
    setEntranceFeeTotal((old) => (old += entranceFee));
    setAmmenitiesTotal((old) => (old += ammenities));
  }, [
    matchedRoomReservation,
    setEntranceFeeTotal,
    setAmmenitiesTotal,
    setTotal,
  ]);

  return (
    <div className="flex-1 py-4 bg-[#ffebcd] text-center">{`Php ${roomFee}`}</div>
  );
}

RevenueContentWithData.propTypes = {
  text: PropTypes.string,
  room: PropTypes.object,
  selectedReservationSpan: PropTypes.array,
  categ: PropTypes.string,
  setEntranceFeeTotal: PropTypes.func,
  setAmmenitiesTotal: PropTypes.func,
  setTotal: PropTypes.func,
};

export default RevenueContentWithData;
