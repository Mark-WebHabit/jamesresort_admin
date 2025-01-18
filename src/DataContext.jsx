import { useEffect, useState, createContext } from "react";
import Proptypes from "prop-types";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const ResortContext = createContext();

function DataContext({ children }) {
  const [rooms, setRooms] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const shift = ["DAY - 8:00AM - 8:00PM", "NIGHT - 8:00PM - 8:00AM"];

  useEffect(() => {
    const roomsRef = ref(db, "rooms");
    const staffsRef = ref(db, "staffs");
    const complaintsRef = ref(db, "complaints");
    const reservationsRef = ref(db, "reservations");
    const notifcationsRef = ref(db, "notifications");
    const formatDataWithId = (data) => {
      return data
        ? Object.entries(data).map(([uid, item]) => ({ ...item, id: uid }))
        : [];
    };

    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      setRooms(formatDataWithId(data));
    });

    onValue(staffsRef, (snapshot) => {
      const data = snapshot.val();
      setStaffs(formatDataWithId(data));
    });

    onValue(complaintsRef, (snapshot) => {
      const data = snapshot.val();

      setComplaints(formatDataWithId(data));
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
      value={{ rooms, staffs, complaints, reservations, shift, notifications }}
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
