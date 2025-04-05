// MainIndex.js

import React, { useEffect } from "react";
import Header from "../../components/common/Header";
import { constants } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {
  getClientDetail,
  getMemberDetail,
  getPermissionOfAMember,
  getPermissionOfClientFmcg,
} from "../../api/member/member-api";

import {
  deleteCredentials,
  addCredentials,
} from "../../redux/features/credentialSlice";

import { setMemberPermissions } from "../../redux/features/permissionSlice";
import { useState } from "react";
import Loading from "../../components/UI/Loading";
import MemberRoutes from "./MemberRoutes";
import ClientRoutes from "./ClientRoutes";

function MainIndex(props) {
  const [loading, setLoading] = useState(true);
  const Dispatch = useDispatch();
  const Cred = useSelector((state) => state.Cred);
  const isMember = window.localStorage.getItem("isMember");

  async function get() {
    setLoading(true);
    try {
      if (isMember == "true") {
        const decode = await jwtDecode(Cred.token);
        const expTime = new Date(decode.exp * 1000);
        const currentTime = new Date();
        if (currentTime > expTime) {
          window.localStorage.removeItem(constants.token_store);
          window.localStorage.removeItem("isMember");
          Dispatch(deleteCredentials());
        } else {
          const data = await getMemberDetail(decode.id, Cred.token);
          const { permission, status } = await getPermissionOfAMember(
            decode.id,
            Cred.token
          );
          Dispatch(setMemberPermissions(permission));
          Dispatch(addCredentials(data));
        }
      } else {
        const decode = await jwtDecode(Cred.token);
        const expTime = new Date(decode.exp * 1000);
        const currentTime = new Date();
        if (currentTime > expTime) {
          window.localStorage.removeItem(constants.token_store);
          window.localStorage.removeItem("isMember");
          Dispatch(deleteCredentials());
        } else {
          const data = await getClientDetail(decode.id, Cred.token);
          const { permission, status } = await getPermissionOfClientFmcg(
            decode.id,
            Cred.token
          );
          Dispatch(setMemberPermissions(permission));
          Dispatch(addCredentials(data));

        }
      }
    } catch (error) {
      console.log("Error:: ", error);
      window.localStorage.removeItem(constants.token_store);
      window.localStorage.removeItem("isMember");
      Dispatch(deleteCredentials());
    }
    setLoading(false);
  }

  useEffect(() => {
    get();
    return () => {};
  }, []);

  return (
    <div className="main px-lg-4 px-md-4">
      {loading ? (
        <Loading animation={"border"} />
      ) : isMember == "true" ? (
        <>
          <Header />
          <MemberRoutes />
        </>
      ) : (
        <>
          <Header />
          <ClientRoutes />
        </>
      )}
    </div>
  );
}

export default MainIndex;
