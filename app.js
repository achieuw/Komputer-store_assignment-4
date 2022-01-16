const balanceElement = document.getElementById("bank-balance");
const loanElement = document.getElementById("loan");
const loanTextElement = document.getElementById("loan-text");
const loanBtnElement = document.getElementById("loan-btn");
const payElement = document.getElementById("pay-balance");
const bankBtnElement = document.getElementById("bank-btn");
const workBtnElement = document.getElementById("work-btn");
const repayBtnElement = document.getElementById("repay-btn");
const laptopMenuElement = document.getElementById("laptop-menu");
const specListElement = document.getElementById("spec-list");
const specTextBoxElement = document.getElementById("spec-text-box");
const laptopImgElement = document.getElementById("laptop-img");
const laptopPriceElement = document.getElementById("laptop-price");
const laptopTitleElement = document.getElementById("laptop-title");
const laptopInfoElement = document.getElementById("laptop-info");
const buyBtnElement = document.getElementById("buy-btn");
const buyErrorTextElement = document.getElementById("buy-error-text");
const loanErrorTextElement = document.getElementById("loan-error-text")

const workPay = 100;
const paybackRate = 0.1; // set rate between 0-1
let laptops = [];
let laptopImgList = [];

// Fetche data from API and add to list of laptops
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
  .then((response) => response.json())
  .then((data) => (laptops = data))
  .then((laptops) => addLaptopsToMenu(laptops))
  .catch((error) => console.log(error));

// -- Helper functions -- (Add helper class?)
function hideElements(...elementsList) {
  elementsList.forEach((e) => (e.style.visibility = "hidden"));
}
function showElements(...elementsList) {
  elementsList.forEach((e) => (e.style.visibility = "visible"));
}
const formatNumToSEK = (number) => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(number);
};
function addListItemsWithText(dataList, listElement) {
  for (const item of dataList) {
    const itemElement = document.createElement("li");
    itemElement.innerText = item;
    listElement.appendChild(itemElement);
  }
}

//Base class for Bank functionality
class Bank {
  constructor() {
    this.balance = 0;
    this.loan = 0;
    this.pay = 0;
    this.init = this.update();
  }
  // Check loan status and update elements accordingly
  update() {
    if (this.loan === 0) {
      hideElements(loanTextElement, loanErrorTextElement, repayBtnElement);
    } else {
      loanElement.innerText = formatNumToSEK(this.loan);
      showElements(loanTextElement, repayBtnElement);
    }
    balanceElement.innerText = formatNumToSEK(this.balance);
    payElement.innerText = formatNumToSEK(this.pay);
  }
  // Logic for the payments
  handleBank() {
    const loanPayment = this.pay * paybackRate;
    if (this.loan >= loanPayment) {
      this.loan -= loanPayment;
      this.balance += this.pay * (1 - paybackRate);
    } else if (this.loan < this.pay * paybackRate) {
      this.balance += this.pay - this.loan;
      this.loan = 0;
    } else {
      this.balance += this.pay;
    }
    this.pay = 0;
  }
  // Add payment to pay balance
  handleWork = () => {
    this.pay += workPay;
  }
  // Logic for loan repay
  handleRepay() {
    if (this.loan > this.pay) {
      this.loan -= this.pay;
      this.pay = 0;
    } else {
      this.pay -= this.loan;
      this.loan = 0;
    }
  }
  // Check if loan is valid
  handleLoan() {
    // Check for active loan
    if (this.loan > 0) {
      showElements(loanErrorTextElement);
      return; // Return since a loan cannot be taken if one is already active
    }
    // Loop until a valid input is given
    do {
      // Regex check for valid number input.
      // Supports '.' divider but not ',' because of the currency converter
      // let regex = /^[+-]?(\d*|\d{1,3}(,\d{3})*)(\.)(\d+)?\b$/;

      // Regex checks for valid number input
      let regex = /^\d+$/;
      let loanAmount = prompt("Enter loan amount: ");
      if (loanAmount == null) return;

      if (regex.exec(loanAmount)) {
        if (loanAmount > this.balance * 2) { // Cant loan more than double the balance
          alert(
            "You can't loan more than double your balance, please try again."
          );
        } else if (this.loan === 0) {
          this.balance += parseInt(loanAmount);
          this.loan += parseInt(loanAmount);
        }
      } else alert("Enter valid amount");
    } while (this.loan <= 0);
  }
  // Check price against current
  handleBuy() {
    const priceToPay = parseInt(getCurrentlySelectedLaptop().price);
    if (this.balance >= priceToPay) {
      this.balance -= priceToPay;
      alert("Successfully bought laptop!");
    } else {
      showElements(buyErrorTextElement);
    }
  }
}

const addLaptopsToMenu = (laptopList) => {
  laptopList.forEach((e) => addLaptopToMenu(e));
  handleLaptopMenuChange();
}
// Add a laptop option element to the select dropdown menu
const addLaptopToMenu = (laptop) => {
  const laptopOption = new Option(laptop.title, laptop.id);
  laptopMenuElement.appendChild(laptopOption);
  laptopImgList.push(laptop.image);
}
// Change all laptop info elements when changing option in the laptop select menu
const handleLaptopMenuChange = () => {
  const laptopSpecs = getCurrentlySelectedLaptop().specs;
  specListElement.innerHTML = ""; // Remove list elements from spec list before adding new

  // Add feature list
  addListItemsWithText(laptopSpecs, specListElement);
  changeLaptopImgSrc();
  changeLaptopInfo();
  hideElements(buyErrorTextElement);
}
function changeLaptopImgSrc() {
  const imgSrc =
    "https://noroff-komputer-store-api.herokuapp.com/" +
    laptopImgList[getCurrentlySelectedLaptop().id - 1];
  laptopImgElement.src = imgSrc;
  document.getElementById("img-error-text").style.visibility = "hidden";
}
// Called if laptop image cant be found in the API
laptopImgElement.onerror = function () {
  this.onerror = null;
  this.src = "sadge-kitten.jpg";
  document.getElementById("img-error-text").style.visibility = "visible";
}
function changeLaptopInfo() {
  currentSelectedLaptop = getCurrentlySelectedLaptop();
  laptopTitleElement.innerText = currentSelectedLaptop.title;
  laptopInfoElement.innerText = currentSelectedLaptop.description;
  laptopPriceElement.innerText = formatNumToSEK(currentSelectedLaptop.price);
}
const getCurrentlySelectedLaptop = () => {
  return laptops[laptopMenuElement.selectedIndex];
}

laptopMenuElement.addEventListener('change', handleLaptopMenuChange);

// Initiate new bank object
const bank = new Bank();

loanBtnElement.addEventListener('click', () => {bank.handleLoan(), bank.update()});
bankBtnElement.addEventListener('click', () => {bank.handleBank(), bank.update()});
workBtnElement.addEventListener('click', () => {bank.handleWork(), bank.update()});
repayBtnElement.addEventListener('click', () => {bank.handleRepay(), bank.update()});
buyBtnElement.addEventListener('click', () => {bank.handleBuy(), bank.update()});
