import { useJsApiLoader } from "@react-google-maps/api";
import { constants } from "../../../constants/constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert } from "bootstrap";
import {
  getAllMembersLastCheckInAndOutByReportingManagerIdAndCityIdApi,
  getAllMembersLastCheckInAndOutSuperAdminIdAndCityIdApi,
} from "../../../api/beet-journey/beet-journey-logs";
import Swal from "sweetalert2";
import { getTimeFormat } from "../../../helper/date-functions";
import { useIsSuperAdmin } from "../../../helper/isManager";

export const useMemberMapView = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: constants.google_map_api_key,
  });
  const containerStyle = {
    width: "100%",
    height: "85vh",
  };

  const Cred = useSelector((state) => state.Cred);

  const [fetchMemberCheckIn, setFetchMemberCheckIn] = useState([]);
  const isSuperAdmin = useIsSuperAdmin();

  const StartCenter = { lat: 26.4499, lng: 80.3319 };

  const [Loading, setLoading] = useState(-1);

  async function getCall(cityId) {
    setLoading(cityId ? 1 : 0);
    try {
      const resp = isSuperAdmin
        ? await getAllMembersLastCheckInAndOutSuperAdminIdAndCityIdApi(
            cityId ? cityId : Cred?.cities?.[0]?.id ?? 1,
            Cred.token
          )
        : await getAllMembersLastCheckInAndOutByReportingManagerIdAndCityIdApi(
            Cred.sub,
            cityId ? cityId : Cred?.cities?.[0]?.id,
            Cred.token
          );

      const refinedRespList = resp.map((e) => ({
        position: {
          lat: parseFloat(e.latitude),
          lng: parseFloat(e.longitude),
        },
        memberName:
          e?.memberGetDto?.firstName + " " + e?.memberGetDto?.lastName ?? "N/A",
        mobile: e?.memberGetDto?.mobile ?? "N/A",
        outlet: e?.outletGetDto?.outletName ?? "N/A",
        beetJourneyPlanStatus: e?.beetJourneyPlanStatus ?? "N/A",
        checkOutTime: getTimeFormat(new Date(e.checkOut)),
        workingWithName:
          e?.workingWithMemberDtoList
            ?.map((e) => e.memberName)
            .join(", ") ?? null,
        workingWith: e.workingWith,
      }));
      setFetchMemberCheckIn(refinedRespList);
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong",
        text: error?.response?.data?.message ?? "Please Try Again",
        icon: "warning",
      });
    }
    setLoading(-1);
  }

  useEffect(() => {
    getCall();
  }, []);

  return {
    isLoaded,
    StartCenter,
    containerStyle,
    fetchMemberCheckIn,
    Loading,
    getCall,
  };
};
