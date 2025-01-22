import { useEffect, useState, createContext } from "react";
import Proptypes from "prop-types";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { formatDataWithId } from "./utilities/extras";

const ResortContext = createContext();

function DataContext({ children }) {
  const [rooms, setRooms] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const shift = ["DAY - 8:00AM - 8:00PM", "NIGHT - 8:00PM - 8:00AM"];

  useEffect(() => {
    const roomsRef = ref(db, "rooms");
    const staffsRef = ref(db, "staffs");
    const reviewsRef = ref(db, "reviews");
    const reservationsRef = ref(db, "reservations");
    const notifcationsRef = ref(db, "notifications");

    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      setRooms(formatDataWithId(data));
    });

    onValue(staffsRef, (snapshot) => {
      const data = snapshot.val();
      setStaffs(formatDataWithId(data));
    });

    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();

      setReviews(formatDataWithId(data));
    });

    onValue(reservationsRef, (snapshot) => {
      const data = snapshot.val();
      setReservations(formatDataWithId(data));
    });

    onValue(notifcationsRef, (snapshot) => {
      const data = snapshot.val();
      setNotifications(formatDataWithId(data));
    });
  }, []);

  return (
    <ResortContext.Provider
      value={{ rooms, staffs, reviews, reservations, shift, notifications }}
    >
      {children}
    </ResortContext.Provider>
  );
}

DataContext.propTypes = {
  children: Proptypes.node,
};

export default DataContext;
export { ResortContext };
