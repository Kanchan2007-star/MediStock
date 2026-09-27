/* =========================================
   MEDISTOCK - MAIN JAVASCRIPT
========================================= */


/* =========================================
   LOAD SAVED DATA
========================================= */

let medicines =
    JSON.parse(localStorage.getItem("medistockMedicines")) || [];

let customers =
    JSON.parse(localStorage.getItem("medistockCustomers")) || [];

let suppliers =
    JSON.parse(localStorage.getItem("medistockSuppliers")) || [];


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

if (togglePassword && password) {

    togglePassword.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.textContent = "Hide";

        } else {

            password.type = "password";

            togglePassword.textContent = "Show";

        }

    });

}


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById("loginForm");

const username =
    document.getElementById("username");

const errorMessage =
    document.getElementById("errorMessage");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (errorMessage) {

            errorMessage.style.display = "none";

            errorMessage.textContent = "";

        }


        if (username.value.trim() === "") {

            errorMessage.textContent =
                "Please enter your username.";

            errorMessage.style.display =
                "block";

            username.focus();

            return;

        }


        if (password.value.trim() === "") {

            errorMessage.textContent =
                "Please enter your password.";

            errorMessage.style.display =
                "block";

            password.focus();

            return;

        }


        window.location.href =
            "dashboard.html";

    });

}


/* =========================================
   MEDICINE PAGE
========================================= */

const medicineName =
    document.getElementById("medicineName");

const category =
    document.getElementById("category");

const price =
    document.getElementById("price");

const quantity =
    document.getElementById("quantity");

const expiry =
    document.getElementById("expiry");

const batch =
    document.getElementById("batch");

const addMedicineButton =
    document.querySelector(".medicine-add-button");

const cancelMedicineButton =
    document.querySelector(".medicine-cancel-button");

const medicineTableBody =
    document.getElementById("medicineTableBody");

const medicineCount =
    document.querySelector(".medicine-count");


/* =========================================
   ADD MEDICINE
========================================= */

if (addMedicineButton) {

    addMedicineButton.addEventListener(
        "click",
        function () {

            if (
                medicineName.value.trim() === "" ||
                category.value === "" ||
                price.value.trim() === "" ||
                quantity.value.trim() === "" ||
                expiry.value === "" ||
                batch.value.trim() === ""
            ) {

                alert(
                    "Please fill all medicine details."
                );

                return;

            }


            const medicine = {

                name:
                    medicineName.value.trim(),

                category:
                    category.value,

                price:
                    price.value,

                quantity:
                    quantity.value,

                expiry:
                    expiry.value,

                batch:
                    batch.value.trim()

            };


            medicines.push(medicine);

            saveMedicines();

            displayMedicines();

            clearMedicineForm();


            alert(
                "Medicine added successfully! 💊"
            );

        }
    );

}


/* =========================================
   DISPLAY MEDICINES
========================================= */

