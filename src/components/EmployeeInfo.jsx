import { useRef, useState, useEffect, useContext } from "react";
import { StaffDataContext } from "../StaffContext";
import { getDatabase, ref, update } from "firebase/database";
import { getMonthDateYear } from "../utilities/date";

function EmployeeInfo() {
  const { employeeInfo, setEmployeeInfo } = useContext(StaffDataContext);
  const [disableName, setDisableName] = useState(true);
  const [disableSalary, setDisableSalary] = useState(true);
  const nameRef = useRef(null);
  const salaryRef = useRef(null);

  useEffect(() => {
    if (!disableName) {
      nameRef.current.focus();
    }
  }, [disableName]);

  useEffect(() => {
    if (!disableSalary) {
      salaryRef.current.focus();
    }
  }, [disableSalary]);

  const handleSave = (field) => {
    const db = getDatabase();
    const employeeRef = ref(db, `staffs/${employeeInfo.id}`);

    let updates = {};
    if (field === "name") {
      if (!employeeInfo.name.trim()) {
        alert("Name cannot be empty.");
        return;
      }
      updates["name"] = employeeInfo.name;
    }
    if (field === "salary") {
      if (!employeeInfo.salary.trim() || isNaN(employeeInfo.salary)) {
        alert("Salary must be a valid number.");
        return;
      }
      updates["salary"] = employeeInfo.salary;
    }
    if (Object.keys(updates).length > 0) {
      update(employeeRef, updates)
        .then(() => {
          console.log("Employee info updated successfully!");
          // Optionally, set the input fields back to disabled after updating
          setDisableName(true);
          setDisableSalary(true);
        })
        .catch((error) => {
          console.error("Error updating employee info:", error);
        });
    }
  };

  const handleClose = () => {
    setEmployeeInfo(null);
  };

  const sortedShifts = employeeInfo?.shifts?.sort((a, b) => {
    if (a.to === "Current") return -1;
    if (b.to === "Current") return 1;
    return new Date(b.from) - new Date(a.from);
  });

  return (
    <div className="flex-1  grid place-items-center">
      <div className="card w-full max-w-[800px] bg-black bg-opacity-70 p-8 rounded-lg relative max-h-full overflow-scroll hide-scrollbar">
        <h1 className="text-white font-bold text-3xl">Employee Info</h1>

        <button
          className="absolute top-4 right-4 w-[30px] rounded-full bg-red-600 cursor-pointer"
          onClick={handleClose}
        >
          <img src="/images/close.png" className="w-full" alt="close" />
        </button>

        <div className="inputs mt-4">
          <form className="w-full flex items-center mb-4" method="POST">
            <span className="text-xl text-white font-bold block w-[80px]">
              Name
            </span>
            <input
              type="text"
              className="padding border border-black px-4 py-2 bg-inherit rounded-md text-white font-bold"
              disabled={disableName}
              ref={nameRef}
              value={employeeInfo.name}
              onChange={(e) =>
                setEmployeeInfo((old) => ({ ...old, name: e.target.value }))
              }
            />

            {!disableName && (
              <button
                className="w-[40px] p-1 rounded-full ml-8"
                onClick={(e) => {
                  e.preventDefault();
                  handleSave("name");
                }}
              >
                <img src="/images/check.png" className="w-full" alt="edit" />
              </button>
            )}

            {disableName && (
              <button
                className="w-[40px] border p-2 rounded-full ml-8 bg-green-700"
                onClick={(e) => {
                  e.preventDefault();
                  setDisableName(false);
                }}
              >
                <img src="/images/edit.png" className="w-full" alt="edit" />
              </button>
            )}
          </form>

          <form className="w-full flex items-center mb-4" method="POST">
            <span className="text-xl text-white font-bold block w-[80px]">
              Salary
            </span>
            <input
              type="text"
              className="padding border border-black px-4 py-2 bg-inherit rounded-md text-white font-bold"
              disabled={disableSalary}
              ref={salaryRef}
              value={employeeInfo.salary}
              onChange={(e) =>
                setEmployeeInfo((old) => ({ ...old, salary: e.target.value }))
              }
            />

            {!disableSalary && (
              <button
                className="w-[40px] p-1 rounded-full ml-8"
                onClick={(e) => {
                  e.preventDefault();
                  handleSave("salary");
                }}
              >
                <img src="/images/check.png" className="w-full" alt="edit" />
              </button>
            )}
            {disableSalary && (
              <button
                className="w-[40px] border p-2 rounded-full ml-8 bg-green-700"
                onClick={(e) => {
                  e.preventDefault();
                  setDisableSalary(false);
                }}
              >
                <img src="/images/edit.png" className="w-full" alt="edit" />
              </button>
            )}
          </form>
        </div>
        <div className="w-full flex flex-col bg-white mt-4">
          <div className="flex gap-1 p-1">
            <p className="flex-1 py-4  text-center font-bold bg-[#e6e6e6]">
              SHIFT
            </p>
            <p className="flex-1  py-4 text-center font-bold bg-[#e6e6e6]">
              FROM
            </p>
            <p className="flex-1  py-4 text-center font-bold bg-[#e6e6e6]">
              TO
            </p>
          </div>

          {sortedShifts &&
            sortedShifts.map((sh, i) => (
              <div className="flex gap-1 p-1" key={i}>
                <p className="flex-1 py-4  text-center text-sm text-white font-bold bg-black bg-opacity-90">
                  {sh.shift}
                </p>
                <p className="flex-1  py-4 text-center text-sm text-white font-bold bg-black bg-opacity-90">
                  {getMonthDateYear(sh.from)}
                </p>
                <p className="flex-1  py-4 text-center text-sm text-white font-bold bg-black bg-opacity-90">
                  {sh.to === "Current" ? sh.to : getMonthDateYear(sh.to)}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeInfo;
