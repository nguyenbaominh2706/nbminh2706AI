import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const inpUsername = document.querySelector("#username");
const inpEmail = document.querySelector("#email");
const inpPassword = document.querySelector("#password");
const inpConfirmPwd = document.querySelector("#confirm-password");
const registerForm = document.querySelector("#register-form");
const provinceSelect = document.querySelector("#province");
const districtSelect = document.querySelector("#district");
const wardSelect = document.querySelector("#ward");
const gradeSelect = document.querySelector("#grade");
const classInput = document.querySelector("#class");
const schoolInput = document.querySelector("#school");
const phoneInput = document.querySelector("#sdt");
const dobInput = document.querySelector("#dob");
const roleRadios = document.querySelectorAll('input[name="chon"]');

const fetchJSON = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
};

const resetSelect = (selectEl, placeholder) => {
    if (!selectEl) return;
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
};

const populateOptions = (selectEl, items, placeholder) => {
    if (!selectEl) return;
    resetSelect(selectEl, placeholder);
    items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.code;
        option.textContent = item.name;
        selectEl.appendChild(option);
    });
};

const loadProvinces = async () => {
    if (!provinceSelect) return;
    try {
        const data = await fetchJSON("https://provinces.open-api.vn/api/p/");
        data.sort((a, b) => a.name.localeCompare(b.name));
        populateOptions(provinceSelect, data, "Chọn tỉnh/thành");
    } catch (error) {
        console.error("Không thể tải danh sách tỉnh/thành", error);
    }
};

const loadDistricts = async (provinceCode) => {
    resetSelect(districtSelect, "Chọn quận/huyện");
    resetSelect(wardSelect, "Chọn phường/xã");
    if (!provinceCode) return;
    try {
        const provinceData = await fetchJSON(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const districts = provinceData.districts || [];
        districts.sort((a, b) => a.name.localeCompare(b.name));
        populateOptions(districtSelect, districts, "Chọn quận/huyện");
    } catch (error) {
        console.error("Không thể tải danh sách quận/huyện", error);
    }
};

const loadWards = async (districtCode) => {
    resetSelect(wardSelect, "Chọn phường/xã");
    if (!districtCode) return;
    try {
        const districtData = await fetchJSON(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const wards = districtData.wards || [];
        wards.sort((a, b) => a.name.localeCompare(b.name));
        populateOptions(wardSelect, wards, "Chọn phường/xã");
    } catch (error) {
        console.error("Không thể tải danh sách phường/xã", error);
    }
};

const initGrades = () => {
    if (!gradeSelect) return;
    const grades = Array.from({ length: 12 }, (_, idx) => `${idx + 1}`);
    resetSelect(gradeSelect, "Chọn khối");
    grades.forEach((grade) => {
        const option = document.createElement("option");
        option.value = grade;
        option.textContent = `Khối ${grade}`;
        gradeSelect.appendChild(option);
    });
};

const handleRegister = function(event) {
    event.preventDefault();
    
    let username = inpUsername.value.trim();
    let email = inpEmail.value.trim();
    let password = inpPassword.value.trim();
    let confirmPassword = inpConfirmPwd.value.trim();
    let role_id = 2;
    let selectedRole = Array.from(roleRadios).find((radio) => radio.checked)?.value || "Học sinh";
    let phone = phoneInput?.value.trim() || "";
    let dob = dobInput?.value || "";
    let province = provinceSelect?.selectedOptions?.[0]?.textContent || "";
    let district = districtSelect?.selectedOptions?.[0]?.textContent || "";
    let ward = wardSelect?.selectedOptions?.[0]?.textContent || "";
    let grade = gradeSelect?.value || "";
    let className = classInput?.value.trim() || "";
    let school = schoolInput?.value.trim() || "";
    
    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ tất cả các trường dữ liệu");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu không khớp!!!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        const userData = {
            uid: user.uid,
            username: username,
            email: email,
            role_id: role_id,
            balance: 0,
            createdAt: new Date().toISOString(),
            profile: {
                role: selectedRole,
                phone: phone,
                dob: dob,
                province: province,
                district: district,
                ward: ward,
                school: school,
                grade: grade,
                className: className
            }
        };

        return addDoc(collection(db, 'users'), userData);
    })
    .then(() => {
        alert("Đăng ký thành công!");
        window.location.href = "login.html";  
    })
    .catch((e) => {
        alert("Lỗi: " + e.message);
    });
};

provinceSelect?.addEventListener("change", (event) => {
    loadDistricts(event.target.value);
});

districtSelect?.addEventListener("change", (event) => {
    loadWards(event.target.value);
});

loadProvinces();
initGrades();

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}