import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { getMonthDateYear } from "./utilities/date";
import { ammenities, generateRandomDigits, tourFeee } from "./utilities/extras";
import { push, ref, set } from "firebase/database";
import { db } from "../firebase";
const ReservationDataContext = createContext({});

function ReservationContext({ children }) {
  const [getUserInfo, setGetUserInfo] = useState(false); // Initially set to false
  const [getReservationSummary, setGetReservationSummary] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [numHours, setNumHours] = useState(8);

  // Data to send to DB for walk-in
  const [guestName, setGuestName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [chosenRoom, setChosenRoom] = useState(null);
  const [numberOfGuest, setNumberOfGuest] = useState(1);
  const [dayTour, setDayTour] = useState(true);
  const [beds, setBeds] = useState(0);
  const [pillows, setPillows] = useState(0);
  const [comforter, setComforter] = useState(0);
  const [request, setRequest] = useState("");
  const [reference, setReference] = useState("");

  const handleConfirm = () => {
    const reservationId = generateRandomDigits();

    const guestFee =
      dayTour == "true"
        ? numberOfGuest * tourFeee.day
        : numberOfGuest * tourFeee.overnight;
    const bedsFee = ammenities.bed * beds;
    const pillowsFee = ammenities.pillow * pillows;
    const comforterFee = ammenities.comforter * comforter;
    const total =
      guestFee + bedsFee + pillowsFee + comforterFee + chosenRoom.price;

    const data = {
      client: guestName,
      clientAddress: address,
      clientContact: contactNumber,
      dayTour,
      startingDate: checkInDate,
      endingDate: checkOutDate,
      guestFee,
      monthYear: getMonthDateYear(checkInDate),
      numberOfGuest: numberOfGuest,
      request,
      room: chosenRoom.id,
      status: "confirmed",
      totalFee: total,
      reference,
      addAmenities: {
        bed: beds,
        pillow: pillows,
        comforter: comforter,
      },
      ammenitiesFee: {
        bed: bedsFee,
        pillow: pillowsFee,
        comforter: comforterFee,
      },
      dateBooked: new Date().toString(),
    };

    const notif = {
      description: `New Reservation has been made by ${guestName}`,
      reservationDate: checkInDate,
      room: chosenRoom.name,
      title: "New Reservation",
      date: new Date().toISOString(),
      reservationId,
      status: "Unread",
    };

    // Push data to Firebase Realtime Database
    const notificationsRef = ref(db, "notifications");
    const reservationRef = ref(db, `reservations/${reservationId}`);
    set(reservationRef, data)
      .then(() => {
        push(notificationsRef, notif)
          .then(() => {
            console.log("Notification added successfully.");
            cancelReservation();
            // You can add further actions here, e.g., showing a success message
          })
          .catch((error) => {
            console.error("Error adding notification:", error);
          });
        cancelReservation();
      })
      .catch((error) => {
        console.error("Error saving reservation data:", error);
      });
  };

  const cancelReservation = () => {
    setCheckInDate("");
    setCheckOutDate("");
    setChosenRoom(null);
    setNumberOfGuest(1);
    setDayTour(true);
    setBeds(0);
    setPillows(0);
    setComforter(0);
    setRequest("");
    setShowReceipt(false);
    setGuestName("");
    setAddress("");
    setContactNumber("");
    setReference("");
  };

  const handleChangeCheckInDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const now = new Date();
    if (selectedDate < now) {
      alert("The selected date is in the past. Please choose a future date.");
      e.target.value = "";
      setCheckInDate("");
    } else {
      setCheckInDate(() => selectedDate.toString());
    }
  };

  const handleNext = () => {
    if (!checkInDate || !checkOutDate || !chosenRoom || !numberOfGuest) {
      return alert("Ensure to fill all required data");
    }

    setGetReservationSummary(false);
    setShowReceipt(true);
  };

  return (
    <ReservationDataContext.Provider
      value={{
        getUserInfo,
        setGetUserInfo,
        guestName,
        setGuestName,
        address,
        setAddress,
        contactNumber,
        setContactNumber,
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
        roomId,
        setRoomId,
        numberOfGuest,
        setNumberOfGuest,
        dayTour,
        setDayTour,
        beds,
        setBeds,
        pillows,
        setPillows,
        comforter,
        setComforter,
        request,
        setRequest,
        getReservationSummary,
        setGetReservationSummary,
        handleNext,
        handleChangeCheckInDate,
        numHours,
        setNumHours,
        showReceipt,
        setShowReceipt,
        chosenRoom,
        setChosenRoom,
        cancelReservation,
        handleConfirm,
        reference,
        setReference,
      }}
    >
      {children}
    </ReservationDataContext.Provider>
  );
}

ReservationContext.propTypes = {
  children: PropTypes.node,
};

export default ReservationContext;
export { ReservationDataContext };