function displayMedicines() {

    if (!medicineTableBody) {
        return;
    }


    medicineTableBody.innerHTML = "";


    if (medicines.length === 0) {

        medicineTableBody.innerHTML = `

            <tr>

                <td colspan="7">
                    No medicines added yet.
                </td>

            </tr>

        `;


        if (medicineCount) {

            medicineCount.textContent =
                "0 Medicines";

        }

        return;

    }


    medicines.forEach(
        function (medicine, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${medicine.name}
                    </strong>
                </td>

                <td>
                    ${medicine.category}
                </td>

                <td>
                    ₹${medicine.price}
                </td>

                <td>
                    ${medicine.quantity}
                </td>

                <td>
                    ${medicine.expiry}
                </td>

                <td>
                    ${medicine.batch}
                </td>

                <td>

                    <button
                        class="delete-medicine"
                        onclick="deleteMedicine(${index})">

                        Delete

                    </button>

                </td>

            `;


            medicineTableBody.appendChild(row);

        }
    );


    if (medicineCount) {

        medicineCount.textContent =
            medicines.length +
            (
                medicines.length === 1
                    ? " Medicine"
                    : " Medicines"
            );

    }

}


/* =========================================
   SAVE MEDICINES
========================================= */

function saveMedicines() {

    localStorage.setItem(
        "medistockMedicines",
        JSON.stringify(medicines)
    );

}


/* =========================================
   DELETE MEDICINE
========================================= */

function deleteMedicine(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this medicine?"
        );


    if (!confirmDelete) {
        return;
    }


    medicines.splice(index, 1);

    saveMedicines();

    displayMedicines();

}


/* =========================================
   CLEAR MEDICINE FORM
========================================= */

function clearMedicineForm() {

    if (medicineName)
        medicineName.value = "";

    if (category)
        category.value = "";

    if (price)
        price.value = "";

    if (quantity)
        quantity.value = "";

    if (expiry)
        expiry.value = "";

    if (batch)
        batch.value = "";

}


/* =========================================
   CANCEL MEDICINE
========================================= */

if (cancelMedicineButton) {

    cancelMedicineButton.addEventListener(
        "click",
        function () {

            clearMedicineForm();

        }
    );

}


/* =========================================
   STOCK PAGE
========================================= */

const stockTableBody =
    document.querySelector(
        ".table-container tbody"
    );


if (
    stockTableBody &&
    !medicineTableBody
) {

    displayStock();

}


function displayStock() {

    stockTableBody.innerHTML = "";


    if (medicines.length === 0) {

        stockTableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    No stock information available.
                </td>

            </tr>

        `;

        return;

    }


    let availableStock = 0;

    let lowStock = 0;

    let outOfStock = 0;


    medicines.forEach(
        function (medicine) {

            const medicineQuantity =
                Number(medicine.quantity);


            availableStock +=
                medicineQuantity;


            let status =
                "Available";


            if (medicineQuantity === 0) {

                status =
                    "Out of Stock";

                outOfStock++;

            }

            else if (
                medicineQuantity <= 5
            ) {

                status =
                    "Low Stock";

                lowStock++;

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${medicine.name}
                    </strong>
                </td>

                <td>
                    ${medicine.category}
                </td>

                <td>
                    ${medicineQuantity}
                </td>

                <td>
                    ₹${medicine.price}
                </td>

                <td>
                    ${medicine.expiry}
                </td>

                <td>
                    ${status}
                </td>

            `;


            stockTableBody.appendChild(row);

        }
    );


    updateStockCards(
        medicines.length,
        availableStock,
        lowStock,
        outOfStock
    );

}


/* =========================================
   STOCK CARDS
========================================= */

function updateStockCards(
    total,
    available,
    low,
    out
) {

    const stockCards =
        document.querySelectorAll(
            ".dashboard-card"
        );


    if (stockCards.length < 4) {
        return;
    }


    stockCards[0]
        .querySelector("p")
        .textContent = total;


    stockCards[1]
        .querySelector("p")
        .textContent = available;


    stockCards[2]
        .querySelector("p")
        .textContent = low;


    stockCards[3]
        .querySelector("p")
        .textContent = out;

}


/* =========================================
   DASHBOARD
========================================= */

const dashboardMedicineCount =
    document.getElementById(
        "dashboardMedicineCount"
    );

const dashboardStockCount =
    document.getElementById(
        "dashboardStockCount"
    );

const dashboardLowStock =
    document.getElementById(
        "dashboardLowStock"
    );


if (
    dashboardMedicineCount ||
    dashboardStockCount ||
    dashboardLowStock
) {

    updateDashboard();

}


function updateDashboard() {

    let totalMedicines =
        medicines.length;

    let totalStock = 0;

    let lowStock = 0;


    medicines.forEach(
        function (medicine) {

            const medicineQuantity =
                Number(medicine.quantity);


            totalStock +=
                medicineQuantity;


            if (
                medicineQuantity > 0 &&
                medicineQuantity <= 5
            ) {

                lowStock++;

            }

        }
    );


    if (dashboardMedicineCount) {

        dashboardMedicineCount.textContent =
            totalMedicines;

    }


    if (dashboardStockCount) {

        dashboardStockCount.textContent =
            totalStock;

    }


    if (dashboardLowStock) {

        dashboardLowStock.textContent =
            lowStock;

    }

}


/* =========================================
   BILLING
========================================= */

const billMedicine =
    document.getElementById(
        "billMedicine"
    );

const billQuantity =
    document.getElementById(
        "billQuantity"
    );

const billUnitPrice =
    document.getElementById(
        "billUnitPrice"
    );

const billAvailableStock =
    document.getElementById(
        "billAvailableStock"
    );

const billTotal =
    document.getElementById(
        "billTotal"
    );

const addToBillButton =
    document.getElementById(
        "addToBillButton"
    );

const billTableBody =
    document.getElementById(
        "billTableBody"
    );

const grandTotal =
    document.getElementById(
        "grandTotal"
    );

const generateBillButton =
    document.getElementById(
        "generateBillButton"
    );


let currentBill = [];


/* =========================================
   BILL MEDICINE DROPDOWN
========================================= */

if (billMedicine) {

    medicines.forEach(
        function (medicine, index) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =
                medicine.name;


            billMedicine.appendChild(
                option
            );

        }
    );

}


/* =========================================
   BILL MEDICINE SELECTION
========================================= */

if (billMedicine) {

    billMedicine.addEventListener(
        "change",
        function () {

            const selectedIndex =
                billMedicine.value;


            if (selectedIndex === "") {

                billUnitPrice.textContent =
                    "₹0";

                billAvailableStock.textContent =
                    "0";

                billTotal.textContent =
                    "₹0";

                return;

            }


            const medicine =
                medicines[selectedIndex];


            billUnitPrice.textContent =
                "₹" + medicine.price;


            billAvailableStock.textContent =
                medicine.quantity;


            calculateBillTotal();

        }
    );

}


/* =========================================
   CALCULATE BILL
========================================= */

function calculateBillTotal() {

    if (
        !billMedicine ||
        billMedicine.value === ""
    ) {

        return;

    }


    const medicine =
        medicines[billMedicine.value];


    const billQty =
        Number(billQuantity.value) || 0;


    const total =
        Number(medicine.price) *
        billQty;


    billTotal.textContent =
        "₹" + total;

}


if (billQuantity) {

    billQuantity.addEventListener(
        "input",
        calculateBillTotal
    );

}


/* =========================================
   ADD TO BILL
========================================= */

if (addToBillButton) {

    addToBillButton.addEventListener(
        "click",
        function () {

            if (billMedicine.value === "") {

                alert(
                    "Please select a medicine."
                );

                return;

            }


            const selectedIndex =
                Number(billMedicine.value);


            const medicine =
                medicines[selectedIndex];


            const billQty =
                Number(billQuantity.value);


            if (!billQty || billQty <= 0) {

                alert(
                    "Please enter a valid quantity."
                );

                return;

            }


            if (
                billQty >
                Number(medicine.quantity)
            ) {

                alert(
                    "Quantity cannot be greater than available stock."
                );

                return;

            }


            const itemTotal =
                Number(medicine.price) *
                billQty;


            currentBill.push({

                medicineIndex:
                    selectedIndex,

                name:
                    medicine.name,

                price:
                    Number(medicine.price),

                quantity:
                    billQty,

                total:
                    itemTotal

            });


            displayCurrentBill();


            billQuantity.value = "";

            billTotal.textContent =
                "₹0";

        }
    );

}


/* =========================================
   DISPLAY CURRENT BILL
========================================= */

function displayCurrentBill() {

    if (!billTableBody) {
        return;
    }


    billTableBody.innerHTML = "";


    if (currentBill.length === 0) {

        billTableBody.innerHTML = `

            <tr>

                <td colspan="5">
                    No items added to bill.
                </td>

            </tr>

        `;

        grandTotal.textContent = "₹0";

        return;

    }


    let totalAmount = 0;


    currentBill.forEach(
        function (item, index) {

            totalAmount +=
                item.total;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.name}
                </td>

                <td>
                    ₹${item.price}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ₹${item.total}
                </td>

                <td>

                    <button
                        class="delete-bill-item"
                        onclick="deleteBillItem(${index})">

                        Delete

                    </button>

                </td>

            `;


            billTableBody.appendChild(row);

        }
    );


    grandTotal.textContent =
        "₹" + totalAmount;

}
/* =========================================
   DELETE BILL ITEM
========================================= */

function deleteBillItem(index) {

    currentBill.splice(index, 1);

    displayCurrentBill();

}


/* =========================================
   GENERATE BILL
========================================= */

if (generateBillButton) {

    generateBillButton.addEventListener(
        "click",
        function () {

            if (currentBill.length === 0) {

                alert(
                    "Please add at least one item to the bill."
                );

                return;

            }


            let totalAmount = 0;


            currentBill.forEach(
                function (item) {

                    totalAmount +=
                        item.total;

                }
            );


            /* =========================================
               SAVE TOTAL SALES
            ========================================= */

            const previousSales =
                Number(
                    localStorage.getItem(
                        "medistockTotalSales"
                    )
                ) || 0;


            const newTotalSales =
                previousSales + totalAmount;


            localStorage.setItem(
                "medistockTotalSales",
                String(newTotalSales)
            );


            /* =========================================
               REDUCE MEDICINE STOCK
            ========================================= */

            currentBill.forEach(
                function (item) {

                    const medicine =
                        medicines[item.medicineIndex];


                    if (medicine) {

                        medicine.quantity =
                            Number(medicine.quantity) -
                            Number(item.quantity);

                    }

                }
            );


            saveMedicines();


            alert(
                "Bill generated successfully! 🧾"
            );


            currentBill = [];


            displayCurrentBill();


            if (billMedicine) {

                billMedicine.value = "";

            }


            if (billQuantity) {

                billQuantity.value = "";

            }


            if (billUnitPrice) {

                billUnitPrice.textContent =
                    "₹0";

            }


            if (billAvailableStock) {

                billAvailableStock.textContent =
                    "0";

            }


            if (billTotal) {

                billTotal.textContent =
                    "₹0";

            }


            if (grandTotal) {

                grandTotal.textContent =
                    "₹0";

            }

        }
    );

}


/* =========================================
   CUSTOMER PAGE
========================================= */

const customerName =
    document.getElementById(
        "customerName"
    );

const customerPhone =
    document.getElementById(
        "customerPhone"
    );

const customerEmail =
    document.getElementById(
        "customerEmail"
    );

const customerAddress =
    document.getElementById(
        "customerAddress"
    );

const addCustomerButton =
    document.querySelector(
        ".customer-add-button"
    );

const cancelCustomerButton =
    document.querySelector(
        ".customer-cancel-button"
    );

const customerTableBody =
    document.getElementById(
        "customerTableBody"
    );


/* =========================================
   ADD CUSTOMER
========================================= */

if (addCustomerButton) {

    addCustomerButton.addEventListener(
        "click",
        function () {

            if (
                customerName.value.trim() === "" ||
                customerPhone.value.trim() === "" ||
                customerEmail.value.trim() === "" ||
                customerAddress.value.trim() === ""
            ) {

                alert(
                    "Please fill all customer details."
                );

                return;

            }


            const customer = {

                name:
                    customerName.value.trim(),

                phone:
                    customerPhone.value.trim(),

                email:
                    customerEmail.value.trim(),

                address:
                    customerAddress.value.trim()

            };


            customers.push(customer);

            saveCustomers();

            displayCustomers();

            clearCustomerForm();


            alert(
                "Customer added successfully! 👤"
            );

        }
    );

}


/* =========================================
   DISPLAY CUSTOMERS
========================================= */

function displayCustomers() {

    if (!customerTableBody) {
        return;
    }


    customerTableBody.innerHTML = "";


    if (customers.length === 0) {

        customerTableBody.innerHTML = `

            <tr>

                <td colspan="5">
                    No customers added yet.
                </td>

            </tr>

        `;

        return;

    }


    customers.forEach(
        function (customer, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${customer.name}
                </td>

                <td>
                    ${customer.phone}
                </td>

                <td>
                    ${customer.email}
                </td>

                <td>
                    ${customer.address}
                </td>

                <td>

                    <button
                        class="delete-customer"
                        onclick="deleteCustomer(${index})">

                        Delete

                    </button>

                </td>

            `;


            customerTableBody.appendChild(row);

        }
    );

}


/* =========================================
   SAVE CUSTOMERS
========================================= */

function saveCustomers() {

    localStorage.setItem(
        "medistockCustomers",
        JSON.stringify(customers)
    );

}


/* =========================================
   DELETE CUSTOMER
========================================= */

function deleteCustomer(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmDelete) {
        return;
    }


    customers.splice(index, 1);

    saveCustomers();

    displayCustomers();

}


/* =========================================
   CLEAR CUSTOMER FORM
========================================= */

function clearCustomerForm() {

    if (customerName)
        customerName.value = "";

    if (customerPhone)
        customerPhone.value = "";

    if (customerEmail)
        customerEmail.value = "";

    if (customerAddress)
        customerAddress.value = "";

}


/* =========================================
   CANCEL CUSTOMER
========================================= */

if (cancelCustomerButton) {

    cancelCustomerButton.addEventListener(
        "click",
        function () {

            clearCustomerForm();

        }
    );

}


/* =========================================
   SUPPLIER PAGE
========================================= */

const supplierName =
    document.getElementById(
        "supplierName"
    );

const supplierPhone =
    document.getElementById(
        "supplierPhone"
    );

const supplierEmail =
    document.getElementById(
        "supplierEmail"
    );

const supplierAddress =
    document.getElementById(
        "supplierAddress"
    );

const addSupplierButton =
    document.querySelector(
        ".supplier-add-button"
    );

const cancelSupplierButton =
    document.querySelector(
        ".supplier-cancel-button"
    );

const supplierTableBody =
    document.getElementById(
        "supplierTableBody"
    );


/* =========================================
   ADD SUPPLIER
========================================= */

if (addSupplierButton) {

    addSupplierButton.addEventListener(
        "click",
        function () {

            if (
                supplierName.value.trim() === "" ||
                supplierPhone.value.trim() === "" ||
                supplierEmail.value.trim() === "" ||
                supplierAddress.value.trim() === ""
            ) {

                alert(
                    "Please fill all supplier details."
                );

                return;

            }


            const supplier = {

                name:
                    supplierName.value.trim(),

                phone:
                    supplierPhone.value.trim(),

                email:
                    supplierEmail.value.trim(),

                address:
                    supplierAddress.value.trim()

            };


            suppliers.push(supplier);

            saveSuppliers();

            displaySuppliers();

            clearSupplierForm();


            alert(
                "Supplier added successfully! 🏢"
            );

        }
    );

}


/* =========================================
   DISPLAY SUPPLIERS
========================================= */

function displaySuppliers() {

    if (!supplierTableBody) {
        return;
    }


    supplierTableBody.innerHTML = "";


    if (suppliers.length === 0) {

        supplierTableBody.innerHTML = `

            <tr>

                <td colspan="5">
                    No suppliers added yet.
                </td>

            </tr>

        `;

        return;

    }


    suppliers.forEach(
        function (supplier, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${supplier.name}
                </td>

                <td>
                    ${supplier.phone}
                </td>

                <td>
                    ${supplier.email}
                </td>

                <td>
                    ${supplier.address}
                </td>

                <td>

                    <button
                        class="delete-supplier"
                        onclick="deleteSupplier(${index})">

                        Delete

                    </button>

                </td>

            `;


            supplierTableBody.appendChild(row);

        }
    );

}


/* =========================================
   SAVE SUPPLIERS
========================================= */

function saveSuppliers() {

    localStorage.setItem(
        "medistockSuppliers",
        JSON.stringify(suppliers)
    );

}


/* =========================================
   DELETE SUPPLIER
========================================= */

function deleteSupplier(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this supplier?"
        );


    if (!confirmDelete) {
        return;
    }


    suppliers.splice(index, 1);

    saveSuppliers();

    displaySuppliers();

}


/* =========================================
   CLEAR SUPPLIER FORM
========================================= */

function clearSupplierForm() {

    if (supplierName)
        supplierName.value = "";

    if (supplierPhone)
        supplierPhone.value = "";

    if (supplierEmail)
        supplierEmail.value = "";

    if (supplierAddress)
        supplierAddress.value = "";

}


/* =========================================
   CANCEL SUPPLIER
========================================= */

if (cancelSupplierButton) {

    cancelSupplierButton.addEventListener(
        "click",
        function () {

            clearSupplierForm();

        }
    );

}


/* =========================================
   INITIALIZE PAGES
========================================= */

if (medicineTableBody) {

    displayMedicines();

}


if (customerTableBody) {

    displayCustomers();

}


if (supplierTableBody) {

    displaySuppliers();

}


/* =========================================
   REPORTS PAGE
========================================= */

const reportMedicineCount =
    document.getElementById(
        "reportMedicineCount"
    );

const reportStockCount =
    document.getElementById(
        "reportStockCount"
    );

const reportCustomerCount =
    document.getElementById(
        "reportCustomerCount"
    );

const reportSupplierCount =
    document.getElementById(
        "reportSupplierCount"
    );

const summaryMedicines =
    document.getElementById(
        "summaryMedicines"
    );

const summaryCustomers =
    document.getElementById(
        "summaryCustomers"
    );

const summarySuppliers =
    document.getElementById(
        "summarySuppliers"
    );

const summaryLowStock =
    document.getElementById(
        "summaryLowStock"
    );


function updateReports() {

    const savedMedicines =
        medicines;

    const savedCustomers =
        customers;

    const savedSuppliers =
        suppliers;


    let totalStock = 0;

    let lowStock = 0;


    savedMedicines.forEach(
        function (medicine) {

            const medicineQuantity =
                Number(medicine.quantity) || 0;


            totalStock +=
                medicineQuantity;


            if (
                medicineQuantity > 0 &&
                medicineQuantity <= 5
            ) {

                lowStock++;

            }

        }
    );


    if (reportMedicineCount) {

        reportMedicineCount.textContent =
            savedMedicines.length;

    }


    if (reportStockCount) {

        reportStockCount.textContent =
            totalStock;

    }


    if (reportCustomerCount) {

        reportCustomerCount.textContent =
            savedCustomers.length;

    }


    if (reportSupplierCount) {

        reportSupplierCount.textContent =
            savedSuppliers.length;

    }


    if (summaryMedicines) {

        summaryMedicines.textContent =
            savedMedicines.length;

    }


    if (summaryCustomers) {

        summaryCustomers.textContent =
            savedCustomers.length;

    }


    if (summarySuppliers) {

        summarySuppliers.textContent =
            savedSuppliers.length;

    }


    if (summaryLowStock) {

        summaryLowStock.textContent =
            lowStock;

    }

}


if (
    reportMedicineCount ||
    reportStockCount ||
    reportCustomerCount ||
    reportSupplierCount ||
    summaryMedicines ||
    summaryCustomers ||
    summarySuppliers ||
    summaryLowStock
) {

    updateReports();

}


/* =========================================
   DASHBOARD TOTAL SALES
========================================= */

const dashboardTotalSales =
    document.getElementById(
        "dashboardTotalSales"
    );


if (dashboardTotalSales) {

    const totalSales =
        Number(
            localStorage.getItem(
                "medistockTotalSales"
            )
        ) || 0;


    dashboardTotalSales.textContent =
        "₹" + totalSales;

}
// LOW STOCK MEDICINES LIST

const lowStockList =
    document.getElementById("lowStockList");

if (lowStockList) {

    const lowStockMedicines =
        medicines.filter(function (medicine) {

            const quantity =
                Number(medicine.quantity) || 0;

            return quantity > 0 && quantity <= 5;
        });

    if (lowStockMedicines.length === 0) {

        lowStockList.innerHTML =
            "<p>No low stock medicines.</p>";

    } else {

        lowStockList.innerHTML = "";

        lowStockMedicines.forEach(function (medicine) {

            const item =
                document.createElement("div");

            item.className = "low-stock-item";

            item.innerHTML = `
                <strong>${medicine.name}</strong>
                <span>Only ${medicine.quantity} left</span>
            `;

            lowStockList.appendChild(item);
        });
    }
}