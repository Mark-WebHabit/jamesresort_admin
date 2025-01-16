import { useContext, useState } from "react";
import { StaffDataContext } from "../StaffContext";
import { db } from "../../firebase";
import { get, ref, set } from "firebase/database";
import { getMonthDateYear } from "../utilities/date";

function SwitchShift() {
  const { showSwitchShift, setShowSwitchShift, shift } =
    useContext(StaffDataContext);

  const [selectedShift, setSelectedShift] = useState(shift[0]);

  const handleConfirm = () => {
    let confirm = true;
    if (selectedShift === showSwitchShift.current) {
      confirm = window.confirm(
        "The current shift is the same as the selected shift. Do you want to continue?"
      );
    }
    if (!confirm) return;

    const dt = new Date();

    const today = getMonthDateYear(dt);

    const staffRef = ref(db, `staffs/${showSwitchShift.id}`);

    get(staffRef)
      .then((snapshot) => {
        let shiftsData = snapshot.val();

        if (shiftsData) {
          shiftsData.current = selectedShift;

          const newShift = {
            from: dt.toString(),
            to: "Current",
            shift: selectedShift,
          };

          let target = shiftsData.shifts.find((s) => s.to === "Current");
          if (target) {
            target.to = today;
          }

          shiftsData.shifts.push(newShift);

          // Update the shifts data in Firebase
          set(staffRef, shiftsData)
            .then(() => {
              console.log("Shifts updated successfully");
              setShowSwitchShift(null);
            })
            .catch((error) => {
              console.error("Error updating shifts:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching shifts:", error);
      });
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 grid place-items-center">
      <div className="w-full max-w-[400px] bg-white p-8 rounded border-black border">
        <p className="mb-4 text-center font-bold text-black text-2xl">
          Change Shift
        </p>

        <p className="text-xl text-black">Shift</p>
        <select
          name=""
          id=""
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value)}
          className="py-2 px-4 border rounded-xl bg-white border-black w-full"
        >
          <option value={shift[0]} defaultValue>
            {shift[0]}
          </option>
          <option value={shift[1]}>{shift[1]}</option>
        </select>
        <div className="flex justify-around items-center">
          <button
            className="bg-red-800 h-[40px] px-8 blockpy-3 mt-8 text-white font-bold rounded-md"
            onClick={() => setShowSwitchShift(null)}
          >
            Cancel
          </button>
          <button
            className="bg-[#6ccee6] h-[40px] px-8 blockpy-3 mt-8 text-white font-bold rounded-md"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwitchShift;
