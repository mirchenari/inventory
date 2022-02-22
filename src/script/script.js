let contCategory = [];

class categoryAbj {
    constructor(category){
        this.category = category;
        this.product = [];        
    }

    get getCategory(){
        return this.category;
    }
}

const messageBox = document.querySelector(".mess");

const addCategory = document.querySelector(".input-add");
const addCategoryBtn = document.querySelector(".add-category-btn");
const addCategoryInput = document.querySelector(".add-category-input");
const categoryArr = [];
const droDownCategory = document.querySelector("#select-category");

const productInput = document.querySelector("#product");
const productBtn = document.querySelector(".add-product");

const searchInput = document.getElementById("filter");
const showResultDiv = document.querySelector(".show");

// get saved
if (localStorage.getItem("categories")){
    let x = JSON.parse(localStorage.getItem("categories"));
    x.forEach(item => {
        droDownCategory.innerHTML += `<option value="${item.category}">${item.category}</option>`;
        categoryArr.push(item.category);

        let y = new categoryAbj(item.category);
        y.product = item.product;
        contCategory.push(y);
    })

    if (contCategory.length != 0){
        showResult();
    }
}

// show add category
document.querySelector(".add-category").addEventListener("click", () => addCategory.classList.toggle("hidden"));

// add category
addCategoryBtn.addEventListener("click", () => {
    let category = addCategoryInput.value.trim();;
    if (category == ""){
        showMess("اسم دسته چی باشه؟");
    } else if (categoryArr.includes(category)){
        showMess("این دسته رو قبلا اضافه کردی");
    } else {
        contCategory.push(new categoryAbj(category));
        categoryArr.push(category);
        showResult();

        droDownCategory.innerHTML += `<option value="${category}">${category}</option>`
        addCategoryInput.value = "";
        addCategory.classList.add("hidden");
        showMess("دسته وارد شده، اضافه شد.", "suc")
    }
})

// add product to category
productBtn.addEventListener("click", () => {
    const category = droDownCategory.value;
    const product = productInput.value.trim();

    if (category == "none"){
        showMess("دسته‌بندی رو انتخاب نکردی!");
    } else if (product == ""){
        showMess("اسم محصول رو یادت رفت!");
    } else {
        contCategory.forEach(item => {
            if (item.getCategory == category){
                if (item.product.includes(product)){
                    showMess("این محصولو قبلا اضافه کردی");
                } else {
                    item.product.push(product);
                    productInput.value = "";
                    showMess("محصول با موفقیت اضافه شد!", "suc");
                    showResult();
                }
            }
        })
    }
})

// show category
function showResult(callBack = editAct) {
    showResultDiv.innerHTML = "";

    // save
    localStorage.setItem("categories", JSON.stringify(contCategory));

    contCategory.forEach((item, index) => {
        let newDiv = document.createElement("article");
        newDiv.innerHTML = `<h3 class="category-title">${item.category} (${item.product.length}) <span class="delete"></span></h3>`;

        let newUl = document.createElement("ul");
        item.product.forEach((i, e) => newUl.innerHTML += 
            `<li>
                <span>${i}</span>
                <span class="delete" data-c="${index}" data-p="${e}"></span>
                <span class="edit" data-c="${index}" data-p="${e}"></span>
            </li>`);

        newDiv.appendChild(newUl);
        showResultDiv.appendChild(newDiv);  
    })
    
    if (contCategory.length == 0) {
        showResultDiv.innerHTML = "یه چیزی وارد کن مُردم از تنهایی...";
    }

    callBack();
}


// edit and delete
function editAct() {
    document.querySelectorAll(".show > article > h3 > span").forEach((i, index) => {
        i.addEventListener("click", () => {
            droDownCategory.removeChild(droDownCategory.childNodes[index+3]);
            contCategory.splice(index, 1);
            categoryArr.splice(index, 1);
            showMess("این دسته با موفقیت حذف شد!", "suc")
            showResult();
        })
    });

    document.querySelectorAll(".show > article > ul span.delete").forEach(i => {
        i.addEventListener("click", () => {
            let dataDel = [Number(i.getAttribute("data-c")), Number(i.getAttribute("data-p"))];
            contCategory[dataDel[0]].product.splice(dataDel[1], 1);
            showMess("محصول با موفقیت حذف شد!", "suc");
            showResult();
        })
    })

    document.querySelectorAll("span.edit").forEach(i => {
        i.addEventListener("click", () => {
            let dataEdit = [Number(i.getAttribute("data-c")), Number(i.getAttribute("data-p"))];
            let oldValue = contCategory[dataEdit[0]].product[dataEdit[1]];
            let newInput = document.createElement("input");
            newInput.value = oldValue;

            let ulSelect = document.querySelector(`.show article:nth-child(${dataEdit[0]+1}) ul`);
            let liSelect = document.querySelector(`.show article:nth-child(${dataEdit[0]+1}) ul li:nth-child(${dataEdit[1]+1})`);
            ulSelect.replaceChild(newInput, liSelect);

            newInput.addEventListener("keydown", key => {
                if (key.key == 'Enter') {
                    edit();
                }
            });

            newInput.onblur = edit;

            function edit() {
                let newValue = newInput.value.trim();
                if (newValue == "") {
                    showMess("اسم محصول رو یادت رفت!");
                } else if (contCategory[dataEdit[0]].product.includes(newValue) && newValue != oldValue) {
                    showMess("این محصولو قبلا اضافه کردی");
                } else {
                    contCategory[dataEdit[0]].product.splice(dataEdit[1], 1, newValue);
                    showMess("محصول با موفقیت ویرایش شد!", "suc");
                    showResult();
                }
            }
        })
    })
}

// search
searchInput.oninput = () => {
    let search = searchInput.value.trim();
    let categoryDiv = document.querySelectorAll(".show > article");
    categoryDiv.forEach(i => i.classList.add("hidden"));

    contCategory.forEach((item, index) => {
        // Search in categories
        if (item.getCategory.includes(search)) {
            categoryDiv[index].classList.remove("hidden");
        }

        // Search in products
        let p = item.product;
        p.forEach(i => {
            if (i.includes(search)) {
                categoryDiv[index].classList.remove("hidden");
            }
        })
    })
}

// show message;
function showMess(message, type = "err") {
    messageBox.classList.remove("active", "err", "suc");
    messageBox.classList.add("active", type);
    messageBox.innerHTML = message;
    setTimeout(() => messageBox.classList.remove("active", "err", "suc"), 3500);
}