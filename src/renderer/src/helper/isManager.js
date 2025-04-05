import { useMemo } from "react";
import { useSelector } from "react-redux";
import { constants } from "../constants/constants";

export const useIsManager = () => {
  const Permission = useSelector((state) => state.Permission.memberPermissions);
  const isManager = useMemo(
    // () => Permission.find((item) => item.includes("Manager")),
    () => Permission.some((item) => item === "Reporting_Manager"),
    [Permission]
  );
  return isManager;
};

export const useIsSuperAdmin = () => {
  const Permission = useSelector((state) => state.Permission.memberPermissions);
  const isSuperAdmin = useMemo(
    () => Permission.some((item) => item == "Super_Admin"),
    [Permission]
  );
  return isSuperAdmin;
};

export const useIsClient = () => {
  const Cred = useSelector((state) => state.Cred);
  return !!Cred?.clientCode;
};

export const useIsFMCG = () => {
  const isClientFmcg = window.localStorage.getItem(constants.clientType);
  return isClientFmcg === "CLIENT_FMCG";
};
