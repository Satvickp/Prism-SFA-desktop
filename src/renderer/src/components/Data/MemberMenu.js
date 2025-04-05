import { useSelector } from "react-redux";
import { CLIENT_TYPE } from "./ClientFMCGMemberMenu";
import { permissionIds } from "../../constants/constants";
import { useIsFMCG } from "../../helper/isManager";

export default function useMemberMenu() {
  const Cred = useSelector((state) => state.Cred);
  const CredId = Cred.sub;
  const isFMCG = useIsFMCG();
  const { memberPermissions } = useSelector((state) => state.Permission);

  // Helper function to check permissions
  const hasPermission = (permissions) => {
    return memberPermissions.some((item) => permissions.includes(item));
  };

  // Map menu item
  const MapMenu = hasPermission([
    permissionIds.SUPER_ADMIN,
    permissionIds.REPORTING_MANAGER,
  ])
    ? [
        {
          name: "Member Map",
          routerLink: ["membermap"],
          identifier: "membermap",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Member Device",
          routerLink: ["member-device"],
          identifier: "member-device",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Member Birthday ",
          routerLink: ["member-list"],
          identifier: "member birthday",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
      ]
    : [];

  // Expense Report item
  const ExpenseReport = hasPermission([
    permissionIds.SUPER_ADMIN,
    permissionIds.REPORTING_MANAGER,
  ])
    ? [
        {
          name: "Expense Report",
          routerLink: ["expense-report"],
          identifier: "Expense Report N",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
          isSideBarClosed: true,
        },
      ]
    : [];

  // Doctors menu item
  const doctorsMenu = isFMCG
    ? []
    : [
        {
          name: "Doctors",
          routerLink: [`doctors/${CredId}`],
          identifier: "doctors",
          iconClass: "icofont-location-pin",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: true,
          children: [],
        },
      ];

  const MemberMenu = [
    {
      name: "Reports",
      routerLink: [""],
      identifier: "Reporting",
      iconClass: "icofont-clip-board",
      breadcrumbMessage: "",
      isCategory: false,
      isApp: true,
      children: [
        {
          name: "DCR Report",
          routerLink: ["dcr-report"],
          identifier: "N Beet",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
          isSideBarClosed: true,
        },
        {
          name:
            CLIENT_TYPE === "CLIENT_FMCG"
              ? "Beet-Outlet Report"
              : "Route-Chemist Report",
          routerLink: ["beet-wise-report"],
          identifier: "N Beet",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
          isSideBarClosed: true,
        },
        // {
        //   name: "Party Report",
        //   routerLink: ["party-report"],
        //   identifier: "Party Report",
        //   iconClass: "",
        //   breadcrumbMessage: "",
        //   isCategory: false,
        //   isApp: false,
        //   children: [],
        // },
        {
          name:
            CLIENT_TYPE === "FMCG"
              ? "Client Wise Report"
              : "Stockist Wise Report",
          routerLink: ["client-wise-report"],
          identifier: "Client Wise Report",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        // {
        //   name: "Stockist Sale Report",
        //   routerLink: ["sales-report"],
        //   identifier: "Sales Report",
        //   iconClass: "",
        //   breadcrumbMessage: "",
        //   isCategory: false,
        //   isApp: false,
        //   children: [],
        // },
        // {
        //   name: "Beet Order Report",
        //   routerLink: [`all-beet-order-report/${CredId}`],
        //   identifier: "All Order Report",
        //   iconClass: "",
        //   breadcrumbMessage: "",
        //   isCategory: false,
        //   isApp: false,
        //   children: [],
        // },
        // {
        //   name: "Outlet Order Report",
        //   routerLink: [`all-outlet-order-report/${CredId}`],
        //   identifier: "All Order Report",
        //   iconClass: "",
        //   breadcrumbMessage: "",
        //   isCategory: false,
        //   isApp: false,
        //   children: [],
        // },
        // {
        //   name: "Time Invterval Reports",
        //   routerLink: [`time-interval-report/${CredId}`],
        //   identifier: "Outlet Order Report",
        //   iconClass: "",
        //   breadcrumbMessage: "",
        //   isCategory: false,
        //   isApp: false,
        //   children: [],
        // },
        // {
        //   name: `${CLIENT_TYPE === "CLIENT_FMCG" ? "Beat" : "Route"} Journey Reports`,
        //   routerLink: [`beet-journey-report/${CredId}`],
        //   identifier: "Beet Journey Report",
        //   iconClass: "",
        //   breadcrumbMessage: "",
        //   isCategory: false,
        //   isApp: false,
        //   children: [],
        // },
        ...ExpenseReport,
      ],
    },
    {
      name: "Employee",
      routerLink: ["/"],
      identifier: "member",
      iconClass: "icofont-users-alt-5",
      breadcrumbMessage: "",
      isCategory: false,
      isApp: true,
      children: [
        {
          name: "Members",
          routerLink: [`member/${CredId}`],
          identifier: `members/${CredId}`,
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        ...MapMenu,
        {
          name: "Tour Plan",
          routerLink: [`members-scheduler/${CredId}`],
          identifier: "member scheduler",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Expenses",
          routerLink: [`expenses/${CredId}`],
          identifier: "Expenses",
          iconClass: "icofont-ui-calculator",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Expense Summary",
          routerLink: [`member-expense-report`],
          identifier: "Expense Summary",
          iconClass: "icofont-ui-calculator",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
          state: {
            memberId: CredId,
            memberName: Cred.firstName + " " + Cred.lastName,
            isExpense: true,
          },
        },
        {
          name: "Attendance",
          routerLink: [`attendance/${CredId}`],
          identifier: "Attendance",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Leave Requests",
          routerLink: [`leave-request/${CredId}`],
          identifier: "leave-request",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Holidays",
          routerLink: ["holidays"],
          identifier: "holidays",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
      ].filter(Boolean),
    },
    {
      name: "Our Customers",
      routerLink: ["/"],
      identifier: "clients",
      iconClass: "icofont-user-alt-5",
      breadcrumbMessage: "",
      isCategory: false,
      isApp: true,
      children: [
        {
          name: CLIENT_TYPE === "CLIENT_FMCG" ? "Customers (FMCG)" : "Stockist",
          routerLink:
            CLIENT_TYPE === "CLIENT_FMCG"
              ? [`clientsFmcg/${CredId}`]
              : [`stockist/${CredId}`],
          identifier: "clients",
          iconClass: "icofont-users-alt-5",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: true,
          children: [],
        },
        {
          name: CLIENT_TYPE === "CLIENT_FMCG" ? "Beat" : "Routes",
          routerLink:
            CLIENT_TYPE === "CLIENT_FMCG"
              ? [`beets/${CredId}`]
              : [`routes/${CredId}`],
          identifier: "beats",
          iconClass: "icofont-location-pin",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: true,
          children: [],
        },
        ...doctorsMenu,
        // ...outletMenu,
        {
          name: CLIENT_TYPE === "CLIENT_FMCG" ? "Outlet" : "Chemist",
          routerLink:
            CLIENT_TYPE === "CLIENT_FMCG"
              ? [`outlet/${CredId}`]
              : [`chemist/${CredId}`],
          identifier: "outlet/1",
          iconClass: "icofont-location-pin",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: true,
          children: [],
        },
      ].filter(Boolean),
    },
    {
      name: "Inventory",
      routerLink: [""],
      identifier: "Products",
      iconClass: "icofont-box",
      breadcrumbMessage: "",
      isCategory: false,
      isApp: true,
      children: [
        {
          name: "Inventory",
          routerLink: ["inventory"],
          identifier: "Inventory",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
      ],
    },
    {
      name: "Sales",
      routerLink: [""],
      identifier: "Sales",
      iconClass: "icofont-chart-histogram",
      breadcrumbMessage: "",
      isCategory: false,
      isApp: true,
      children: [
        {
          name: "Primary Sales",
          routerLink: [`primarySales/${CredId}`],
          identifier: "Primary Sales",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Secondary Sales",
          routerLink: [`secondarySales/${CredId}`],
          identifier: "Secondary Sales",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
      ],
    },
  ];

  return { MemberMenu, MapMenu };
}
