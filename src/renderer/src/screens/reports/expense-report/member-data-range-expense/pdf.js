import jsPDF from "jspdf";
import "jspdf-autotable";
import robotoMediumBase64 from "../../../../assets/Roboto-Medium-normal";

export const exportToPdf = (columns, data, title, totalAmount) => {
  const doc = new jsPDF();

  doc.addFileToVFS("Roboto-Medium.ttf", robotoMediumBase64);
  doc.addFont("Roboto-Medium.ttf", "Roboto", "medium");

  doc.setFont("Roboto", "medium");
  doc.setFontSize(18);
  doc.text(title, 14, 15);

  doc.setFontSize(12);
  doc.text(`Grand Total: ${totalAmount}`, 14, 20);

  const tableColumn = columns.map((column) =>
    typeof column.name == "object" ? column.name?.props?.children : column.name
  );

  const tableRows = data.map((row) => {
    return columns.map((col) => {
      if (col.selector) {
        const value = col.selector(row);
        return typeof value === "string" || typeof value === "number"
          ? value
          : "";
      }
      return "";
    });
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 10, font: "Roboto" },
    headStyles: { fillColor: [22, 160, 133], font: "Roboto" },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  doc.save(`${title}.pdf`);
};
