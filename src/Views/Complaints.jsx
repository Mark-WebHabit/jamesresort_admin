import { useContext, useState } from "react";
import { ref, push, update } from "firebase/database";
import { ResortContext } from "../DataContext";
import { getMonthDateYear } from "../utilities/date";
import { db } from "../../firebase";
function Complaints() {
  const { complaints } = useContext(ResortContext);

  const [complaintName, setComplaintName] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [budget, setBudget] = useState("");

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 200) {
      setComplaintDescription(e.target.value);
    }
  };

  const handleConfirm = () => {
    if (!complaintName.trim()) {
      alert("Complaint Name cannot be empty.");
      return;
    }
    if (!complaintType.trim()) {
      alert("Complaint Type cannot be empty.");
      return;
    }
    if (!complaintDescription.trim()) {
      alert("Complaint Description cannot be empty.");
      return;
    }

    const data = {
      name: complaintName,
      type: complaintType,
      description: complaintDescription,
      date: new Date().toISOString(),
      budget: "", // Initialize the budget as empty
      status: "pending",
    };

    const complaintsRef = ref(db, "complaints");
    push(complaintsRef, data)
      .then(() => {
        console.log("Complaint added successfully!");
        handleCancel();
      })
      .catch((error) => {
        console.error("Error adding complaint:", error);
      });
  };

  const handleCancel = () => {
    setComplaintName("");
    setComplaintType("");
    setComplaintDescription("");
  };

  const openResolveModal = (complaint) => {
    setSelectedComplaint(complaint);
    setBudget(complaint.budget || ""); // Set the existing budget if available
  };

  const closeResolveModal = () => {
    setSelectedComplaint(null);
    setBudget("");
  };

  const confirmResolve = () => {
    if (!budget.trim()) {
      alert("Budget cannot be empty.");
      return;
    }

    const complaintRef = ref(db, `complaints/${selectedComplaint.id}`);

    update(complaintRef, {
      budget,
      status: "resolved",
      dateResolved: new Date().toISOString(),
    })
      .then(() => {
        console.log("Budget updated successfully!");
        closeResolveModal();
      })
      .catch((error) => {
        console.error("Error updating budget:", error);
      });
  };

  return (
    <div className="flex flex-col flex-1 bg-black bg-opacity-80 rounded-md overflow-hidden p-4">
      <p className="text-4xl text-white font-bold m-4 ">Make Complaints</p>

      {/* Form for new complaints */}
      <div className="flex items-center gap-8">
        <label className="flex-1 flex flex-col">
          <span className="text-white font-bold text-lg">Complaint Name</span>
          <input
            type="text"
            className="py-2 px-4 rounded-md"
            value={complaintName}
            onChange={(e) => setComplaintName(e.target.value)}
            maxLength={40}
          />
        </label>
        <label className="flex-1 flex flex-col ">
          <span className="text-white font-bold text-lg">Complaint Type</span>
          <input
            type="text"
            className="py-2 px-4 rounded-md"
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            maxLength={40}
          />
        </label>
      </div>

      <div className="flex items-center gap-8 mt-4">
        <label className="flex-1 flex flex-col">
          <span className="text-white font-bold text-lg">
            Please Describe your complaint
          </span>
          <textarea
            className="py-4 px-8 rounded-md h-20"
            value={complaintDescription}
            onChange={handleDescriptionChange}
            maxLength="200"
          />
          <span className="text-sm text-gray-400">
            {complaintDescription.length}/200 characters
          </span>
        </label>
      </div>

      <div className="buttons flex items-center justify-center gap-10">
        <button
          className="px-10 py-4 bg-red-800 rounded-md text-white font-bold"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="px-10 py-4 bg-green-800 rounded-md text-white font-bold"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>

      {/* Complaints Table */}
      <div className="flex-1 bg-white rounded-md overflow-auto mt-8 table-complaints p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2" colSpan="2">
                Complaints
              </th>
              <th className="px-4 py-2">Date Created</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Budget</th>
            </tr>
          </thead>
          <tbody>
            {complaints?.length > 0 &&
              complaints.map((item) => (
                <tr key={item.id} className="bg-gray-100">
                  <td className="border px-4 py-2 max-w-[100px] break-words">
                    {item.name}
                  </td>
                  <td className="border px-4 py-2 max-w-[100px] break-words">
                    {item.type}
                  </td>
                  <td
                    className="border px-4 py-2 max-w-[200px] overflow-hidden break-words"
                    colSpan="2"
                  >
                    {item.description}
                  </td>
                  <td className="border px-4 py-2">
                    {getMonthDateYear(item.date)}
                  </td>
                  <td className="border px-4 py-2">
                    {item.status !== "resolved" ? (
                      <button
                        className="text-sm px-4 py-2 bg-green-800 text-white rounded-sm"
                        onClick={() => openResolveModal(item)}
                      >
                        RESOLVE
                      </button>
                    ) : (
                      item?.dateResolved && getMonthDateYear(item.dateResolved)
                    )}
                  </td>
                  <td className="border px-4 py-2">{item.budget || ""}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Resolve Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md max-w-[500px]">
            <h2 className="text-lg font-bold">Resolve Complaint</h2>
            <p className="break-words">
              Complaint: {selectedComplaint.description}
            </p>
            <label className="flex flex-col mt-4">
              <span>Budget:</span>
              <input
                type="number"
                className="py-2 px-4 rounded-md border"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={closeResolveModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md"
                onClick={confirmResolve}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaints;
