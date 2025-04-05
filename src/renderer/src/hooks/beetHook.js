import { useDispatch, useSelector } from "react-redux";
import { permissionIds } from "../constants/constants";
import { getAllMembers, getEveryMemberExist } from "../api/member/member-api";
import { deleteAllMembers, setMembers } from "../redux/features/memberSlice";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  deleteAllClientsFMCG,
  setClientsFMCG,
} from "../redux/features/clientFMCGSlice";
import {
  getAllClients,
  getAllClientsByReportingManager,
} from "../api/clients/clientfmcg-api";
import {
  getAllBeetByMemberId,
  getAllBeetWithoutFilter,
  getAllDoctorsByBeatId,
} from "../api/beet/beet-api";
import { setBeets } from "../redux/features/beetSlice";
import axios from "axios";
import { API_URL, DOCTORS_DATA_ENDPOINT } from "../constants/api-url";

export function useBeetApiHook(pageNumber, size) {
  const Dispatch = useDispatch();
  const { content, totalElements, totalPages, page } = useSelector(
    (state) => state.Beets
  );

  const Cred = useSelector((state) => state.Cred);
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  async function GetAllBeets() {
    setIsLoading(true);
    try {
      if (content.length <= 0) {
        const permission = MemberPermission.some(
          (item) => item == permissionIds.SUPER_ADMIN
        );

        if (permission) {
          const resp = await getAllBeetWithoutFilter(
            Cred.token,
            pageNumber,
            size
          );
          if (resp) {
            Dispatch(
              setBeets({
                content: resp.beets,
                totalElements: resp.pageable.totalElements,
                totalPages: resp.pageable.totalPages,
                page: resp.pageable.number,
              })
            );
          }
        } else {
          const resp = await getAllBeetByMemberId(
            Cred?.token,
            pageNumber,
            size,
            Cred.sub
          );
          if (resp) {
            Dispatch(setBeets(resp));
          }
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Beets. Please try After Some Time",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function GetAllBeetsByMemberId(memberId) {
    setIsLoading(true);
    try {
      if (memberId) {
        const resp = await getAllBeetByMemberId(
          Cred?.token,
          pageNumber,
          size,
          memberId
        );
        if (resp) {
          Dispatch(setBeets(resp));
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Member Beets. Please try After Some Time",
        icon: "error",
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function getAllDoctorsByBeetId(beatId) {
    setIsLoading(true);
    try {
      if (beatId) {
        const response = await getAllDoctorsByBeatId(Cred.token, beatId);
        return response;
      }
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Doctors. Please try After Some Time",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    GetAllBeets,
    isLoading,
    isError,
    getAllDoctorsByBeetId,
    GetAllBeetsByMemberId,
  };
}
