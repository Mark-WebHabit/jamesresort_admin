import { useContext } from "react";
import { ReservationDataContext } from "../ReservationContext";

function GetUserInfo() {
  const {
    guestName,
    setGuestName,
    address,
    setAddress,
    contactNumber,
    setContactNumber,
    setGetUserInfo,
    setGetReservationSummary,
  } = useContext(ReservationDataContext);
  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen  bg-black bg-opacity-60">
      <div className="bg-black  p-8 rounded-lg w-1/2 max-w-[500px] boorder-2 border-white">
        <h2 className="text-white text-2xl mb-4">Guest Information</h2>
        <div className="mb-4">
          <label className="block text-white mb-2">Guest Name</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setGetUserInfo(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const philippinePhoneNumberPattern = /^(09|\+639)\d{9}$/;
              if (!guestName || !address || !contactNumber) {
                return alert("All fields are required");
              }
              if (!philippinePhoneNumberPattern.test(contactNumber)) {
                return alert("Please enter a valid Philippine phone number.");
              }

              setGetReservationSummary(true);
              setGetUserInfo(false);
            }}
            className="bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetUserInfo;
