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

let price = 19.5;
let cid = [
  ['PENNY', 0.5],
  ['NICKEL', 0],
  ['DIME', 0],
  ['QUARTER', 0],
  ['ONE', 0],
  ['FIVE', 0],
  ['TEN', 0],
  ['TWENTY', 0],
  ['ONE HUNDRED', 0]
];

purchaseBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const cash = Number(cashInput.value);
  const changeDue = cash - price;
  const totalCid = cid.reduce((sum, [_, amount]) => Math.round((sum + amount) * 100) / 100, 0);

  if(cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  if(cash === price) {
    changeDueDiv.textContent = "No change due - customer paid with exact cash";
    return;
  }

  if (Math.abs(totalCid - changeDue) < 0.001) {
    const formattedCid = cid
    .filter(([_, amount]) => amount > 0)
    .map(([unit, amount]) => `${unit}: $${amount.toString().replace(/\.?0+$/, '')}`)
    .join(' ');
    changeDueDiv.textContent = `Status: CLOSED ${formattedCid}`;
    return;
  }
  
  const change = calculateChange(changeDue, cid);
  
  if(change === null) {
    changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
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

