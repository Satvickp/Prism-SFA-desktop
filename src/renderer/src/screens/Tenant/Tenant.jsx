import React, { useEffect, useState } from "react";
import { Button, Spinner, Toast } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
import { getAllTenant } from "../../api/tenant/tenant-api";
import { setTenants } from "../../redux/features/tenantSlice";
import DataTable from "react-data-table-component";


function Tenant() {
  //Redux
  const Dispatch = useDispatch();
  const TenantDetails = useSelector((state) => state.Tenants);
  const CredDetails = useSelector((state) => state.Cred);

  // UI Manipulation Variables
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);


  //Pagination Variables
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  //Get All Tenants details when Page is Loaded
  useEffect(() => {
    const GetAllTenants = async () => {
      try {
        const resp = await getAllTenant(CredDetails?.token, page, size);
        if (resp) {
          Dispatch(setTenants({ allTenants: resp.tenant, pageable: resp.page }));
          setPage(resp?.page?.number || 0);
          setSize(resp?.page?.size || 20);
        }
      } catch (error) {
        console.log("Error: ", error);
        Swal.fire("Error", "Unable to fetch Tenant Details");
      }
    };

    if (TenantDetails?.allTenants.length <= 0) {
      GetAllTenants();
    }
  }, [TenantDetails?.allTenants]);

  var columnT = "";
  columnT = [
    {
      name: "Tenant Name",
      selector: (row) => row.name,
      sortable: false,
    },
    {
      name: "Tenant Id",
      selector: (row) => row.tenantId,
      sortable: true,
    },
    {
      name: "Tenant Domain",
      selector: (row) => row.domain,
      sortable: false,
    },
    {
      name: "Tenant Status",
      selector: (row) => row.status ,
      sortable: true,
    }
  ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader headerTitle="Tenants" />

          <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-2 py-1 pb-4">
            <div className="col-auto d-flex flex-wrap"></div>
            {Tenant?.allTenants?.length > 0 ? (
              <div className="col-sm-12">
                <div className="container-xxl">
                  <div className="row clearfix g-3">
                    <div className="col-sm-12">
                      <DataTable
                        id="Data_table"
                        columns={columnT.map((column) => ({
                          ...column,
                          width: `${column.name.length * 10 + 40}px`,
                          wrap: true,
                          position: "relative",
                        }))}
                        title={Tenant?.allTenants.name}
                        data={Tenant?.allTenants || []}
                        defaultSortField="title"
                        // onChangePage={handlePageChange}
                        pagination
                        selectableRows={false}
                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                        highlightOnHover={true}
                        page
                        paginationServer
                        paginationTotalRows={Tenant?.pageable?.totalElements || 0}
                        paginationComponentOptions={{
                          noRowsPerPage: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-size: 18px; font-weight: bold;">
                No More Tenants To Load.
              </p>
            )}
          </div>
          <div>
            <Toast show={showToast} onClose={() => setShowToast(false)}>
              <Toast.Header>
                <strong className="mr-auto">No More Tenants to load</strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      )}{" "}
    </>
  );
}

export default Tenant;
