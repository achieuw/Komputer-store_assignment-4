const balanceElement = document.getElementById('bank-balance');
const loanElement = document.getElementById('loan');
const loanTextElement = document.getElementById('loan-text');
const loanBtnElement = document.getElementById('loan-btn');
const payElement = document.getElementById('pay-balance');
const bankBtnElement = document.getElementById('bank-btn');
const workBtnElement = document.getElementById('work-btn');
const repayBtnElement = document.getElementById('repay-btn');

let balance = 10;
let loan = 0;
let pay = 0;
const activeLoanMsg  = "\n You already have an active loan. Please pay it back before taking another.";
const errorMsg = document.createElement('span');

// We can only loan up to double the amount of our balance
const handleLoan = () => {
  // Check for active loan
  if(loan > 0){
    errorMsg.innerText = activeLoanMsg;
    document.getElementById('error-message').appendChild(errorMsg);
    return; // Return since a loan cannot be taken if one is already active 
  }
  // Loops until a valid input is given
  do{
    // Get loan amount from user input
    const loanAmount = parseInt(prompt("Enter loan amount: "));

    if(loanAmount <= 0){
      alert("Please enter valid amount to loan");
    }
    else if(loanAmount > balance * 2){
      alert("You can't loan more than double your balance, please try again.");
    }
    else if(loan === 0){
      balance += loanAmount;
      loan += loanAmount;
      }
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

loanBtnElement.addEventListener('click', () => {handleLoan(); updateBank();});
bankBtnElement.addEventListener('click', () => {handleBank(); updateBank();});
workBtnElement.addEventListener('click', () => {handleWork(); updateBank();});
repayBtnElement.addEventListener('click', () => {handleRepay(); updateBank();});

function updateBank(){
  if(loan === 0){
    hideElements([loanTextElement, errorMsg]);
  }
  else{
    loanElement.innerText = formatNumToSEK(loan);
    showElements([loanTextElement, errorMsg]);
  }

  balanceElement.innerText = formatNumToSEK(balance);
  payElement.innerText = formatNumToSEK(pay);
}

function hideElements(elementsList){
  elementsList.forEach(e => e.style.visibility = 'hidden');
}
function showElements(elementsList){
  elementsList.forEach(e => e.style.visibility = 'visible');
}

const formatNumToSEK = (number) => {
  return new Intl.NumberFormat(
    'sv-SE', {style: 'currency', currency: 'SEK' })
    .format(number);
}

updateBank();
