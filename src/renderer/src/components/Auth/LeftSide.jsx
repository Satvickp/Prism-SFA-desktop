import React from "react";
import loginImg from "../../assets/images/login-img.svg";
import IconDark from "../../assets/images/icon-dark.png";
import { constants } from "../../constants/constants";
function LeftSide() {

  return (
    <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
      <div style={{ maxWidth: "25rem" , marginBottom:10 }}>
        <div className="text-center mb-5">
        <img src={require("../../assets/images/icon-light.png")} alt="Icon" className="left-side-changes-logo w-100 h-100 p-4" />
        </div>
        <div className="mb-5">

          <h2 className="color-900 text-center">
            {constants.website_name} Let's Management Better
          </h2>
        </div>
      </div>
    </div>
  );
}
export default LeftSide;
