// Hàm này sẽ được gọi khi trang được tải để thêm sự kiện cho các ô nhập liệu số học sinh và số nhóm.
function themSuKienFocus() {
    // Thêm sự kiện keydown vào các ô nhập liệu số lượng học sinh và số nhóm
    document.getElementById("soHS").addEventListener('keydown', focusNextInput);
    document.getElementById("soNhom").addEventListener('keydown', focusNextInput);
}

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
            input.min = "1"; // Đảm bảo số nhập vào >= 1
            container.appendChild(label);
            container.appendChild(input);
            container.appendChild(document.createElement("br"));
        }

        // Thêm sự kiện keydown vào các ô nhập liệu nhóm
        document.querySelectorAll('.soHSNhom').forEach(input => {
            input.addEventListener('keydown', focusNextInput);
        });
    }
}

function focusNextInput(event) {
    if (event.key === 'Enter') {
        // Nếu đang ở ô nhập liệu số học sinh hoặc số nhóm, chuyển focus đến ô tiếp theo (nếu có)
        let inputs = document.querySelectorAll('#soHS, #soNhom, .soHSNhom');
        let index = Array.from(inputs).indexOf(event.target); // Tìm chỉ mục của ô nhập liệu hiện tại
        if (index < inputs.length - 1) {
            inputs[index + 1].focus(); // Chuyển focus đến ô nhập liệu tiếp theo
        }
    }
}

// Gọi hàm themSuKienFocus khi trang được tải
window.onload = themSuKienFocus;


function chiaNhom() {
    let soHS = document.getElementById("soHS");
    let soNhom = document.getElementById("soNhom");
    let danhSachHS = document.getElementById("danhSachHS");
    let radioTen = document.getElementById("radioTen");
    let chon1 = document.querySelector('input[name="chiaTheo"]:checked').value;
    let chon2 = document.querySelector('input[name="chiaKieu"]:checked').value;

    // Kiểm tra số lượng học sinh không nhỏ hơn 1
    if (parseInt(soHS.value) < 1) {
        alert("Số lượng học sinh phải lớn hơn hoặc bằng 1!");
        return;
    }

    // Kiểm tra số nhóm không nhỏ hơn 1 và không lớn hơn số học sinh
    let soNhomValue = parseInt(soNhom.value);
    if (soNhomValue < 1) {
        alert("Số nhóm phải lớn hơn hoặc bằng 1!");
        return;
    }
    if (soNhomValue > parseInt(soHS.value)) {
        alert("Số nhóm không thể lớn hơn số lượng học sinh!");
        return;
    }

    // Kiểm tra xem các ô nhập liệu đã được điền chưa
    if (!soHS.value || !soNhom.value || (radioTen.checked && !danhSachHS.value.trim())) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    let hs = parseInt(soHS.value);
    let sl_nhom = parseInt(soNhom.value);
    let dsHS = [];

    if (chon1 === "stt") {
        for (let i = 1; i <= hs; i++) dsHS.push(i);
    } else {
        let tenHS = danhSachHS.value.split("\n");
        dsHS = tenHS.map(ten => ten.trim()).filter(ten => ten !== "");

        // Kiểm tra số lượng tên nhập vào
        if (dsHS.length !== hs) {
            alert("Số lượng tên học sinh không khớp với số học sinh ban đầu!");
            return;
        }
    }

    let sohsmn = [];
    let total = 0;

    if (chon2 === "tuDong") {
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
                alert(`Số lượng học sinh trong nhóm ${index + 1} phải lớn hơn hoặc bằng 1!`);
                return;
            }
            sohsmn.push(nhomSize);
            total += nhomSize;
        });

        // Kiểm tra nếu tổng số học sinh nhập vào không khớp với tổng số học sinh ban đầu
        if (total !== hs) {
            alert("Tổng số học sinh các nhóm không khớp với số học sinh ban đầu!");
            return;
        }
    }

    dsHS.sort(() => Math.random() - 0.5);
    let ketQua = "<h3>Kết quả chia nhóm:</h3>";
    let index = 0;
    for (let i = 0; i < sl_nhom; i++) {
        ketQua += `<p><strong>Nhóm ${i + 1}:</strong> ` + dsHS.slice(index, index + sohsmn[i]).join(", ") + "</p>";
        index += sohsmn[i];
    }
    document.getElementById("ketQua").innerHTML = ketQua;
}


