//Detta script hanterar att selecta div:en orderedProducts i receipt.html
//samt därefter rita ut den beställda varukorgen
const $receiptArray = JSON.parse(localStorage.getItem("storedItems"));
console.log($receiptArray);

let $orderedProducts = $("#orderedProducts");
$orderedProducts = "";
$orderedProducts += `<table class="table table-striped table-hover"><thead class="thead-light">
        <tr>
          <th>Namn</th>
          <th>Antal</th>
          <th>Pris/st</th>
          <th></th>
        </tr>
      </thead>
    `;
$receiptArray.forEach(product => {
  $orderedProducts += `<tr>						
        <td>${product.name}</td>
        <td>${product.qty}</td>
        <td>${product.price} SEK</td>
    </tr>`;
});
$orderedProducts += "</table>";
$orderedProducts += `<h3 class="alignRight">Totalsumma: ${totalPrice(
  $receiptArray
)} kr </h3>`;
//	$cartArray = [] //varför har vi kommenterat ut den här?*/
$("#orderedProducts").html($orderedProducts);

function totalPrice(arr) {
  let outputPrice = 0;

  for (let i = 0; i < arr.length; i++) {
    const qty = parseInt(arr[i].qty);
    const price = parseInt(arr[i].price);
    outputPrice += qty * price;
  }

  /*$cartArray.each(function() {
      outputPrice += this.qty * this.price;
    });*/

  return outputPrice;
}
