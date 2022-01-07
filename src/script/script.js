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
    const product = productInput.value.trim();;

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
function showResult() {
    showResultDiv.innerHTML = "";
    // save
    localStorage.setItem("categories", JSON.stringify(contCategory));

    contCategory.forEach(item => {
        let newDiv = document.createElement("article");
        newDiv.innerHTML = `<h3 class="category-title">${item.category} (${item.product.length})</h3>`;

        let newUl = document.createElement("ul");
        item.product.forEach(i => newUl.innerHTML += `<li>${i}</li>`);

        newDiv.appendChild(newUl);
        showResultDiv.appendChild(newDiv);  
    })
}

// show message;
function showMess(message, type = "err"){
    messageBox.classList = "mess";
    messageBox.classList.add("active", type);
    messageBox.innerHTML = message;
    setTimeout(() => messageBox.classList = "mess", 3500);
}