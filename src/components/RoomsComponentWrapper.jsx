import PropTypes from "prop-types";

import ReservationContext from "../ReservationContext";
function RoomsComponentWrapper({ children }) {
  return (
    <ReservationContext>
      <>{children}</>
    </ReservationContext>
  );
}

RoomsComponentWrapper.propTypes = {
  children: PropTypes.node,
};
export default RoomsComponentWrapper;
