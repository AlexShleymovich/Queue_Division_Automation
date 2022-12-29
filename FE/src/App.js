import React, { useState } from "react";
import Items from "./Components/Items";
import Login from "./Components/Login";
import ErrorPage from "./Components/ErrorPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserContext } from "./Components/Context";

const App = () => {
  const [userToken, setUserToken] = useState();

  return (
    <Router>
      <UserContext.Provider value={{ userToken, setUserToken }}>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/main" element={<Items />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
