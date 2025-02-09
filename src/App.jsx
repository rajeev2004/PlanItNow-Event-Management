import React from "react";
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import AttendingEvent from "./components/AttendingEvent";
import Dashboard from "./components/Dashboard";
import EditEvent from "./components/EditEvent";
import Login from "./components/Login";
import MyEvent from "./components/MyEvent";
import Register from "./components/Register";
import ViewEvent from "./components/ViewEvent";
import Notfound from "./components/Notfound";
import GuestLogin from "./components/GuestLogin";
function App(){
    return (
      <Router>
          <div>
              <Routes>
                  <Route exact path="/" element={<Register />}/>
                  <Route path="/login" element={<Login />}/>
                  <Route path="/homepage" element={<Dashboard />}/>
                  <Route path="/viewEvent" element={<ViewEvent />}/>
                  <Route path="/myEvents" element={<MyEvent />}/>
                  <Route path="/AttendingEvent" element={<AttendingEvent />}/>
                  <Route path="/editEvent" element={<EditEvent />}/>
                  <Route path="/guestLogin" element={<GuestLogin />}/>
                  <Route path="*" element={<Notfound />}/>
              </Routes>
          </div>
      </Router>
    );
  }
  export default App;