import { ref, remove } from "firebase/database";
import { db } from "../../firebase";

export const deleteReservation = (reservationId) => {
  // Reference to the reservation in the database
  const reservationRef = ref(db, `reservations/${reservationId}`);

  // Remove the reservation
  remove(reservationRef)
    .then(() => {
      console.log("Reservation deleted successfully.");
      // You can add further actions here, e.g., navigating to another page or showing a success message
    })
    .catch((error) => {
      console.error("Failed to delete reservation:", error);
      // You can handle the error here, e.g., showing an error message to the user
    });
};
