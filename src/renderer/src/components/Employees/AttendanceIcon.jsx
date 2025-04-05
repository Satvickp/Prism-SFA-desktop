import React, { useState } from "react";
import "../../assets/scss/changes/custom-changes.css";
import { getTimeFormat } from "../../helper/date-functions";
import Popup from "reactjs-popup";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function AttendanceIcon({ attendanceForDay }) {
  const [hoverCard, setHoverCard] = useState(false);

  const handleMouseOver = () => {
    setHoverCard(true);
  };

  const handleMouseOut = () => {
    setHoverCard(false);
  };

  function calculateHours(checkinTime, checkoutTime) {
    const checkin = new Date(checkinTime);
    const checkout = new Date(checkoutTime);

    const differenceMs = checkout - checkin;
    const totalMinutes = Math.floor(differenceMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}H , ${minutes}M`;
  }
  const workingHour = calculateHours(
    attendanceForDay.checkInTime,
    attendanceForDay.checkOutTime
  );
  const renderTooltip = (props) => (
    <Tooltip id="attendance-tooltip" {...props}>
      <div>
        {attendanceForDay?.isPresent ? (
          <div>
            {attendanceForDay.checkInTime && (
              <p>
                CheckIn :{" "}
                {getTimeFormat(new Date(attendanceForDay.checkInTime))}
              </p>
            )}

            <p>
              CheckOut :{" "}
              {attendanceForDay.checkOutTime
                ? getTimeFormat(new Date(attendanceForDay.checkOutTime))
                : "NA"}
            </p>

            <p>
              Working Hour :{attendanceForDay.checkOutTime ? workingHour : "NA"}
            </p>
          </div>
        ) : (
          "No checkIn"
        )}
      </div>
    </Tooltip>
  );

  return (
    <td style={{ width: "50px" }}>
      {attendanceForDay.isPresent ? (
        <OverlayTrigger
          placement="top"
          overlay={renderTooltip}
          delay={{ show: 250, hide: 400 }}
        >
          {/* <i className="icofont-check-circled text-success"></i> */}
          <p className="text-success">P</p>
        </OverlayTrigger>
      ) : (
        // <i className="icofont-close-circled text-danger"></i>
        <p className="text-danger">A</p>
      )}
    </td>
  );
}

export default AttendanceIcon;
