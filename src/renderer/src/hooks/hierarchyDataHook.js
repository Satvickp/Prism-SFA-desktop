import { useDispatch, useSelector } from "react-redux";
import { API_URL, HIERARCHY_DATA_ENDPOINT } from "../constants/api-url";
import axios from "axios";
import { useState } from "react";
import { getLeaveTypes } from "../api/member/member-leave-api";
import { setAllLeaveTypes } from "../redux/features/dropdownFieldSlice";

export default function useHierarchyData() {
  const Cred = useSelector((state) => state.Cred);
  const allLeaveType = useSelector(
    (state) => state.DropDownsField.allLeaveTypes
  );
  const Dispatch = useDispatch();
  const header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + Cred.token,
  };

  const [hierarchyMembersData, setHierarchyMembersData] = useState([]);
  const [hierarchyAttendanceData, setHierarchyAttendanceData] = useState([]);
  const [hierarchyLeavesData, setHierarchyLeavesData] = useState([]);
  const [hierarchyClientsData, setHierarchyClientsData] = useState([]);
  const [hierarchyBeatsData, setHierarchyBeatsData] = useState([]);
  const [hierarchyExpenseData, setHierarchyExpenseData] = useState([]);

  //utils function
  function organiseAttendance(response) {
    let myArray = [];

    response.forEach((item) => {
      let result = myArray.find((val) => val.id === item.memberId);
      const checkInDay = item?.checkIn?.split("T")[0].split("-")[2] || null;
      const checkOutDay = item?.checkOut?.split("T")[0].split("-")[2] || null;
      const memberName = `${item.firstName ? item.firstName : ""} ${
        item.lastName ? item.lastName : ""
      }`;

      const attendanceEntry = {
        checkInDay,
        checkOutDay,
        memberName,
        checkInTime: item.checkIn,
        checkOutTime: item.checkOut,
      };

      if (result) {
        result.memberAttendance.push(attendanceEntry);
      } else {
        let newMember = {
          id: item.memberId,
          memberName,
          data: item,
          memberAttendance: [attendanceEntry],
        };
        myArray.push(newMember);
      }
    });

    return myArray;
  }

  function transformData(inputData) {
    // Group data by memberId
    const groupedData = inputData.reduce((acc, item) => {
      if (!acc[item.memberId]) {
        acc[item.memberId] = [];
      }

      acc[item.memberId].push(item);
      return acc;
    }, {});
    return Object.values(groupedData).flat();
  }

  async function getHierarchyMember(id) {
    try {
      const resp = await axios.get(
        API_URL.backend_url + HIERARCHY_DATA_ENDPOINT.GET_MEMBER_ENDPOINT + id,
        {
          headers: header,
        }
      );
      // if (resp?.data?.content?.length > 0) {
        setHierarchyMembersData(resp.data.content);
      // }
      return resp.data.content
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getHierarchyAttendance(id) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    try {
      const resp = await axios.get(
        API_URL.backend_url +
          HIERARCHY_DATA_ENDPOINT.GET_ATTENDANCE_ENDPOINT +
          `reportingManagerId=${id}&month=${
            currentMonth <= 9
              ? `0${currentMonth}&page=0&pageSize=10`
              : currentMonth
          }&year=${currentYear}`,
        {
          headers: header,
        }
      );
      const groupedData = transformData(resp?.data?.content);
      // console.log(groupedData);
      const result = organiseAttendance(groupedData);
      // console.log(result);
      // if (resp.data?.content?.length > 0) {
        setHierarchyAttendanceData(result);
      // }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getHierarchyLeave(id) {
    try {
      if (allLeaveType.length < 0) {
        const leaveTypes = await getLeaveTypes(Cred.token);
        Dispatch(setAllLeaveTypes(leaveTypes));
      }
      const resp = await axios.get(
        API_URL.backend_url +
          HIERARCHY_DATA_ENDPOINT.GET_LEAVE_ENDPOINT +
          `${id}?page=0&pageSize=500&sortBy=startAt`,
        {
          headers: header,
        }
      );
      // if (resp?.data?.content?.length > 0) {
        setHierarchyLeavesData(resp.data.content);
      // }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getHierarchyClient(id) {
    try {
      const resp = await axios.get(
        API_URL.backend_url +
          HIERARCHY_DATA_ENDPOINT.GET_CLIENT_ENDPOINT +
          `${id}?page=0&pageSize=500`,
        {
          headers: header,
        }
      );
      // if (resp.data.length > 0) {
        setHierarchyClientsData(resp.data.content);
      // }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getHierarchyBeat(id) {
    try {
      const resp = await axios.get(
        API_URL.backend_url + HIERARCHY_DATA_ENDPOINT.GET_BEATS_ENDPOINT + id,
        {
          headers: header,
        }
      );
      // if (resp.data.length > 0) {
        setHierarchyBeatsData(resp.data?.content);
      // }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getHierarchyExpense(id) {
    try {
      const resp = await axios.get(
        API_URL.backend_url +
          HIERARCHY_DATA_ENDPOINT.GET_EXPENSE_ENDPOINT +
          `${id}?page=0&pageSize=500`,
        {
          headers: header,
        }
      );
      // if (resp.data.content.length > 0) {
        setHierarchyExpenseData(resp.data.content);
      // }
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getHierarchyMember,
    getHierarchyAttendance,
    getHierarchyLeave,
    getHierarchyClient,
    getHierarchyBeat,
    getHierarchyExpense,
    hierarchyMembersData,
    hierarchyAttendanceData,
    hierarchyLeavesData,
    hierarchyClientsData,
    hierarchyBeatsData,
    hierarchyExpenseData,
  };
}
