import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatDate } from "./formatDateTime";

export const generatePDF = async (prescription: any) => {
    const element = document.getElementById(`prescription-${prescription.id}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `prescription-${prescription.doctor.name.replace(
          /\s+/g,
          "-"
        )}-${formatDate(prescription.createdAt)}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };