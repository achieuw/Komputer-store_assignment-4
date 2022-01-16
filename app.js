const balanceElement = document.getElementById('bank-balance');
const loanElement = document.getElementById('loan');
const loanTextElement = document.getElementById('loan-text');
const loanBtnElement = document.getElementById('loan-btn');
const payElement = document.getElementById('pay-balance');
const bankBtnElement = document.getElementById('bank-btn');
const workBtnElement = document.getElementById('work-btn');
const repayBtnElement = document.getElementById('repay-btn');
const laptopMenuElement = document.getElementById('laptop-menu');
const specListElement = document.getElementById('spec-list');
const specTextBoxElement = document.getElementById('spec-text-box');
const laptopImgElement = document.getElementById('laptop-img');
const laptopPriceElement = document.getElementById('laptop-price');
const laptopTitleElement = document.getElementById('laptop-title');
const laptopInfoElement = document.getElementById('laptop-info');
const buyBtnElement = document.getElementById('buy-btn');
const buyErrorTextElement = document.getElementById('buy-error-text');

let balance = 0;
let loan = 0;
let pay = 0;
let laptops = [];
let laptopImgList = [];
const activeLoanMsg  = "You already have an active loan. Please pay it back before taking another.";
const errorMsg = document.createElement('span');

// Fetches data from API and adds to list of laptops
fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
  .then(response => response.json())
  .then(data => laptops = data)
  .then(laptops => addLaptopsToMenu(laptops))
  .catch(error => console.log(error));

const addLaptopsToMenu = (laptopList) => {
  laptopList.forEach(e => addLaptopToMenu(e));
  handleLaptopMenuChange();
}
// Add a laptop option element to the select dropdown menu
const addLaptopToMenu = (laptop) => {
  const laptopOption = new Option(laptop.title, laptop.id);
  laptopMenuElement.appendChild(laptopOption);
  laptopImgList.push(laptop.image);
}
// Changes all laptop info elements when changing option in the laptop select menu
const handleLaptopMenuChange = () => {
  const laptopSpecs = getCurrentlySelectedLaptop().specs;
  specListElement.innerHTML = ""; // Remove list elements from spec list before adding new

  // Add feature list
  addListItemsWithText(laptopSpecs, specListElement);
  changeLaptopImgSrc();
  //TODO: Change laptop info
  changeLaptopInfo();
  hideElements([buyErrorTextElement]);

  //TODO: Change laptop price
}

function addListItemsWithText(dataList, listElement){
  for(const item of dataList){
    const itemElement = document.createElement('li');
    itemElement.innerText = item;
    listElement.appendChild(itemElement);
  }
}
function changeLaptopImgSrc(){
  const imgSrc = "https://noroff-komputer-store-api.herokuapp.com/" + laptopImgList[getCurrentlySelectedLaptop().id - 1];
  laptopImgElement.src = imgSrc;
  document.getElementById('img-error-text').style.visibility = "hidden";
}
laptopImgElement.onerror = function(){
  this.onerror = null;
  this.src = 'sadge-kitten.jpg';
  document.getElementById('img-error-text').style.visibility = "visible";
}
function changeLaptopInfo(){
  currentSelectedLaptop = getCurrentlySelectedLaptop();
  laptopTitleElement.innerText = currentSelectedLaptop.title;
  laptopInfoElement.innerText = currentSelectedLaptop.description;
  laptopPriceElement.innerText = formatNumToSEK(currentSelectedLaptop.price);
}

const getCurrentlySelectedLaptop = () => {
  return laptops[laptopMenuElement.selectedIndex];
}

laptopMenuElement.addEventListener('change', handleLaptopMenuChange);

// We can only loan up to double the amount of our balance
const handleLoan = () => {
  // Check for active loan
  if(loan > 0){
    errorMsg.innerText = activeLoanMsg;
    document.getElementById('error-message').appendChild(errorMsg);
    return; // Return since a loan cannot be taken if one is already active 
  }
  // Loop until a valid input is given
  do{
    // Regex check for valid number input. 
    // Supports '.' divider but not ',' because of the currency converter
    //let regex = /^[+-]?(\d*|\d{1,3}(,\d{3})*)(\.)(\d+)?\b$/;

    //Number regex
    let regex = /^\d+$/;
    let loanAmount = prompt("Enter loan amount: ");
    if (loanAmount == null) return;

    if(regex.exec(loanAmount)){
      
      if(loanAmount > balance * 2){
        alert("You can't loan more than double your balance, please try again.");
      }
      else if(loan === 0){
        balance += parseInt(loanAmount);
        loan += parseInt(loanAmount);
      }
    }
    else alert("Enter valid amount")
  }while(loan <= 0); // Loops until user input is valid
  
  updateBank();
}

const handleBank = () => {
  loanPayment = pay * 0.1;
  balanceAmount = pay * 0.9;
  if(loan >= loanPayment){
    loan -= loanPayment;
    balance += pay * 0.9;
  }
  else if(loan < pay * 0.1){
    balance += pay - loan;
    loan = 0;
  }
  else{
    balance += pay;
  }
  pay = 0;
}
const handleWork = () => {
  pay += 100;
}
const handleRepay = () => {
  if(loan > pay){
    loan -= pay;
    pay = 0;
  }
  else{
    pay -= loan;
    loan = 0;
  }
}
function updateBank(){
  if(loan === 0.0){
    hideElements([loanTextElement, errorMsg, repayBtnElement]);
  }
  else{
    loanElement.innerText = formatNumToSEK(loan);
    showElements([loanTextElement, errorMsg, repayBtnElement]);
  }

  balanceElement.innerText = formatNumToSEK(balance);
  payElement.innerText = formatNumToSEK(pay);
}

loanBtnElement.addEventListener('click', () => {handleLoan(); updateBank();});
bankBtnElement.addEventListener('click', () => {handleBank(); updateBank();});
workBtnElement.addEventListener('click', () => {handleWork(); updateBank();});
repayBtnElement.addEventListener('click', () => {handleRepay(); updateBank();});

function hideElements(elementsList){
  elementsList.forEach(e => e.style.visibility = 'hidden');
}
function showElements(elementsList){
  elementsList.forEach(e => e.style.visibility = 'visible');
}
const formatNumToSEK = (number) => {
  return new Intl.NumberFormat(
    'sv-SE', {style: 'currency', currency: 'SEK' })
    .format(number)
}

const handleBuy = () => {
  const priceToPay = parseInt(getCurrentlySelectedLaptop().price);
  if(balance > priceToPay){
    balance -= priceToPay;
    alert("Successfully bought laptop!");
  }
  else{
    showElements([buyErrorTextElement]);
  }
}

buyBtnElement.addEventListener('click', () => {handleBuy(); updateBank();});
updateBank();
