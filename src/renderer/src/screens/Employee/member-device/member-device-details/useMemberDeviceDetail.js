import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  apiGetAllDeviceListByMemberId,
  apiHandleApproval,
  apiHandleLogOut,
} from "../../../../api/logout-apis";
import Swal from "sweetalert2";
import { errorMsg, getLocation } from "../../../../helper/exportFunction";
import { tr } from "date-fns/locale";

const fn_refine_data = (data) => {
  return data.map((log) => ({
    memberName: `${log.memberGetDto.firstName} ${log.memberGetDto.lastName}`,
    approvalStatus: log.approvalStatus ?? "N/A",
    actualLocation: log.actualLocation ?? "N/A",
    logoutDate: log.logoutDate ?? "N/A",
    logId: log.id,
  }));
};

export const useMemberDeviceDetail = () => {
  const navigate = useNavigate();
  const { state: routeState } = useLocation();
  const [fetchedDeviceList, setFetchedDeviceList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getCall() {
    if (routeState === null || isNaN(routeState?.memberId)) {
      navigate("/");
      return;
    }
    setLoading(true);
    try {
      const resp = await apiGetAllDeviceListByMemberId(routeState?.memberId);
      const refinedData = fn_refine_data(resp);
      setFetchedDeviceList(refinedData);
    } catch (error) {
      Swal.fire("Oops", errorMsg(error));
    }
    setLoading(false);
  }

  async function logOutMember() {
    setLoading(true);
    try {
      const location = await getLocation();
      await apiHandleLogOut(
        routeState?.memberId,
        location.latitude,
        location.longitude
      );
      getCall();
    } catch (error) {
      Swal.fire("Oops", typeof error === "string" ? error : errorMsg(error));
    }
    setLoading(false);
  }

  useEffect(() => {
    getCall();
  }, []);

  const columns = useMemo(() => {
    let template = [
      {
        name: "Member Name",
        selector: (row) => row.memberName,
        width: "230px",
      },
      {
        name: "Date",
        selector: (row) => row.logoutDate?.split("T")[0],
        width: "150px",
      },
      {
        name: "Location",
        selector: (row) => row.actualLocation,
      },
    ];

    return template;
  }, [fetchedDeviceList]);

  const isAcceptEnable = useMemo(() => {
    return fetchedDeviceList.find(
      (device) => device.approvalStatus === "Pending"
    );
  }, [fetchedDeviceList]);

  const isLogOutEnable = useMemo(() => {
    return fetchedDeviceList.every(
      (device) => device.approvalStatus != "Pending"
    );
  }, [fetchedDeviceList]);

  async function handleUnBlock() {
    setLoading(true);
    try {
      await apiHandleApproval(isAcceptEnable?.logId, "Accepted");
      getCall();
    } catch (error) {
      Swal.fire("Oops", errorMsg(error));
    }
    setLoading(false);
  }

  return {
    fetchedDeviceList,
    loading,
    logOutMember,
    columns,
    isAcceptEnable,
    isLogOutEnable,
    handleUnBlock,
    memberName: routeState?.memberName,
  };
};
