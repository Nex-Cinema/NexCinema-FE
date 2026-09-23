export interface ExportableTransactionRecord {
  id: string | number;
  date: string;
  time: string;
  type: string;
  amount: number | string;
  method: string;
  status: string;
  [key: string]: unknown;
}

export const exportToCSV = (data: ExportableTransactionRecord[], filename: string): void => {
  // 1. Header for CSV file
  const headers = [
    "Mã Giao Dịch",
    "Ngày",
    "Thời Gian",
    "Loại",
    "Số Tiền",
    "Thanh Toán",
    "Trạng Thái",
  ];

  // 2. Map records into rows
  const rows = data.map((tx) => [
    tx.id,
    tx.date,
    tx.time,
    tx.type,
    tx.amount,
    tx.method,
    tx.status,
  ]);

  // 3. Combine header and rows into CSV string
  const csvArray = [headers, ...rows];
  const csvString = csvArray.map((e) => e.join(",")).join("\n");

  // 4. Add BOM (\uFEFF) for UTF-8 compatibility in Excel
  const blob = new Blob(["\uFEFF" + csvString], {
    type: "text/csv;charset=utf-8;",
  });

  // 5. Trigger download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
