import { createContext, useState } from "react";
import PropTypes from "prop-types";

const StaffDataContext = createContext({});

function StaffContext({ children }) {
  const shift = ["DAY - 8:00AM - 8:00PM", "NIGHT - 8:00PM - 8:00AM"];
  const [showSwitchShift, setShowSwitchShift] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [addEmployee, setAddEMployee] = useState(false);

  return (
    <StaffDataContext.Provider
      value={{
        shift,
        setShowSwitchShift,
        showSwitchShift,
        employeeInfo,
        setEmployeeInfo,
        addEmployee,
        setAddEMployee,
      }}
    >
      {children}
    </StaffDataContext.Provider>
  );
}

StaffContext.propTypes = {
  children: PropTypes.node,
};

export default StaffContext;
export { StaffDataContext };
