import React, { useState } from "react";
import "../../assets/scss/changes/custom-changes.css";
import { getDateFormat } from "../../helper/date-functions";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import LoadingButton from "../UI/LoadingButton";
import { sassTrue } from "sass";
import { approveEmployeeSchedule } from "../../api/schedules/schedules-api";
import { useDispatch, useSelector } from "react-redux";
import { updateSchedules } from "../../redux/features/schedulesSlice";
function NestableCard(props) {
  //Loading State Button
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  //useSelector - store Data
  const Cred = useSelector((state) => state.Cred);
  const Dispatch = useDispatch();

  const {
    images,
    status,
    startAt,
    endAt,
    members,
    clients,
    cities,
    days,
    isApproved,
    approved,
    id,
  } = props.data;

  const handleApproveSchedule = async (approveSchedule) => {
    if (approveSchedule) {
      setLoadingApprove(true);
      try {
        // Approve Schedule Logic
        const data = {
          isApproved: "ACTIVE",
        };
        const resp = await approveEmployeeSchedule(data, Cred.token, id);
        if (resp.status == "success") {
          Dispatch(updateSchedules({ ...props.data, isApproved: "ACTIVE" }));
          Swal.fire("Success", "Schedule Approved Successfully!");
        } else {
          Swal.fire("Error", "Schedule was not Approved!");
        }
      } catch (error) {
        console.log("Error Approving Schedule", error);
        Swal.fire(
          "Something went wrong!",
          "Unable to Approve Schedule currently"
        );
      } finally {
        setLoadingApprove(false);
      }
    } else {
      setLoadingReject(true);
      try {
        // Reject Schedule Logic
        const data = {
          isApproved: "INACTIVE",
        };
        const resp = await approveEmployeeSchedule(data, Cred.token, id);
        if (resp.status == "success") {
          Dispatch(updateSchedules({ ...props.data, isApproved: "INACTIVE" }));
          Swal.fire("Success", "Schedule Rejected Successfully!");
        } else {
          Swal.fire("Error", "Schedule was not Rejected!");
        }
      } catch (error) {
        console.log("Error Rejecting Schedule", error);
        Swal.fire(
          "Something went wrong!",
          "Unable to Reject Schedule currently"
        );
      } finally {
        setLoadingReject(false);
      }
    }
  };

  return (
    <div
      className="dd-handle mt-2"
      style={{
        border: "2px",
        borderStyle: "solid",
        borderColor: "#dadada",
        position: "relative",
      }}
    >
      {/* <div style={{ position: "absolute", top: "10px", right: "15px"}} onClick={() => alert("working")}><i class="icofont-navigation-menu"></i></div> */}

      {/* <div style={{ position: "absolute", top: "5px", right: "0", cursor: "default", fontWeight: "bold", fontSize: "25px", transform : "rotate(90deg)"}} onClick={() => setDisplay( (prev) => prev === "block" ? "none" : "block")}>...</div>
      <div style={{ display: display, position: "absolute", zIndex : "10", backgroundColor: "#dadada", borderRadius: "5px", top: "15px", right: "30px", cursor: "default", padding : "8px", }} onClick={() => setDisplay( (prev) => prev === "block" ? "none" : "block")}>
        Recreate
      </div> */}

      <Dropdown
        style={{
          position: "absolute",
          top: "15px",
          right: "30px",
          cursor: "default",
        }}
      >
        <Dropdown.Toggle variant="" id="dropdown-basic">
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "0",
              cursor: "default",
              fontWeight: "bold",
              fontSize: "25px",
              transform: "rotate(90deg)",
            }}
          >
            ...
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>Recreate</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="task-info d-flex align-items-center justify-content-between">
        <h6
          className={`${
            isApproved == "ACTIVE"
              ? "bg-success"
              : isApproved == "INACTIVE"
              ? "bg-red"
              : isApproved == "PENDING"
              ? "bg-warning text-black"
              : "bg-black"
          }
           py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0 text-white`}
          // className={`${
          //   isApproved || approved ? "light-success-bg" : "bg-red text-white"
          // } py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0`}
        >
          {/* {isApproved || approved ? "Approved" : "Not Approved"} */}
          {isApproved == "ACTIVE"
            ? "Approved"
            : isApproved == "INACTIVE"
            ? "Not Approved"
            : isApproved == "PENDING"
            ? "Pending"
            : "Completed"}
        </h6>
        <div className="task-priority d-flex flex-column align-items-center justify-content-center">
          <div className="avatar-list avatar-list-stacked m-0">
            {images
              ? images.map((d, i) => (
                  <img
                    key={"jfgsoihgh" + i}
                    className="avatar rounded-circle small-avt"
                    src={d}
                    alt=""
                  />
                ))
              : null}
          </div>
          <span
            className={`badge ${
              status === "MEDIUM"
                ? "bg-warning"
                : status === "High"
                ? "bg-danger"
                : "bg-success"
            } text-end mt-2`}
          >
            {status}
          </span>
        </div>
      </div>
      <p className="py-2 mb-0">
        Member Name :{" "}
        <span className="font-weight-bold">
          {members != null
            ? members.firstName + " " + members.lastName
            : "Unknown Employee"}
        </span>
      </p>
      <p className="py-2 mb-0">
        <i className="icofont-clock-time text-success"></i> Start At :{" "}
        {startAt != null ? getDateFormat(startAt) : "NOT FOUND"}
      </p>
      <p className="py-2 mb-0">
        <i className="icofont-clock-time text-danger"></i> End At :{" "}
        {endAt != null ? getDateFormat(endAt) : "NOT FOUND"}
      </p>

      <div className="pt-2 d-flex flex-wrap">
        {" "}
        <p className="">Client Name :</p>
        {Array.isArray(clients) ? (
          clients.map((client, index) => (
            <p className="ms-1 font-weight-bold" key={index}>
              {client.clientFirstName + " " + client.clientLastName}
              {clients.length - 1 == index ? "" : ", "}
            </p>
          ))
        ) : (
          <p className="ms-1 font-weight-bold">Unknown client</p>
        )}
      </div>

      <div className=" d-flex flex-wrap">
        {" "}
        <p className="">Client available Days :</p>
        {Array.isArray(days) ? (
          days.map((day, index) => (
            <p className="ms-1 font-weight-bold" key={index}>
              {day}
              {days.length - 1 == index ? "" : ", "}
            </p>
          ))
        ) : (
          <p className="ms-1 font-weight-bold">No Days</p>
        )}
      </div>

      <div className="d-flex flex-wrap">
        {" "}
        <p className="">Cities :</p>
        {Array.isArray(cities) ? (
          cities.map((city, index) => (
            <p className="ms-1 font-weight-bold" key={index}>
              {city.cityName} {cities.length - 1 == index ? "" : ", "}
            </p>
          ))
        ) : (
          <p className="ms-1 font-weight-bold">Unknown city</p>
        )}
      </div>

      {props.isProgress && (
        <div className="d-flex flex-wrap gap-2">
          <LoadingButton
            isLoading={loadingApprove}
            className="btn btn-outline-success"
            onClick={() => handleApproveSchedule(true)}
          >
            <i class="icofont-ui-check"></i>
            {" "}
            Approve
          </LoadingButton>
          <LoadingButton
            isLoading={loadingReject}
            className="btn btn-outline-danger"
            onClick={() => handleApproveSchedule(false)}
          >
            <i class="icofont-close-circled"></i>
            {" "}
            Reject
          </LoadingButton>
        </div>
      )}
    </div>
  );
}

export default NestableCard;
