let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

/* Add Transaction */

function addTransaction() {

    const description =
    document.getElementById("description").value;

    const amount =
    Number(document.getElementById("amount").value);

    const type =
    document.getElementById("type").value;

    const category =
    document.getElementById("category").value;

    const account =
    document.getElementById("account").value;

    const date =
    document.getElementById("date").value;

    if (!description || !amount) {
        alert("Fill all fields");
        return;
    }

    transactions.push({
        description,
        amount,
        type,
        category,
        account,
        date
    });

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";

    updateUI();
}


/* Delete Transaction */

function deleteTransaction(index) {

    transactions.splice(index, 1);

    updateUI();
}


/* Save Data */

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* Update UI */

function updateUI() {

    const transactionList =
    document.getElementById("transactionList");

    transactionList.innerHTML = "";

    let balance = 0;
    let income = 0;
    let expense = 0;

    transactions.forEach((t, index) => {

        if (t.type === "income") {

            income += Number(t.amount);
            balance += Number(t.amount);

        } else {

            expense += Number(t.amount);
            balance -= Number(t.amount);

        }

        const li =
        document.createElement("li");

        li.className = t.type;

        li.innerHTML = `
            <strong>${t.description}</strong><br>
            ₹${t.amount}<br>
            ${t.category}<br>
            ${t.account}<br>
            ${t.date}
            <br><br>

            <button
            onclick="deleteTransaction(${index})">
            Delete
            </button>
        `;

        transactionList.appendChild(li);

    });

    document.getElementById("balance")
    .innerText = balance;

    document.getElementById("income")
    .innerText = income;

    document.getElementById("expense")
    .innerText = expense;

    checkBudget(expense);

    saveData();

    createChart(income, expense);

}


/* Search */

function searchTransaction() {

    let search =
    document.getElementById("search")
    .value
    .toLowerCase();

    let items =
    document.querySelectorAll("#transactionList li");

    items.forEach(item => {

        item.style.display =
        item.innerText
        .toLowerCase()
        .includes(search)

        ? "block"
        : "none";

    });

}


/* Budget Alert */

function checkBudget(expense) {

    const budget =
    Number(
    document.getElementById("budget")
    .value);

    if (
        budget > 0 &&
        expense > budget
    ) {

        alert(
        "Budget Limit Exceeded!"
        );

    }

}


/* Pie Chart */

function createChart(income, expense) {

    const ctx =
    document.getElementById("myChart");

    if (!ctx) return;

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: [
                "Income",
                "Expense"
            ],

            datasets: [

                {

                    data: [
                        income,
                        expense
                    ],

                    backgroundColor: [
                        "green",
                        "red"
                    ]

                }

            ]

        }

    });

}


/* CSV Export */

function exportCSV() {

    let csv =
    "Description,Amount,Type,Category,Account,Date\n";

    transactions.forEach(t => {

        csv +=
        `${t.description},
${t.amount},
${t.type},
${t.category},
${t.account},
${t.date}\n`;

    });

    let blob =
    new Blob(
    [csv],
    { type: "text/csv" }
    );

    let a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "transactions.csv";

    a.click();

}


/* PDF Export */

function exportPDF() {

    const doc = new jspdf.jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Tracker Report", 15, 15);

    let y = 30;

    doc.text("Date", 10, y);
    doc.text("Description", 50, y);
    doc.text("Amount", 110, y);
    doc.text("Type", 150, y);

    y += 10;

    transactions.forEach((t) => {

        doc.text(String(t.date), 10, y);
        doc.text(String(t.description), 50, y);
        doc.text("₹" + t.amount, 110, y);
        doc.text(String(t.type), 150, y);

        y += 10;

    });

    doc.save("ExpenseTrackerReport.pdf");
}


/* Dark Mode */

function toggleDarkMode() {

    document.body
    .classList
    .toggle("dark");

}


/* Initial Load */

updateUI();