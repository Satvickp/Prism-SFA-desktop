import React, { useEffect, useState } from "react";
import ClientProfileCard from "../../components/Clients/ClientProfileCard";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getTenantByReportingManagerId } from "../../api/tenant/tenant-api";
import { setTenantId } from "../../redux/features/tenantSlice";
import Swal from "sweetalert2";

function Profile() {
  const Cred = useSelector((state) => state.Cred);
  const TenantDetails = useSelector((state) => state.Tenants);
  const { memberPermissions } = useSelector((state) => state.Permission);
  const Dispatch = useDispatch();
  console.log("TenantDetails?.tenantId: ", TenantDetails?.tenantId);
  console.log("token ", Cred.token);
  useEffect(() => {
    const GetTenantId = async () => {
      try {
        const resp = await getTenantByReportingManagerId(
          Cred?.token,
          Cred?.sub
        );

        if (resp) {
          Dispatch(setTenantId(resp.tenantId));
        }
        console.log("responce :", resp);
      } catch (error) {
        console.log("Error: ", error);
        Swal.fire("Error", "Unable to fetch Tenant Id");
      }
    };

    if (TenantDetails?.tenantId <= 0) {
      GetTenantId();
    }
  }, [TenantDetails?.tenantId]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Employee Profile" />
      <div className="row g-3">
        <div className="col-xl-8 col-lg-12 col-md-12">
          <ClientProfileCard
            designation="."
            details={Cred.employeeId}
            profileName={Cred.firstName + Cred.lastName}
            email={Cred.email}
            phone={Cred.mobile}
            dob={Cred.dob}
            tenantId={TenantDetails.tenantId}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
