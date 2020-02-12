$(document).ready(function() {
  //initiera variabler, ska vi göra detta eller inte? Vad tycker du?
  //let allProducts = ""; //Produkttabellen inkl html-taggar
  //let products = []; JSON-arrayen m objekt
  const $cart = $("#cartItems"); //div-elementet som innehåller varukorgen
  let $cartItems = ""; //Varukorgstabellen inkl html-taggar
  let $cartArray = []; //Array m varukorgens innehåll (produkter) i form av objekt
  let $updateButtons = [];
  let $deleteButtons = [];

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
                          <td><button type="button" id="${product.id}" class="addProductBtn"><i class="fa fa-cart-plus" aria-hidden="true"></i>
                          Lägg i varukorg</button>
                      </tr>`;
    });

    allProducts += "</table";
    $("#products").html(allProducts);

    //1.2. Skapa lyssnare för statiska element på produktsidan
    // Cacha alla "lägg till"-knappar, skapa lyssnare som anropar addToCart
    const $addProductButtons = $(".addProductBtn");
    $addProductButtons.each(function() {
      $(this).on("click", function() {
        addToCart(this.id);
      });
    });

    //Cacha alla antal-input, skapa lyssnare som anropar addQty (uppdaterar Qty på det aktuella objektet)
    const $itemQuantityFields = $(".quantity");
    $itemQuantityFields.each(function() {
      $(this).on("change", function() {
        addQty(this.id, this.value);
      });
    });

    //1.3 Visa/dölj varukorg
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
                          <td><button type="button" id="${product.id}" class="minusOne changeQty"><i class="fa fa-minus" aria-hidden="true"></i></button>  
                          ${product.qty}  
                          <button type="button" id="${product.id}" class="plusOne changeQty"><i class="fa fa-plus" aria-hidden="true"></i></button></td>
                          <td>${product.price} SEK</td>
                          <td><button type="button" id="${product.id}" class="removeProductBtn"><i class="fa fa-trash-o" aria-hidden="true"></i> Ta bort</button></td>
                        </tr>
              `;
      });
      $cartItems += "</table>";
      $cartItems += `<h3>Totalsumma: ${totalPrice($cartArray)} kr </h3>`;
      $cartItems +=
        "<button type='button' class='sendOrderBtn'><i class='fa fa-arrow-right'></i> Skicka beställning </button>";
      $cartItems +=
        "<button type='button' class='emptyCartBtn' ><i class='fa fa-trash'></i> Töm varukorgen </button></br></br>";
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

    //DEL 3. FUNKTIONER SOM ANROPAS VID EVENT
    // DESSA MANIPULERAR/ÄNDRAR VARUKORGEN PÅ OLIKA SÄTT
    //3.1 Lägger till ett värde i objektets egenskap qty
    function addQty(id, qty) {
      for (let i = 0; i < products.length; i++) {
        if (id == products[i].id) {
          products[i].qty = qty;
        }
      }
    }

    //3.2 Lägg till objekt i varukorgen samt spara det i localstorage
    function addToCart(buttonId) {
      let index = parseInt(buttonId) - 1; //minska med 1 eftersom index börjar på 0 och inte 1.
      let newProduct = products[index];
      //if (villkor) för att undvika produktdubbletter
      if ($cartArray.includes(newProduct)) {
        alert("Produkten är redan tillagd, vänligen ändra antal i varukorgen");
        $itemQuantityFields[index].value = null;
      } else {
        for (let i = 0; i < products.length; i++) {
          if (buttonId == products[i].id) {
            $cartArray.push(products[i]);
            updateLocalStorage();
            drawCart();
            $itemQuantityFields[i].value = null;
          }
        }
      }
    }

    //3.3 Ta bort objekt från varukorgen samt local storage
    function removeFromCart(buttonId) {
      const productID = parseInt(buttonId);
      const updatedCart = $cartArray.filter(function(item) {
        return item.id !== productID;
      });
      $cartArray = updatedCart;
      updateLocalStorage();
      drawCart();
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
          } else if ($(button).hasClass("minusOne")) {
            qty--;
            products[i].qty = qty;
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
      drawCart();
    }

    //3.6 Räknar ut totalsumman, tar in aktuell cartArray som argument
    function totalPrice(arr) {
      let outputPrice = 0;

      for (let i = 0; i < arr.length; i++) {
        const qty = parseInt(arr[i].qty);
        const price = parseInt(arr[i].price);
        outputPrice += qty * price;
      }
      return outputPrice;
    }

    //3.7 Skicka beställning
    function sendOrder() {
      alert("Din order skickas");
      openreceiptWindow();
      emptyCart();
    }
    //3.8 Öppna orderbekräftelse i eget fönster
    function openreceiptWindow() {
      window.open(
        "receipt.html",
        "_blank",
        "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=200,width=700,height=400"
      );
    }

    //3.9 Uppdatera localStorage
    function updateLocalStorage() {
      localStorage.clear(); //Börja med att tömma localStorage, innan vi fyller på den med den uppdaterade cartArray.
      localStorage.setItem("storedItems", JSON.stringify($cartArray)); //Spara arrayen i localStorage
    }

    //3.10 Visa felmeddelande om JSON-filen inte går att läsa.
  }).fail(function() {
    console.error("Fel vid läsning av JSON!");
  });
});
