const cashInput = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDueDiv = document.getElementById('change-due');
const currencyUnits = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.10,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100,
}

let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

purchaseBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const cash = Number(cashInput.value);
  const changeDue = cash - price;

  if(cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  if(cash === price) {
    changeDueDiv.textContent = "No change due - customer paid with exact cash";
    return;
  }
  
  const change = calculateChange( changeDue, cid);
  if(change === null) {
    changeDueDiv.textContent = "Status: INSUFFICIENT FUNDS";
    return;
  }

  let changeStr = change.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join(' ');

  changeDueDiv.textContent = `Status: OPEN ${changeStr}`;
  
});

const calculateChange = (changeDue, cid) => {
  let changeArr = [];
  let remaining = changeDue;
  const sortedCid = cid.slice().sort((a,b) => currencyUnits[b[0]] - currencyUnits[a[0]]);

  for(const [unit, amount] of sortedCid) {
    let unitValue = currencyUnits[unit];
    let amountToReturn = 0;

    while(remaining >= unitValue && amountToReturn + unitValue <= amount){
      remaining = Math.round((remaining - unitValue) * 100) / 100;
      amountToReturn = Math.round((amountToReturn + unitValue) * 100) / 100;
    }

    if(amountToReturn > 0) {
      changeArr.push([unit, amountToReturn]);
    }
  }
  if(remaining > 0){
    return null;
  }
  return changeArr;
};

