import { useState } from "react";
import PropTypes from "prop-types";
import { ref, remove } from "firebase/database"; // Import Firebase methods
import { db } from "../../firebase";

const Notification = ({ notif, onMarkAsRead }) => {
  const [isRead, setIsRead] = useState(notif.status === "Read");

  const handleMarkAsRead = () => {
    if (!isRead) {
      setIsRead(true);
      onMarkAsRead(notif.id); // Trigger the callback to update the database or perform other actions
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      // Delete the notification from the database
      const notifRef = ref(db, `notifications/${notif.id}`); // Adjust path based on your database structure
      remove(notifRef)
        .then(() => {
          console.log("Notification deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting notification:", error);
        });
    }
  };

  return (
    <div
      className={`p-4 border-8  ${
        notif.status === "Read" ? "border-green-500" : "border-red-500"
      } rounded-md  ${
        isRead ? "bg-gray-100 text-gray-500" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{notif.title}</h3>
        <button
          className="text-red-600 font-bold text-sm hover:underline"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      <p>{notif.description}</p>
      <p className="text-sm text-gray-600">
        Reservation Date: {notif.reservationDate}
      </p>
      <p className="text-sm text-gray-600">Room: {notif.room}</p>
      <p className="text-xs text-gray-400">
        Date: {new Date(notif.date).toLocaleString()}
      </p>
      <span
        className={`text-xs font-medium ${
          isRead ? "text-green-600" : "text-red-600"
        }`}
        onClick={handleMarkAsRead}
      >
        {isRead ? "Read" : "Unread"}
      </span>
    </div>
  );
};

Notification.propTypes = {
  notif: PropTypes.shape({
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    reservationDate: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    reservationId: PropTypes.number.isRequired,
    id: PropTypes.number,
  }).isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired, // Added for deletion callback
};

export default Notification;
