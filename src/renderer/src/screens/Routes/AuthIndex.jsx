
import React from "react";
import { Route, Routes } from "react-router-dom";
import LeftSide from "../../components/Auth/LeftSide";
import Page404 from "../../components/Auth/Page404";
import SignIn from "../../components/Auth/SignIn";

function AuthIndex() {
  return (
    <div className="main p-2 py-3 p-xl-5">
      <div className="body d-flex p-0 p-xl-5">
        <div className="container-xxl">
          <div className="row g-0">
            <LeftSide />
            <Routes>
              <Route exact path={`${process.env.PUBLIC_URL}/`} element={<SignIn />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthIndex;
