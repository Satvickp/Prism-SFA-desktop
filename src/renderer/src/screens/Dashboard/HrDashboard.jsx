import React from "react";
import Employeesavaibility from "../../components/Dashboard/Employeesavaibility";
import HignlighterCard from "../../components/Dashboard/HignlighterCard";
import InterviewCard from "../../components/Dashboard/InterviewCard";
import TopPerformers from "../../components/Dashboard/TopPerformers";
import UpcommingInterviews from "../../components/Dashboard/UpcommingInterviews";
import GeneralChartCard from "../../components/Dashboard/GeneralChartCardDropDown";
import {
  EmployeeInfoChartData,
  TopHiringSourcesChartData,
} from "../../components/Data/DashboardData";
import { useMemberList } from "../reports/expense-report/useMemberList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function HrDashboard() {
  const navigate = useNavigate();
  const Cred = useSelector((state) => state.Cred);
  const ClientFMCG = useSelector((state) => state.ClientFMCG);
  const CredId = Cred.sub;
  const { memberList, loading } = useMemberList();
  //   const men = memberList?.length;
  const TotalEmployeesChartData = {
    options: {
      align: "center",
      chart: {
        height: 250,
        type: "donut",
        align: "center",
      },
      labels: ["Man", "Women"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        show: true,
      },
      colors: ["var(--chart-color4)", "var(--chart-color3)"],
      series: [20, 0],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const handleNavigateToExpense = () => {
    navigate(`/expense-report`);
  };
  const handleNavigateToStockist = () => {
    navigate(`/stockist/${CredId}`);
  };

  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <div className="col-xl-8 col-lg-12 col-md-12 flex-column">
          <div className="row g-3">
            <div className="col-md-12">
              <TopPerformers />
              {/* <GeneralChartCard
                Title="Employees Info"
                data={EmployeeInfoChartData}
              /> */}
            </div>
            <div className="col-md-6">
              <Employeesavaibility />
            </div>
            <div className="col-md-6">
              <GeneralChartCard
                Title="Total Employees"
                data={TotalEmployeesChartData}
                TitleRight={
                  loading ? (
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid #ccc",
                        borderTop: "2px solid #007bff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  ) : (
                    memberList?.length
                  )
                }
                identity="totalemployee"
              />
            </div>
            <div className="col-md-12">
              <GeneralChartCard
                Title="Top Hiring Sources"
                data={TopHiringSourcesChartData}
                identity="TopHiringSources"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-12 col-md-12">
          <div className="row g-3">
            <div className="col-md-6 col-lg-6 col-xl-12">
              <HignlighterCard />
            </div>
            <div className="col-md-6 col-lg-6 col-xl-12 flex-column">
              <div onClick={handleNavigateToExpense}>
                <InterviewCard
                  value={
                    loading ? (
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          border: "2px solid #ccc",
                          borderTop: "2px solid #007bff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    ) : (
                      memberList?.length
                    )
                  }
                  iconClass="icofont-users-alt-2 fs-5"
                  label="Total Expense"
                  chartClass="icofont-chart-bar-graph fs-3 text-muted"
                />
              </div>
              <div onClick={handleNavigateToStockist}>
                <InterviewCard
                  value={
                    ClientFMCG.allClients?.length || (
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          border: "2px solid #ccc",
                          borderTop: "2px solid #007bff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    )
                  }
                  iconClass="icofont-holding-hands fs-5"
                  label="Total Stockist"
                  chartClass="icofont-chart-line fs-3 text-muted"
                />
              </div>
            </div>
            <div className="col-md-12 col-lg-12 col-xl-12">
              <UpcommingInterviews />
            </div>
          </div>
        </div>
        {/* <div className="col-md-12">
          <TopPerformers />
        </div> */}
      </div>
    </div>
  );
}

export default HrDashboard;
