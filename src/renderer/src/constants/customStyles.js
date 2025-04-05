import { defaultThemes } from "react-data-table-component";

export const customStyles = {
  headCells: {
    style: {
      whiteSpace: "normal",
      wordWrap: "break-word",
      overflow: "visible",
      textAlign: "left",
      minWidth: "120px",
      maxWidth: "250px",
      backgroundColor: "#f0f0f0",
      fontWeight: "bold",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },

  cells: {
    style: {
      whiteSpace: "normal",
      wordWrap: "break-word",
      overflow: "visible",
      minWidth: "120px",
      maxWidth: "250px",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  tableWrapper: {
    style: {
      overflowX: "auto", // Ensure horizontal scroll if content overflows the table width
    },
  },
};
