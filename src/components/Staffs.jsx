import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ResortContext } from "../DataContext";
import { StaffDataContext } from "../StaffContext";
import { ref, remove } from "firebase/database"; // Import Firebase methods if using Firebase
import { db } from "../../firebase";

function Staffs({ search }) {
  const { staffs } = useContext(ResortContext); // Accessing staffs and a method to update them
  const { setShowSwitchShift, setEmployeeInfo } = useContext(StaffDataContext);

  // Filter the staffs based on the search query
  const filteredStaffs = staffs?.filter((staff) => {
    const lowerCaseSearch = search?.toLowerCase() || "";
    return (
      staff.name.toLowerCase().includes(lowerCaseSearch) ||
      staff.position.toLowerCase().includes(lowerCaseSearch) ||
      staff.current.toLowerCase().includes(lowerCaseSearch)
    );
  });

  // Handle staff deletion
  const handleDelete = (staffId) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      // Delete from database
      const staffRef = ref(db, `staffs/${staffId}`); // Assuming `staffs` is the Firebase node
      remove(staffRef)
        .then(() => {
          // Remove from state after successful deletion
          console.log("Staff deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting staff:", error);
        });
    }
  };

  // Handle case when there are no matching results
  if (!filteredStaffs || filteredStaffs.length === 0) {
    return (
      <p className="col-span-full text-center text-white bg-black p-4 rounded">
        No matching results found.
      </p>
    );
  }

  // Render the filtered staff list
  return filteredStaffs.map((staff) => (
    <React.Fragment key={staff.id}>
      <p className="col-span-1 flex justify-center items-center border p-4 bg-black text-white rounded shadow uppercase">
        {staff.name}
      </p>
      <p
        className={`col-span-1 flex justify-center items-center border text-white p-4 bg-black uppercase`}
      >
        {staff.position}
      </p>
      <p className="col-span-1 flex justify-center items-center border text-white p-4 text-sm bg-black uppercase">
        {staff.current}
      </p>
      <div
        className={`col-span-1 flex justify-center items-center border p-4 text-white rounded shadow font-bold text-xl bg-black `}
      >
        <button
          className="bg-yellow-500 px-6 py-4"
          onClick={() => setShowSwitchShift(staff)}
        >
          CHANGE
        </button>
      </div>
      <div
        className={`col-span-1 flex justify-center items-center border p-4 text-white rounded shadow font-bold text-xl bg-black gap-2 `}
      >
        <button
          className=" p-2 w-[50px] rounded-full bg-yellow-500"
          onClick={() => setEmployeeInfo(staff)}
        >
          <img src="/images/view.png" alt="view" className="w-full" />
        </button>
        <button
          className=" p-2 w-[50px] rounded-full bg-red-600"
          onClick={() => handleDelete(staff.id)} // Call the delete handler
        >
          <img src="/images/delete.png" alt="delete" className="w-full" />
        </button>
      </div>
    </React.Fragment>
  ));
}

Staffs.propTypes = {
  search: PropTypes.string,
};

export default Staffs;
