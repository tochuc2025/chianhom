// Hàm thêm sự kiện "Enter" để di chuyển giữa các ô nhập
function themSuKienFocus() {
    document.getElementById("soHS").addEventListener('keydown', focusNextInput);
    document.getElementById("soNhom").addEventListener('keydown', focusNextInput);
}

// Chuyển focus khi nhấn Enter
function focusNextInput(event) {
    if (event.key === 'Enter') {
        let inputs = document.querySelectorAll('#soHS, #soNhom, .soHSNhom');
        let index = Array.from(inputs).indexOf(event.target);
        if (index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    }
}

// Hiển thị ô nhập số HS cho từng nhóm nếu chọn "Tự chia"
function hienThiNhapSoHS() {
    let container = document.getElementById("nhapSoHSContainer");
    container.innerHTML = "";
    let sl_nhom = parseInt(document.getElementById("soNhom").value);
    let chon2 = document.querySelector('input[name="chiaKieu"]:checked').value;

    if (chon2 === "tuChia") {
        for (let i = 0; i < sl_nhom; i++) {
            let label = document.createElement("label");
            label.textContent = `Nhóm ${i + 1}: `;
            let input = document.createElement("input");
            input.type = "number";
            input.className = "soHSNhom form-control mb-2";
            input.required = true;
            input.min = "1"; 
            container.appendChild(label);
            container.appendChild(input);
        }

        document.querySelectorAll('.soHSNhom').forEach(input => {
            input.addEventListener('keydown', focusNextInput);
        });
    }
}

// Hàm chia nhóm
function chiaNhom() {
    let soHS = document.getElementById("soHS");
    let soNhom = document.getElementById("soNhom");
    let danhSachHS = document.getElementById("danhSachHS");
    let radioTen = document.getElementById("radioTen");

    if (parseInt(soHS.value) < 1) {
        alert("Số lượng học sinh phải lớn hơn hoặc bằng 1!");
        return;
    }

    let soNhomValue = parseInt(soNhom.value);
    if (soNhomValue < 1 || soNhomValue > parseInt(soHS.value)) {
        alert("Số nhóm phải hợp lệ (>= 1 và <= số học sinh)!");
        return;
    }

    if (!soHS.value || !soNhom.value || (radioTen.checked && !danhSachHS.value.trim())) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    let hs = parseInt(soHS.value);
    let sl_nhom = parseInt(soNhom.value);
    let dsHS = [];

    if (document.querySelector('input[name="chiaTheo"]:checked').value === "stt") {
        for (let i = 1; i <= hs; i++) dsHS.push(i);
    } else {
        let tenHS = danhSachHS.value.split("\n").map(ten => ten.trim()).filter(ten => ten !== "");
        if (tenHS.length !== hs) {
            alert("Số lượng tên học sinh không khớp với số nhập vào!");
            return;
        }
        dsHS = tenHS;
    }

    let sohsmn = [];
    let total = 0;

    if (document.querySelector('input[name="chiaKieu"]:checked').value === "tuDong") {
        let x = hs, y = sl_nhom;
        for (let i = 0; i < sl_nhom; i++) {
            let z = x % y;
            let t = z >= 0.5 ? Math.ceil(x / y) : Math.floor(x / y);
            sohsmn.push(t);
            x -= t;
            y--;
        }
    } else {
        let inputs = document.querySelectorAll(".soHSNhom");
        inputs.forEach((input, index) => {
            let nhomSize = parseInt(input.value) || 0;
            if (nhomSize < 1) {
                alert(`Số lượng học sinh trong nhóm ${index + 1} phải >= 1!`);
                return;
            }
            sohsmn.push(nhomSize);
            total += nhomSize;
        });

        if (total !== hs) {
            alert("Tổng số học sinh các nhóm không khớp!");
            return;
        }
    }

    dsHS.sort(() => Math.random() - 0.5);
    let ketQua = "<h3>Kết quả chia nhóm:</h3>";

    window.chiaNhomData = []; // Cập nhật dữ liệu nhóm cho xuất Excel
    let index = 0;
    for (let i = 0; i < sl_nhom; i++) {
        let nhom = dsHS.slice(index, index + sohsmn[i]);
        window.chiaNhomData.push(nhom);
        ketQua += `<p><strong>Nhóm ${i + 1}:</strong> ${nhom.join(", ")}</p>`;
        index += sohsmn[i];
    }

    document.getElementById("ketQua").innerHTML = ketQua;
}

// Xuất Excel: Mỗi nhóm là một hàng, mỗi thành viên là một ô, không có tiêu đề
function xuatExcel() {
    if (!window.chiaNhomData || window.chiaNhomData.length === 0) {
        alert("Bạn chưa chia nhóm!");
        return;
    }

    let data = [];
    
    // Duyệt qua từng nhóm, mỗi nhóm sẽ là một hàng trong Excel
    window.chiaNhomData.forEach((nhom, index) => {
        let hangNhom = [`Nhóm ${index + 1}`, ...nhom]; 
        data.push(hangNhom);
    });

    let ws = XLSX.utils.aoa_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách nhóm");
    XLSX.writeFile(wb, "Danh_sach_nhom.xlsx");
}


// Gọi sự kiện khi trang tải xong
window.onload = themSuKienFocus;
