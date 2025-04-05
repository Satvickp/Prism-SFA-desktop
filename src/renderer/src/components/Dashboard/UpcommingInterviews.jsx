import React, { useEffect } from "react";
import Avatar3 from "../../assets/images/lg/avatar3.jpg";
// import Avatar2 from "../../assets/images/lg/avatar2.jpg";
// import Avatar7 from "../../assets/images/lg/avatar7.jpg";
// import Avatar8 from "../../assets/images/lg/avatar8.jpg";
// import Avatar9 from "../../assets/images/lg/avatar9.jpg";
// import Avatar12 from "../../assets/images/lg/avatar12.jpg";
import { useClientFMCGHook } from "../../hooks/clientFMCGHook";
import { useSelector } from "react-redux";
function SkeletonLoader() {
  return (
    <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
      <div className="d-flex align-items-center flex-fill">
        <div
          className="avatar lg rounded-circle img-thumbnail bg-secondary"
          style={{ width: 50, height: 50 }}
        ></div>
        <div className="d-flex flex-column ps-3">
          <div
            className="bg-secondary rounded"
            style={{ width: 120, height: 14, marginBottom: 6 }}
          ></div>
          <div
            className="bg-secondary rounded"
            style={{ width: 80, height: 12 }}
          ></div>
        </div>
      </div>
      <div className="time-block text-truncate">
        <div
          className="bg-secondary rounded"
          style={{ width: 60, height: 12 }}
        ></div>
      </div>
    </div>
  );
}
function UpcommingInterviews() {
  const { getClientFMCG, isLoading } = useClientFMCGHook();
  const ClientFMCG = useSelector((state) => state.ClientFMCG);
  useEffect(() => {
    getClientFMCG();
  }, []);
  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Our Customers</h6>
      </div>
      <div className="card-body">
        <div
          className="flex-grow-1"
          style={{
            height: "480px",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            : ClientFMCG.allClients?.map((customer) => (
                <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                  <div className="d-flex align-items-center flex-fill">
                    <img
                      className="avatar lg rounded-circle img-thumbnail"
                      src={Avatar3}
                      alt="profile"
                    />
                    <div className="d-flex flex-column ps-3">
                      <h6 className="fw-bold mb-0 small-14">
                        {customer.clientFirstName} {customer.clientLastName}
                      </h6>
                      <span className="text-muted">{customer.mobile}</span>
                    </div>
                  </div>
                  <div className="time-block text-truncate">
                    {/* <i className="icofont-clock-time"></i> */}
                    {customer.clientCode}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default UpcommingInterviews;
