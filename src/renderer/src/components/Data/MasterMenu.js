import { useSelector } from "react-redux";
import { CLIENT_TYPE } from "./ClientFMCGMemberMenu";

export default function useMasterMenu() {
  const CredId = useSelector((state) => state.Cred.sub);

  const MasterMenu = [
    {
      name: "Dashboard",
      routerLink: [""],
      identifier: "Admin Dashboard",
      iconClass: "icofont-dashboard-web",
      breadcrumbMessage: "",
      isCategory: false,
      isApp: false,
      children: [],
    },
    {
      name: "Master",
      routerLink: [""],
      identifier: "Master",
      iconClass: "icofont-ui-settings",
      breadcrumbMessage: "",
      isCategory: false,
      isApp: true,
      children: [
        {
          name: "Region Master",
          routerLink: ["regionMaster"],
          identifier: "Region Master",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "State Master",
          routerLink: ["stateMaster"],
          identifier: "State Master",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "City Master",
          routerLink: ["cityMaster"],
          identifier: "City Master",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Designation Master",
          routerLink: ["designation-master"],
          identifier: "designation-master",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Code Configurations",
          routerLink: ["code-config-master"],
          identifier: "designation-master",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Discount Master",
          routerLink: ["discount-master"],
          identifier: "discount-master",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Product Master",
          routerLink: ["productmaster"],
          identifier: "Product Master",
          iconClass: "",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: false,
          children: [],
        },
        {
          name: "Permission Master",
          routerLink: ["assign-permission"],
          identifier: "Accounts",
          //iconClass: "icofont-ui-calculator",
          breadcrumbMessage: "",
          isCategory: false,
          isApp: true,
          children: [],
        },
      ],
    },
  ];

  return {
    MasterMenu,
  };
}
