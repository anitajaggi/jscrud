// swal("Good job!", "You clicked the button!", "success");

let regForm = document.querySelector('.register-form');
let allInput = regForm.querySelectorAll('INPUT');
let allbtn = regForm.querySelectorAll('BUTTON');
let closeBtn = document.querySelector('.btn-close');
let regList = document.querySelector('.reg-list');
let addBtn = document.querySelector('.add-btn');
let searchElem = document.querySelector('.search');
let delAllBtn = document.querySelector('.del-all-btn');
let paginationBox = document.querySelector('.pagination-box');
let prevBtn = document.querySelector('.prev-btn');
let nextBtn = document.querySelector('.next-btn ');
// console.log(allInput);
let allRegData = [];
let url = [];

if (localStorage.getItem("allRegData") != null) {
    allRegData = JSON.parse(localStorage.getItem("allRegData"));
}
// console.log(allRegData);

// add data
regForm.onsubmit = (e) => {
    e.preventDefault();

    let checkEmail = allRegData.find((data) => data.email == allInput[1].value);
    // console.log(checkEmail);
    if (checkEmail == undefined) {
        allRegData.push({
            name: allInput[0].value,
            email: allInput[1].value,
            contact: allInput[2].value,
            dob: allInput[3].value,
            password: allInput[4].value,
            profile: url == "" ? "assets/img/profile.png" : url
        });
        localStorage.setItem("allRegData", JSON.stringify(allRegData));
        swal("Data Inserted", "Sucessfully!", "success");
        // closeBtn.click();
        regForm.reset('');
        getRegData(0, 5);
    } else {
        swal("Email Already Exists", "Faild!", "warning");
    }
}

// fetch data
const getRegData = (from, to) => {
    regList.innerHTML = '';
    let filter = allRegData.slice(from, to);
    filter.forEach((data, index) => {
        let dataStr = JSON.stringify(data);
        let finalData = dataStr.replace(/"/g, "'");
        regList.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <img src="${data.profile}" class="profile-img">
                </td>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.dob}</td>
                <td>${data.contact}</td>
                <td>${data.password}</td>
                <td>
                    <button data="${finalData}" index="${index}" class="btn btn-success edit-btn">Edit</button>
                    <button index="${index}" class="btn btn-danger del-btn">Delete</button>
                </td>
            </tr>
        `;

    });
    action();
}

// actions
const action = () => {
    let allDelBtn = regList.querySelectorAll('.del-btn');
    // console.log(allDelBtn);
    for (let btn of allDelBtn) {
        btn.onclick = async () => {
            let isConfirm = await confirm();
            if (isConfirm) {
                let indx = btn.getAttribute("index");
                allRegData.splice(indx, 1);
                localStorage.setItem("allRegData", JSON.stringify(allRegData));
                getRegData();
            }

        }
    }

    let allEditBtn = regList.querySelectorAll('.edit-btn');
    for (let btn of allEditBtn) {
        btn.onclick = () => {
            let indx = btn.getAttribute("index");
            let dataStr = btn.getAttribute("data");
            let finalData = dataStr.replace(/'/g, '"');
            let data = JSON.parse(finalData);

            addBtn.click();

            allInput[0].value = data.name;
            allInput[1].value = data.email;
            allInput[2].value = data.contact;
            allInput[3].value = data.dob;
            allInput[4].value = data.password;
            url = data.profile;
            allbtn[0].disabled = false;
            allbtn[1].disabled = true;

            allbtn[0].onclick = () => {
                allRegData[indx] = {
                    name: allInput[0].value,
                    email: allInput[1].value,
                    contact: allInput[2].value,
                    dob: allInput[3].value,
                    password: allInput[4].value,
                    profile: url == "" ? "assets/img/profile.png" : url
                }
                localStorage.setItem("allRegData", JSON.stringify(allRegData));
                swal("Data Updated", "Sucessfully!", "success");
                closeBtn.click();
                regForm.reset('');
                getRegData();
                allbtn[1].disabled = false;
                allbtn[0].disabled = true;
            }
        }
    }

}

// read profile url
allInput[5].onchange = () => {
    let fReader = new FileReader();
    fReader.readAsDataURL(allInput[5].files[0]);
    fReader.onload = (e) => {
        url = e.target.result;
        // console.log(url);
    }
}

// delete all
delAllBtn.onclick = async () => {
    let isConfirm = await confirm();
    if (isConfirm) {
        allRegData = [];
        localStorage.removeItem("allRegData");
        getRegData();
    }
}

getRegData(0, 5);


// confirmation
const confirm = () => {
    return new Promise((resolve, reject) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    resolve(true);
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    reject(false);
                    swal("Your imaginary file is safe!");
                }
            });
    });
};

// search data
searchElem.oninput = () => {
    search();
}

const search = () => {
    let val = searchElem.value.toLowerCase();
    let tr = regList.querySelectorAll('TR');
    let i;
    for (i = 0; i < tr.length; i++) {
        let allTD = tr[i].querySelectorAll('TD');
        let name = allTD[2].innerHTML;
        let email = allTD[3].innerHTML;
        let contact = allTD[5].innerHTML;
        if (name.toLocaleLowerCase().indexOf(val) != -1) {
            tr[i].style.display = '';
        } else if (email.toLocaleLowerCase().indexOf(val) != -1) {
            tr[i].style.display = '';
        } else if (contact.toLocaleLowerCase().indexOf(val) != -1) {
            tr[i].style.display = '';
        } else {
            tr[i].style.display = 'none';
        }
    }

}

// pagination 
let fullLength = Number(allRegData.length / 5);
let i, dataSkip = 0, loadData = 5;

if (fullLength.toString().indexOf(".") != -1) {
    fullLength = fullLength + 1;

}
for (i = 1; i < fullLength; i++) {
    paginationBox.innerHTML += `
        <li class="page-item">
            <button data-skip="${dataSkip}" load-data="${loadData}" class="page-link border-danger text-danger all-pagi-btn">${i}</button>
        </li>
    `;
    dataSkip = dataSkip + 5;
    loadData = loadData + 5;
}

let allPaginationBtn = paginationBox.querySelectorAll('.all-pagi-btn');
allPaginationBtn[0].classList.add("active");
for (let btn of allPaginationBtn) {
    btn.onclick = () => {
        for (el of allPaginationBtn) {
            el.classList.remove("active");
        }
        btn.classList.add("active");
        let skip = btn.getAttribute("data-skip");
        let load = btn.getAttribute("load-data");
        getRegData(skip, load);
    }
}

// next btn

nextBtn.onclick = () => {
    let currentIndex = 0;
    allPaginationBtn.forEach((btn, index) => {
        if (btn.classList.contains("active")) {
            currentIndex = index;
        }
    });
    allPaginationBtn[currentIndex + 1].click();
    controlPrevNext(allPaginationBtn, currentIndex + 1);
}

// prev btn
prevBtn.onclick = () => {
    let currentIndex = 0;
    allPaginationBtn.forEach((btn, index) => {
        if (btn.classList.contains("active")) {
            currentIndex = index;
        }
    });
    allPaginationBtn[currentIndex - 1].click();
    controlPrevNext(allPaginationBtn, currentIndex - 1);
}

controlPrevNext = (allPaginationBtn, currentIndex) => {
    let lngth = allPaginationBtn.length - 1;
    if (currentIndex == lngth) {
        nextBtn.disabled = true;
    } else if (currentIndex > 0) {
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    } else {
        prevBtn.disabled = true;
    }
}