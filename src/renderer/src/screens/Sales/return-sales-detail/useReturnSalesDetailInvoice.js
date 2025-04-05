import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/images/logo.png";
import robotoRegularBase64 from "../../../assets/Roboto-Regular-normal";
import robotoBoldBase64 from "../../../assets/Roboto-Bold-normal";
import robotoMediumBase64 from "../../../assets/Roboto-Medium-normal";
 
const useReturnSalesDetailInvoice = (orderData, invoiceNumber) => {
  const generateInvoice = () => {
    const doc = new jsPDF();

    // Register the custom fonts (Roboto)
    doc.addFileToVFS("Roboto-Regular.ttf", robotoRegularBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

    doc.addFileToVFS("Roboto-Bold.ttf", robotoBoldBase64);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    doc.addFileToVFS("Roboto-Medium.ttf", robotoMediumBase64);
    doc.addFont("Roboto-Medium.ttf", "Roboto", "medium");

    // Add company header and logo
    doc.setFont("Roboto", "bold");
    doc.setFontSize(16);
    doc.text("Code Aspire Consultancy Services", 14, 20);

    doc.setFont("Roboto", "medium");
    doc.setFontSize(10);
    doc.text("Shyam Nagar B-Block, Kanpur, Uttar Pradesh, India", 14, 25);
    doc.text("Phone: (+91) 9336166483 | Email: info@code-aspire.com", 14, 30);

    doc.addImage(logo, "PNG", 160, 10, 30, 30);

    // Add invoice details
    doc.setFont("Roboto", "bold");
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 38);

    doc.setFont("Roboto", "medium");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

    // Add recipient and shipping details
    doc.setFont("Roboto", "bold");
    doc.text("Ship To:", 14, 54);

    doc.setFont("Roboto", "medium");
    doc.text("Anand Kumar, Gomti Nagar", 14, 60);

    // Prepare table data
    const tableBody = orderData.map((order, index) => {
      const product = order.productRes || {};
      return [
        index + 1,
        product.name || "N/A",
        order.quantity || 0,
        `₹ ${order.totalPrice?.toFixed(2) || "0.00"}`,
        `₹ ${order.totalPriceWithGst?.toFixed(2) || "0.00"}`,
      ];
    });

    // Add table
    autoTable(doc, {
      startY: 65,
      head: [["S.No", "Product Name", "Quantity", "Pre GST", "Post GST"]],
      body: tableBody,
      headStyles: {
        fillColor: [60, 141, 188],
        textColor: [255, 255, 255],
        font: "Roboto",
      },
      styles: { halign: "center", fontSize: 10, font: "Roboto" },
      columnStyles: {
        0: { halign: "center", cellWidth: 15, font: "Roboto" },
        1: { halign: "center", cellWidth: 75, font: "Roboto" },
        2: { halign: "center", cellWidth: 20, font: "Roboto" },
        3: { halign: "center", cellWidth: 30, font: "Roboto" },
        4: { halign: "center", cellWidth: 30, font: "Roboto" },
      },
    });

    // Calculate totals
    const totalGst = orderData
      .reduce((acc, order) => acc + (order.gstAmount || 0), 0)
      .toFixed(2);
    const totalAmount = orderData
      .reduce((acc, order) => acc + (order.totalPriceWithGst || 0), 0)
      .toFixed(2);

    // Add totals in a professional table format
    const startY = doc.previousAutoTable.finalY + 10;
    autoTable(doc, {
      startY,
      theme: "grid",
      tableWidth: 80,
      margin: { left: 125 },
      body: [
        ["Subtotal", `₹ ${totalAmount}`],
        ["GST Applied", `₹ ${totalGst}`],
        ["Grand Total", `₹ ${totalAmount}`],
      ],
      styles: {
        fontSize: 10,
        halign: "right",
        fillColor: [230, 230, 230],
        font: "Roboto",
      },
      columnStyles: {
        0: { halign: "left", font: "Roboto" },
        1: { halign: "right", font: "Roboto" },
      },
    });

    // Add footer with additional details
    doc.setFont("Roboto", "medium");
    doc.text("Thank you for your business!", 14, 270);

    // Save PDF
    doc.save(`${invoiceNumber}.pdf`);
  };

  return generateInvoice;
};

export default useReturnSalesDetailInvoice;