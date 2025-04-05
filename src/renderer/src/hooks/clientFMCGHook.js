import { useDispatch, useSelector } from "react-redux";
import { permissionIds } from "../constants/constants";
import Swal from "sweetalert2";
import { useState } from "react";
import { setClientsFMCG } from "../redux/features/clientFMCGSlice";
import { getAllClients, getAllClientsByReportingManager } from "../api/clients/clientfmcg-api";

export function useClientFMCGHook() {
  const Dispatch = useDispatch();
  const ClientFMCG = useSelector((state) => state.ClientFMCG);
  const Cred = useSelector((state) => state.Cred);
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);


  async function getClientFMCG() {
    setIsLoading(true);
    try {
      if (ClientFMCG.allClients.length <= 0) {
        const resp = MemberPermission?.some(item => 
          item == permissionIds.SUPER_ADMIN
        )
          ? await getAllClients(Cred.token, 0, Cred.sub)
          : await getAllClientsByReportingManager(Cred.token, 0, Cred.sub);
        Dispatch(
          setClientsFMCG({
            allClients: resp.data,
            paginationData: resp.paginationData,
          })
        );
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Clients. Please try After Some Time",
        icon: "error",
      });
    }
    setIsLoading(false);
  }

  return { getClientFMCG, isLoading, isError };
}
