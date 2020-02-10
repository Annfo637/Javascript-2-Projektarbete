$(document).ready(function() {
  //initiera variabler, ska vi göra detta eller inte? Vad tycker du?
  //let allProducts = ""; //Produkttabellen inkl html-taggar
  //let products = []; JSON-arrayen m objekt
  let $storedArray = [];
  const $cart = $("#cartItems"); //div-elementet som innehåller varukorgen
  let $cartItems = ""; //Varukorgstabellen inkl html-taggar
  let $cartArray = []; //Array m varukorgens innehåll (produkter) i form av objekt
  let $updateButtons = [];
  let $deleteButtons = [];
  //$addProductsButtons = $(".addProductBtn");

  $.getJSON("products.json", function(products) {
    //DEL 1. STORE

    //1.1 Rita ut tabell med alla produkter från JSON-filen
    let allProducts = '<table class="table table-striped table-hover">';
    allProducts += `<thead class="thead-dark">
                  <tr>
                    <th></th>
                    <th>Namn</th>
                    <th>Ursprungsland</th>
                    <th>Pris/st</th>
                    <th>Antal</th>
                    <th></th>
                  </tr
                </thead>
      `;

    products.forEach(product => {
      allProducts += `<tr>
                          <td><div class="img-container"><img src="${product.image}"</div></td>						
                          <td>${product.name}</td>
                          <td>${product.origin}</td>
                          <td>${product.price} SEK</td>
                          <td><input type="number" min=0 id="${product.id}" class="quantity"></input>
                          <td><button type="button" id="${product.id}" class="addProductBtn">Lägg i varukorg</button>
                      </tr>`;
    });

    allProducts += "</table";
    $("#products").html(allProducts);

    //1.2. Skapa lyssnare för statiska element i produktlistan
    // Alla "lägg till"-knappar, anropar addToCart
    const $addProductButtons = $(".addProductBtn");
    $addProductButtons.each(function() {
      $(this).on("click", function() {
        addToCart(this.id);
      });
    });

    //alla antal-input, anropar addQty som lägger till värdet i objektet
    const $itemQuantityFields = $(".quantity");
    $itemQuantityFields.each(function() {
      $(this).on("change", function() {
        addQty(this.id, this.value);
      });
    });

    //1.3. samt visa/dölj varukorg
    const $showCartBtn = $("#showCartBtn");
    $showCartBtn.click(function() {
      $cart.toggle();
    });

    //SLUT PÅ STORE

    //DEL 2. SHOPPING CART
    //2.1 Funktion som ritar upp varukorgen i DOM:en
    function drawCart() {
      $cartItems = "";
      $cartItems += `<h3>Din varukorg</h3><table class="table table-striped table-hover"><thead class="thead-light">
        <tr>
          <th>Namn</th>
          <th>Antal</th>
          <th>Pris/st</th>
          <th></th>
        </tr>
      </thead>
    `;
      $cartArray.forEach(product => {
        $cartItems += `<tr>						
                          <td>${product.name}</td>
                          <td><button type="button" id="${product.id}" class="minusOne changeQty">➖</button>  
                          ${product.qty}  
                          <button type="button" id="${product.id}" class="plusOne changeQty">➕</button></td>
                          <td>${product.price} SEK</td>
                          <td><button type="button" id="${product.id}" class="removeProductBtn">Ta bort</button></td>
                        </tr>
              `;
      });
      $cartItems += "</table>";
      $cartItems += `<h3 class="alignRight">Totalsumma: ${totalPrice(
        $cartArray
      )} kr </h3>`;
      $cartItems +=
        "<button type='button' class='sendOrderBtn'><i class='fa fa-arrow-right'></i> Skicka beställning </button>";
      $cartItems +=
        "<button type='button' class='emptyCartBtn' ><i class='fa fa-trash'></i> Töm varukorgen </button></br></br>";
      //	$cartArray = [] //varför har vi kommenterat ut den här?
      $("#cartItems").html($cartItems);

      //Allt som har förändrats i varukorgon (dvs element som inte är statiska)
      //behöver hanteras i samband med drawCart()

      //2.2 Skapa lyssnare för dynamiska element i varukorgen

      //Cacha plus/minusknappar i variabeln $updateButtons och skapa lyssnare som anropar changeQty
      $updateButtons = $(".changeQty");
      $updateButtons.each(function() {
        $(this).on("click", function() {
          changeQty(this);
        });
      });

      //Cacha "Ta bort"-knappar i variabeln $deleteButtons och skapa lyssnare som anropar removeFromCart
      $deleteButtons = $(".removeProductBtn");
      $deleteButtons.each(function() {
        $(this).on("click", function() {
          removeFromCart(this.id);
        });
      });

      //Cacha "Töm varukorgen"-knappen i variabeln $emptyCartBtn och skapa lyssnare som anropar emptyCart
      $emptyCartBtn = $(".emptyCartBtn");
      $emptyCartBtn.on("click", function() {
        emptyCart();
      });

      //Cacha "Skicka beställning"-knappen i variabeln $sendOrderBtn skapa lyssnare som anropar sendOrder
      $sendOrderBtn = $(".sendOrderBtn");
      $sendOrderBtn.on("click", function() {
        sendOrder();
      });
    }

    //DEL 3. FUNKTIONER SOM MANIPULERAR VARUKORGEN PÅ OLIKA SÄTT
    //3.1 Lägger till ett värde i objektets egenskap qty
    function addQty(id, qty) {
      for (let i = 0; i < products.length; i++) {
        if (id == products[i].id) {
          products[i].qty = qty;
        }
      }
    }

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

    //3.2 Lägg till objekt i varukorgen samt spara det i localstorage
    function addToCart(buttonId) {
      //Villkor för att fältet med qty != 0
      /*let z = parseInt(buttonId) - 1;
      console.log(z);
      console.log($cartArray[z]);

      let existProduct = $cartArray[z];
      console.log(existProduct);

      //Kontrollera om produkten finns i varukorgen,
      //om inte lägg till objektet i $cartArray (EJ KLART)
      if ($cartArray.includes(existProduct)) {
        alert("Produkten ligger redan i varukorgen");
      } else {*/
      for (let i = 0; i < products.length; i++) {
        if (buttonId == products[i].id) {
          $cartArray.push(products[i]);
          //console.log(products[i]);
          console.log($cartArray);
          updateLocalStorage();
          drawCart();
          //töm objektets qty-fält
          $itemQuantityFields[i].value = null;
        }
      }
    }
    //}

    //3.3 Ta bort objekt från varukorgen samt local storage
    function removeFromCart(buttonId) {
      for (let i = 0; i < products.length; i++) {
        if (buttonId == products[i].id) {
          $cartArray.splice([i], 1);
          updateLocalStorage();
          drawCart();
        }
      }
    }
    //3.4 Ändra antal på befintlig produkt i varukorg
    function changeQty(button) {
      $button = button;

      for (let i = 0; i < products.length; i++) {
        if ($button.id == products[i].id) {
          let qty = parseInt(products[i].qty);

          if ($(button).hasClass("plusOne")) {
            qty++;
            products[i].qty = qty;
            $cartArray.splice([i], 1, products[i]);
          } else if ($(button).hasClass("minusOne")) {
            qty--;
            products[i].qty = qty;
            $cartArray.splice([i], 1, products[i]);
          } else {
            alert("Something wrong");
          }
        }
      }
      updateLocalStorage();
      drawCart();
    }

    //3.5 Töm varukorgen, används både vid "töm varukorgen" och "skicka beställning"
    function emptyCart() {
      $cartArray = [];
      //localStorage.clear();
      drawCart();
    }

    //3.6 Skicka beställning
    function sendOrder() {
      alert("Din order skickas");
      window.open("receipt.html");
      console.log($("#orderedProducts")); //kommer inte åt att selecta element i receipt.html?
      emptyCart();
      //OBS! VG-nivå: Funktion som visar orderöversikt på ny sida
    }

    //3.7 Uppdatera localStorage
    function updateLocalStorage() {
      localStorage.clear(); //Rensa localStorage
      localStorage.setItem("storedItems", JSON.stringify($cartArray)); //Spara arrayen i localStorage

      //Eventuellt överflödigt att hämta arrayen från localstorage? Ta i sådana fall bort koden nedan
      $storedArray = JSON.parse(localStorage.getItem("storedItems"));
      console.log($storedArray);
    }

    //OKLART! Hur skriva ut alla köpta produkter i en tabell, på samma sätt som på startsidan?
    /*function getProductsFromLocalStorage() {
			storedArray = JSON.parse(localStorage.getItem("cartItems"))
			console.log(storedArray)
			let output = `<table class="table table-striped table-hover">
								<thead class="thead-light">
								<tr>
								<th></th>
								<th>Namn</th>
								<th>Ursprungsland</th>
								<th>Pris</th>
								<th>Antal</th>
								<th></th>
								</tr>
								</thead>`
			for (let i = 0; i < localStorage.length; i++) {
				console.log(localStorage.getItem(localStorage.key(i))) //Med getItem hämtar vi själva värdet
				output += "<tr>" + localStorage.getItem(localStorage.key(i)) + "<tr/>"
			}
			output += "</table>"
			document.getElementById("test").innerHTML = output
		}
		*/

    //3.8 Visa felmeddelande om JSON-filen inte går att läsa.
  }).fail(function() {
    console.error("Fel vid läsning av JSON!");
  });
});
