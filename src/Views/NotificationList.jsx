import { useContext } from "react";
import { ref, update } from "firebase/database"; // Firebase imports
import { db } from "../../firebase";
import Notification from "../components/Notification";
import { ResortContext } from "../DataContext";

const NotificationsList = () => {
  const { notifications } = useContext(ResortContext);

  const handleMarkAsRead = (id) => {
    // Update the status in the Firebase Realtime Database
    const notifRef = ref(db, `notifications/${id}`);
    update(notifRef, { status: "Read" })
      .then(() => {
        console.log("Notification marked as read");
      })
      .catch((error) => {
        console.error("Error updating notification status:", error);
      });
  };

  return (
    <div className=" flex-1 overflow-scroll hide-scrollbar">
      {notifications.map((notif) => (
        <div key={notif.id} className={`p-4 rounded-md cursor-pointer `}>
          <Notification notif={notif} onMarkAsRead={handleMarkAsRead} />
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
