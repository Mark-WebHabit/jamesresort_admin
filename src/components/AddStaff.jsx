import { useContext, useState } from "react";
import { ref, push } from "firebase/database";
import { StaffDataContext } from "../StaffContext";
import { db } from "../../firebase";

function AddStaff() {
  const { setAddEMployee, shift: shiftOpt } = useContext(StaffDataContext);
  const [position, setPosition] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [shift, setShift] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleConfirm = () => {
    // Input validation
    if (!position.trim()) {
      alert("Position cannot be empty.");
      return;
    }
    if (!fullName.trim()) {
      alert("Full Name cannot be empty.");
      return;
    }
    if (!address.trim()) {
      alert("Address cannot be empty.");
      return;
    }
    if (!salary.trim() || isNaN(salary) || Number(salary) <= 0) {
      alert("Salary must be a valid number greater than 0.");
      return;
    }
    if (!shift.trim()) {
      alert("Please select a Shift.");
      return;
    }
    if (!cardType.trim()) {
      alert("Card Type cannot be empty.");
      return;
    }
    if (!cardNumber.trim() || isNaN(cardNumber) || cardNumber.length < 12) {
      alert("Card Number must be a valid number with at least 12 digits.");
      return;
    }

    // Prepare the staff data
    const data = {
      name: fullName,
      position,
      address,
      salary,
      current: shift,
      cardType,
      cardNumber,
      shifts: [
        {
          from: new Date().toISOString(),
          shift,
          to: "Current",
        },
      ],
    };

    // Get a reference to the staffs database and add the new staff
    const staffRef = ref(db, "staffs");
    push(staffRef, data)
      .then(() => {
        console.log("New staff added successfully!");
        // Clear the form and close the add employee form
        handleCancel();
      })
      .catch((error) => {
        console.error("Error adding new staff:", error);
      });
  };

  const handleCancel = () => {
    // Handle the cancel action (reset form fields)
    setPosition("");
    setFullName("");
    setAddress("");
    setSalary("");
    setShift("");
    setCardType("");
    setCardNumber("");

    setAddEMployee(false);
  };

  return (
    <div className="flex-1 grid place-items-center p-8">
      <div className="w-[800px]">
        <div className="w-full max-w-[600px] bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Staff</h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Position
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Salary
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Shift
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option value="">Select Shift</option>
              <option value={shiftOpt[0]}>{shiftOpt[0]}</option>
              <option value={shiftOpt[1]}>{shiftOpt[1]}</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Card Type
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Card Number
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStaff;
