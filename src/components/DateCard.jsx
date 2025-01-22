import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { ref, onValue, update, set } from "firebase/database";
import { db } from "../../firebase";
import { formatDataWithId } from "../utilities/extras";
import { ResortContext } from "../DataContext";

const DateCard = ({ item }) => {
  const { staffs } = useContext(ResortContext);
  const cardRef = useRef();

  const bookings = item;
  const monthYear = item[0].monthYear.split(" ");
  const [totalGuest, setTotalGuest] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffAssigned, setStaffAssigned] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    console.log(staffAssigned);
  }, [staffAssigned]);

  useEffect(() => {
    const staffAssignedRef = ref(db, `staffAssignment/${item[0].monthYear}`);
    onValue(staffAssignedRef, (snapshot) => {
      setStaffAssigned(formatDataWithId(snapshot.val()) ?? []);
    });
  }, [item]);

  useEffect(() => {
    const calculateTotalGuests = bookings.reduce(
      (total, book) => total + book.numberOfGuest,
      0
    );
    setTotalGuest(calculateTotalGuests);
  }, [bookings]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowInfo(false);
        setShowAddStaff(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardRef]);

  const handleCheckboxChange = (staffId) => {
    setSelectedStaff((prevSelected) => {
      if (prevSelected.includes(staffId)) {
        return prevSelected.filter((id) => id !== staffId);
      } else {
        return [...prevSelected, staffId];
      }
    });
  };

  const handleConfirm = () => {
    const staffAssignedRef = ref(db, `staffAssignment/${item[0].monthYear}`);
    if (selectedStaff.length === 0) {
      set(staffAssignedRef, null)
        .then(() => {
          setShowAddStaff(false);
          setSelectedStaff([]);
          setStaffAssigned([]);
        })
        .catch((error) => {
          console.error("Error removing staff assignments:", error);
        });
    } else {
      const newStaffAssignments = selectedStaff.reduce((acc, staffId) => {
        const staff = staffs.find((s) => s.id === staffId);
        if (staff) {
          acc[staffId] = { name: staff.name, id: staffId };
        }
        return acc;
      }, {});
      update(staffAssignedRef, newStaffAssignments)
        .then(() => {
          setShowAddStaff(false);
          setSelectedStaff([]);
        })
        .catch((error) => {
          console.error("Error updating staff assignments:", error);
        });
    }
  };
  return (
    <div
      ref={cardRef}
      className="p-8 bg-red-600 h-[150px] w-[150px] flex flex-col justify-center items-center cursor-pointer relative"
      onClick={() => setShowInfo(true)}
    >
      <p className="text-2xl font-bold text-white">
        {monthYear[0].slice(0, 3)}
      </p>
      <p className="text-6xl font-bold text-white">
        {monthYear[1].replace(",", "")}
      </p>
      <p className="text-sm font-bold text-white">{monthYear[2]}</p>

      {showInfo && (
        <div className="absolute w-[250px] p-4 -bottom-[100%] left-20 bg-black z-50 rounded">
          <p className="text-center text-white text-2xl font-bold mb-4">
            {item[0].monthYear}
          </p>

          <div className="flex justify-between items-center text-white">
            <p>Total bookings: </p>
            <p>{bookings.length}</p>
          </div>

          <div className="flex justify-between items-center text-white">
            <p>Total Guests: </p>
            <p>{totalGuest}</p>
          </div>

          <hr className="border my-2" />
          <div className="flex justify-between items-center text-white">
            <p>Staff Assigned: </p>
            <p>{staffAssigned?.length}</p>
          </div>
          <hr className="border my-2" />

          {staffAssigned?.length > 0 &&
            staffAssigned.map((staff) => (
              <p className="text-white" key={staff.id}>
                {staff.name}
              </p>
            ))}
          <div className="relative py-4">
            <button
              className="absolute text-white right-4 top-0 px-2 rounded-full cursor-pointer bg-green-600"
              onClick={() => setShowAddStaff(true)}
            >
              +
            </button>

            {showAddStaff && (
              <div className="bg-white shadow p-4 pt-6 absolute right-0 -bottom-[100%]">
                <button
                  className="text-5xl text-red-800 px-2 absolute -right-0 -top-4"
                  onClick={() => setShowAddStaff(false)}
                >
                  -
                </button>
                {staffs?.length > 0 &&
                  staffs.map((staff) => (
                    <div className="flex items-center gap-4" key={staff.id}>
                      <input
                        type="checkbox"
                        value={staff.id}
                        checked={selectedStaff.includes(staff.id)}
                        onChange={() => handleCheckboxChange(staff.id)}
                      />
                      <p>{staff.name}</p>
                    </div>
                  ))}

                <button
                  className="text-white bg-green-700 px-4 mt-2"
                  onClick={handleConfirm}
                >
                  confirm
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

DateCard.propTypes = {
  item: PropTypes.arrayOf(
    PropTypes.shape({
      monthYear: PropTypes.string.isRequired,
      numberOfGuest: PropTypes.number.isRequired,
      // Add other properties as needed
    })
  ).isRequired,
};

export default DateCard;
