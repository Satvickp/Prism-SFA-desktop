import { useDispatch, useSelector } from "react-redux";
import { permissionIds } from "../constants/constants";
import { getAllMembers, getEveryMemberExist } from "../api/member/member-api";
import { deleteAllMembers, setMembers } from "../redux/features/memberSlice";
import Swal from "sweetalert2";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function useMemberHook() {
  const Dispatch = useDispatch();
  const Member = useSelector((state) => state.Member);
  const Cred = useSelector((state) => state.Cred);
  const [prevUserId, setPrevUserId] = useState(null);

  const { userId } = useParams();

  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  async function get(USERID = userId) {
    setPrevUserId(userId);
    if (
      MemberPermission.some((item) =>
        MemberPermission?.some(
          (item) =>
            item == permissionIds.SUPER_ADMIN ||
            item == permissionIds.REPORTING_MANAGER ||
            item == permissionIds.VIEW_MANAGER
        )
      )
    ) {
      setIsLoading(true);
      try {
        if (Member.allMembers.length <= 0 || userId != prevUserId) {
          Dispatch(deleteAllMembers());
          // const MembersArrays = MemberPermission.some(
          //   (item) => item === permissionIds.SUPER_ADMIN
          // )
          const MembersArrays = false
            ? await getEveryMemberExist(0, Cred.token, userId)
            : await getAllMembers(0, Cred.token, userId);
          if (MembersArrays.data.length >= 0) {
            Dispatch(
              setMembers({
                allMembers: MembersArrays.data,
                paginationData: MembersArrays.paginationData,
              })
            );
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Employees. Please try After Some Time",
          icon: "error",
        });
        setIsError(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function getLoggedInUserMembers() {
    if (
      MemberPermission.some((item) =>
        MemberPermission?.some(
          (item) =>
            item == permissionIds.SUPER_ADMIN ||
            item == permissionIds.REPORTING_MANAGER ||
            item == permissionIds.VIEW_MANAGER
        )
      )
    ) {
      setIsLoading(true);
      try {
        if (Member.allMembers.length <= 0) {
          const MembersArrays = false
            ? await getEveryMemberExist(0, Cred.token, Cred.sub)
            : await getAllMembers(0, Cred.token, Cred.sub);
          if (MembersArrays.data.length >= 0) {
            Dispatch(
              setMembers({
                allMembers: MembersArrays.data,
                paginationData: MembersArrays.paginationData,
              })
            );
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Employees. Please try After Some Time",
          icon: "error",
        });
        setIsError(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function getMembersArrayByArrayIds() {
    try {
      if (Member.allMembers.length > 0) {
        const result = Member.allMembers.map((item) => ({
          employeeId: item.id || null,
          employeeName: `${item.firstName} ${item.lastName}`,
        }));
        return result;
      }
      return [];
    } catch (error) {
      console.log("Error ::", error);
      Swal.fire({
        title: "Something went wrong!",
        text: "Unable to Access Employees Name",
        icon: "error",
      });
    }
  }

  async function getEveryMembers() {
    setIsLoading(true);
    try {
      const MembersArrays = MemberPermission.some(
        (item) => item === permissionIds.SUPER_ADMIN
      );
      if (MembersArrays) {
        const resp = await getEveryMemberExist(Cred.token, 0, Cred.sub);
        if (resp.data?.length >= 0) {
          Dispatch(
            setMembers({
              allMembers: resp.data,
              paginationData: resp.data.length,
            })
          );
        }
        return resp.data;
      } else {
        const resp = await getAllMembers(0, Cred.token, Cred.sub);
        if (resp.data?.length >= 0) {
          Dispatch(
            setMembers({
              allMembers: resp.data,
              paginationData: resp.paginationData,
            })
          );
        }
        return resp.data;
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Employees. Please try After Some Time",
        icon: "error",
      });
      console.log("Error::", error);
      setIsError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    get,
    isLoading,
    isError,
    getMembersArrayByArrayIds,
    getLoggedInUserMembers,
    getEveryMembers,
  };
}
