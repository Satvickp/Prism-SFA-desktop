import React from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./map-view.css";
import { useMemberMapView } from "./useMemberMapView";
import FilterComponent from "./FilterComponent";

function MemberMapView() {
  const { isLoaded, containerStyle, Loading, getCall, fetchMemberCheckIn } =
    useMemberMapView();
  return (
    <div style={{ position: "relative" }}>
      <h5 className="mb-2 fs-6 fw-bold text-error">
        Most Recent Check-ins from Members
      </h5>
      <FilterComponent
        loading={Loading == 1}
        onSubmit={(e) => {
          getCall(e.value);
        }}
      />

      <>
        {!isLoaded ||
          (Loading !== 0 && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: 26.4499, lng: 80.3319 }}
              zoom={10}
              options={{
                disableDefaultUI: true,
                gestureHandling: "cooperative",
                mapTypeId: "terrain",
              }}
            >
              {fetchMemberCheckIn.map((marker, index) => (
                <Marker key={index} position={marker.position}>
                  <InfoWindow
                    position={marker.position}
                    options={{
                      headerDisabled: true,
                    }}
                  >
                    <div className="info-window">
                      <strong>{marker.memberName}</strong>
                      <br />
                      <span>{marker.mobile}</span>
                      <br />
                      <span>{marker.outlet}</span>
                      <br />
                      <span>{marker.checkOutTime}</span>
                      <div className="additional-details">
                        <strong>Work Type : {marker.workingWith ?? ""}</strong>
                        {marker.workingWith === "Member" &&
                          marker.workingWithName && (
                            <strong style={{ fontSize: "11px" }}>
                              Working With {marker.workingWithName ?? ""}
                            </strong>
                          )}
                      </div>
                    </div>
                  </InfoWindow>
                </Marker>
              ))}
            </GoogleMap>
          ))}
      </>
    </div>
  );
}

export default React.memo(MemberMapView);
