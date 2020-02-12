//Detta script hanterar att selecta div:en orderedProducts i receipt.html
//samt därefter rita ut den beställda varukorgen
$(document).ready(function() {
  const $receiptArray = JSON.parse(localStorage.getItem("storedItems"));

  let $orderedProducts = $("#orderedProducts");
  $orderedProducts = "";
  $orderedProducts += `<table class="table table-striped table-hover"><thead class="thead-light">
        <tr>
          <th></th>
          <th>Namn</th>
          <th>Antal</th>
          <th>Pris/st</th>
        </tr>
      </thead>
    `;
  $receiptArray.forEach(product => {
    $orderedProducts += `<tr>						
        <td><div class="img-container"><img src="${product.image}"</div></td>						
        <td>${product.name}</td>
        <td>${product.qty}</td>
        <td>${product.price} SEK</td>
    </tr>`;
  });
  $orderedProducts += "</table>";
  $orderedProducts += `<h3 class="alignRight">Totalsumma: ${totalPrice(
    $receiptArray
  )} kr </h3>`;
  $("#orderedProducts").html($orderedProducts);
  localStorage.clear();

  function totalPrice(arr) {
    let outputPrice = 0;

    for (let i = 0; i < arr.length; i++) {
      const qty = parseInt(arr[i].qty);
      const price = parseInt(arr[i].price);
      outputPrice += qty * price;
    }
    return outputPrice;
  }

  //Cacha stäng-knappen, sätt lyssnare vid klick som stänger fönstret
  const $closeBtn = $("#close");
  $closeBtn.on("click", function() {
    window.close();
  });
  //Cacha skriv ut-knappen, sätt lyssnare vid klick som öppnar print-dialogruta
  const $printBtn = $("#print");
  $printBtn.on("click", function() {
    window.print();
  });
});
