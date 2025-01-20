document
  .getElementById("excelFile")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Lấy tên sheet đầu tiên
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Chuyển dữ liệu từ sheet sang JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Cắt dữ liệu từ dòng 1001 trở đi
      const filteredData = jsonData.slice(1000); // Dòng 1001 tương ứng với index 1000 (0-based index)

      // Hiển thị dữ liệu lên bảng HTML
      displayTable(filteredData);
    };

    reader.readAsArrayBuffer(file);
  });

function displayTable(data) {
  const tableHead = document.querySelector("#dataTable thead");
  const tableBody = document.querySelector("#dataTable tbody");

  // Xóa dữ liệu cũ nếu có
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  if (data.length === 0) {
    alert("No data found in the file.");
    return;
  }

  // Tạo header
  const headers = ["STT", "Sim", "Giá", "Mệnh"]; // Cột mong muốn
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Tạo các dòng dữ liệu
  data.forEach((row) => {
    const tr = document.createElement("tr");

    // Chỉ lấy dữ liệu từ cột B đến E (index 1 đến 4)
    const rowData = row.slice(0, 5);
    rowData.forEach((cell, index) => {
      const td = document.createElement("td");
      td.textContent = cell || ""; // Xử lý ô trống

      // Áp dụng màu cho cột "Mệnh" (index 3 trong dữ liệu)
      if (index === 3) {
        // Cột "Mệnh"
        switch (cell?.toLowerCase()) {
          case "mộc":
            td.classList.add("moc");
            break;
          case "hỏa":
            td.classList.add("hoa");
            break;
          case "thủy":
            td.classList.add("thuy");
            break;
          case "thổ":
            td.classList.add("tho");
            break;
          case "kim":
            td.classList.add("kim");
            break;
          default:
            td.style.backgroundColor = "#fff"; // Màu mặc định
        }
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}
