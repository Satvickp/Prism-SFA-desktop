import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { errorMsg } from "../../../helper/exportFunction";
import {
  apiGetAllMemberByReportingManagerPaginated,
  apiGetAllMemberPaginated,
} from "../../../api/member/member-api";
import { useNavigate } from "react-router-dom";
import { useIsSuperAdmin } from "../../../helper/isManager";

const fn_refineData = (data) => {
  return data.map((mem) => ({
    memberName: `${mem.firstName} ${mem.lastName}`,
    email: `${mem.email}`,
    employeeId: `${mem.employeeId}`,
    mobile: `${mem.mobile}`,
    joiningDate: `${mem.joiningDate}`,
    dob: `${mem.dob}`,
    memberId: mem.id,
  }));
};

export const useMemberList = () => {
  const [memberList, setMemberList] = useState();
  const navigate = useNavigate();
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPage: 0,
    totalElement: 0,
  });
  const Cred = useSelector((state) => state.Cred);
  const [loading, setLoading] = useState(false);
  const isSuperAdmin = useIsSuperAdmin();

  async function helperCall(page) {
    setLoading(true);
    try {
      const resp = isSuperAdmin
        ? await apiGetAllMemberPaginated(page)
        : await apiGetAllMemberByReportingManagerPaginated(Cred.id, page);
      setMemberList(fn_refineData(isSuperAdmin ? resp.member : resp.content));
      setPaginationData(
        isSuperAdmin
          ? resp.page
          : {
              page: resp.page,
              totalElement: resp.totalElement,
              totalPage: resp.totalPage,
            }
      );
    } catch (error) {
      console.log(error);
      Swal.fire("Oops", errorMsg(error), "warning");
    }
    setLoading(false);
  }

  useEffect(() => {
    helperCall(0);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        name: "ID",
        selector: (row) => row.employeeId,
        sortable: true,
         width: "100px",
      },
      {
        name: "Name",
        selector: (row) => row.memberName,
        sortable: true,
      },
      {
        name: "Mobile",
        selector: (row) => row.mobile,
        sortable: true,
        width: "150px",
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
        width: "240px",
      },
      {
        name: "DOB",
        selector: (row) => row.dob,
        sortable: true,
        minWidth: "120px",
      },
      {
        name: "Joining Date",
        selector: (row) => row.joiningDate,
        sortable: true,
        width: "240px",
      },
    ];
  }, [memberList]);

  const handlePageChange = (page) => {
    if (page <= paginationData.totalPage) {
      helperCall(page);
    }
  };

  const onRowClicked = (row) => {
    navigate("/member-expense-report", {
      state: {
        isExpense: true,
        ...row,
      },
    });
  };

  return {
    memberList,
    paginationData,
    loading,
    columns,
    handlePageChange,
    onRowClicked,
    navigate,
  };
};
