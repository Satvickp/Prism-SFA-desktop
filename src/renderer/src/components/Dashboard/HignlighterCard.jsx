import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import useInventory from "../../screens/Inventory/useInventory";
import { useNavigate } from "react-router-dom";
const HignlighterCard = () => {
  const navigate = useNavigate();
  const { loading, paginationData } = useInventory();
  const totalInventory = paginationData.totalElements;

  const navigateToInventory = () => {
    navigate("inventory");
  };
  return (
    <div className="container">
      <div className="row g-2">
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 h-25 w-100"
            style={{ borderRadius: "16px", minHeight: "120px" }}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <h6 className="text-dark mb-2 font-weight-bold ">
                Total Revenue
              </h6>
              <h5 className="text-dark font-weight-bold">
                ₹ 1250
                <span className="ms-5">
                  <FaMoneyBillWave />
                </span>
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 h-25 w-100"
            style={{ borderRadius: "16px", minHeight: "120px" }}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <h6 className="text-dark mb-2 font-weight-bold">Total Sales</h6>
              <h5 className="text-dark font-weight-bold">
                ₹ 1250
                <span className="ms-5">
                  <FaShoppingCart />
                </span>
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 h-25 w-100"
            style={{ borderRadius: "16px", minHeight: "120px" }}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <h6 className="text-dark mb-2 font-weight-bold">
                Popular Product
              </h6>
              <h5 className="text-dark font-weight-bold">
                1250{" "}
                <span className="ms-5">
                  <FaCrown />
                </span>
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-6" onClick={navigateToInventory}>
          <div
            className="card shadow-sm border-0 h-25 w-100"
            style={{ borderRadius: "16px", minHeight: "120px" }}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <h6 className="text-dark mb-2 font-weight-bold">
                Total Inventory
              </h6>
              <h5 className="text-dark font-weight-bold">
                {totalInventory}
                <span className="ms-5">
                  <FaBoxOpen />
                </span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HignlighterCard;

// import React from "react";
// import InterviewImg from "../../assets/images/interview.svg";

// function HignlighterCard() {
//   return (
//     <div className="card bg-primary">
//       <div className="card-body row">
//         <div className="col">
//           <span className="avatar lg bg-white rounded-circle text-center d-flex align-items-center justify-content-center">
//             <i className="icofont-file-text fs-5"></i>
//           </span>
//           <h1 className="mt-3 mb-0 fw-bold text-white">1546</h1>
//           <span className="text-white">Applications</span>
//         </div>
//         <div className="col">
//           <img className="img-fluid" src={InterviewImg} alt="interview" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HignlighterCard;
