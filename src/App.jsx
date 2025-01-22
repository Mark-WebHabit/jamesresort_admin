import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ReservationContext from "./ReservationContext";
import DataContext from "./DataContext";
import StaffContext from "./StaffContext";

// screens
import Login from "./Views/Login";
import Signup from "./Views/Signu";
import Home from "./Views/Home";
import Dashboard from "./Views/Dashboard";
import Rooms from "./Views/Rooms";
import Staff from "./Views/Staff";
import Complaints from "./Views/Complaints";
import NotificationsList from "./Views/NotificationList";
import Revenue from "./Views/Revenue";
import Statistics from "./Views/Statistics";
import Transactions from "./Views/Transactions";

function App() {
  return (
    <DataContext>
      <ReservationContext>
        <StaffContext>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />}>
                <Route index element={<Dashboard />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="staff" element={<Staff />} />
                <Route path="reviews" element={<Complaints />} />
                <Route path="notifs" element={<NotificationsList />} />
                <Route path="revenue" element={<Revenue />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="transaction" element={<Transactions />} />
              </Route>
            </Routes>
          </Router>
        </StaffContext>
      </ReservationContext>
    </DataContext>
  );
}

export default App;
