// Get references to elements
const inputForm = document.querySelector('.input-form');
const jenisSelect = document.querySelector('#jenis');
const jumlahInput = document.querySelector('#jumlah');
const keteranganInput = document.querySelector('#keterangan');
const btnSimpan = document.querySelector('#btn-simpan');
const tabelBody = document.querySelector('.tabel-keuangan tbody');
const saldoDisplay = document.querySelector('.saldo-display'); // Add element for saldo display

// Initial saldo from local storage (if available)
let saldo = localStorage.getItem('saldo') ? parseInt(localStorage.getItem('saldo')) : 0; 

// Function to add a new row to the table
function addNewRow(no, jenis, jumlah, keterangan, newSaldo) {
  const tableRow = document.createElement('tr');
  tableRow.innerHTML = `
    <td>${no}</td>
    <td>${jenis}</td>
    <td>${jumlah}</td>
    <td>${keterangan}</td>
    <td>${newSaldo}</td>
  `;
  tabelBody.appendChild(tableRow);
  saldo = newSaldo; // Update saldo
  updateSaldoDisplay(); // Update saldo display
  saveSaldoToLocalStorage(); // Save saldo to local storage
  saveTransactionsToLocalStorage(); // Save transactions to local storage
}

// Function to update saldo display
function updateSaldoDisplay() {
  saldoDisplay.textContent = `Saldo: Rp${saldo}`; // Update saldo display text
}

// Function to save saldo to local storage
function saveSaldoToLocalStorage() {
  localStorage.setItem('saldo', saldo); // Store saldo in local storage
}

// Function to save transactions to local storage
function saveTransactionsToLocalStorage() {
  const transactions = []; // Initialize empty transactions array
  for (let i = 1; i <= tabelBody.children.length; i++) {
    const row = tabelBody.children[i - 1]; // Get the row element
    const no = parseInt(row.children[0].textContent); // Extract data from cells
    const jenis = row.children[1].textContent;
    const jumlah = parseInt(row.children[2].textContent);
    const keterangan = row.children[3].textContent;
    const newSaldo = parseInt(row.children[4].textContent);
    transactions.push({ no, jenis, jumlah, keterangan, newSaldo }); // Add transaction object to array
  }
  localStorage.setItem('transactions', JSON.stringify(transactions)); // Store transactions in local storage (converted to JSON)
}

// Event listener for simpan button
btnSimpan.addEventListener('click', function() {
  const jenis = jenisSelect.value;
  const jumlah = parseInt(jumlahInput.value);
  const keterangan = keteranganInput.value;

  if (jenis && jumlah > 0 && keterangan) {
    const newSaldo = jenis === 'pemasukan' ? saldo + jumlah : saldo - jumlah;
    addNewRow(tabelBody.children.length + 1, jenis, jumlah, keterangan, newSaldo);
    clearInputFields();
  } else {
    alert('Masukkan data dengan benar!');
  }
});

// Function to clear input fields
function clearInputFields() {
  jenisSelect.value = 'pemasukan';
  jumlahInput.value = '';
  keteranganInput.value = '';
}

// Initial saldo display
updateSaldoDisplay();

// Load initial data from local storage (if available)
loadInitialData();

function loadInitialData() {
  const transactionsData = localStorage.getItem('transactions');
  if (transactionsData) {
    const transactions = JSON.parse(transactionsData);
    for (const transaction of transactions) {
      addNewRow(transaction.no, transaction.jenis, transaction.jumlah, transaction.keterangan, transaction.saldo);
    }
  }
}
