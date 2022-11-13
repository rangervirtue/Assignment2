//alert("Hello");
//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------
$("#warranty").change(function () {
    if ($(this).is(":checked")) {
        $("#serviceFee").val("0.00");
    } else {
        $("#serviceFee").val("85.00");
    };
});
//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.
//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [
    { item: "iPhone", bond: 275 },
    { item: "otherPhone", bond: 100 },
    { item: "charger", bond: 30 },
];
//------------------------------------------------------------------------------------------------------				   
//We will use "appState" object to track the form change when users interact with the app
//------------------------------------------------------------------------------------------------------		   
let appState = {
    customerType: "customer",
    courtesyPhone: { item: "none", bond: 0 }, //Allow to borrow ONLY 1 phone
    courtesyCharger: { item: "none", bond: 0 }, //Allow to borrow ONLY 1 charger
};
//------------------------------------------------------------------------------------------------------
//"ADD" button event
//------------------------------------------------------------------------------------------------------
$("#addBtn").click(function (e) {
    //Prevent all the default function of the "add" button
    e.preventDefault();

    //Get the selected item
    let selectedItemText = $("#itemList").find(":selected").text();
    let selectedItemValue = $("#itemList").find(":selected").val();
    let selectedItemBond = courtesyList.find((foundItem) => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;

    //Build HTML code of this item
    let newRow = `
				<tr class="newSelectedItem">
					<td>${selectedItemText}</td>
					<td>${selectedItemBond}</td>
				</tr>			
				`;

    //Append this new row to table if it's not existing
    if (appState.courtesyPhone.item == "none" && selectedItemValue.toLowerCase().includes("phone")) {
        //Add a new row
        $("#borrowItems").append(newRow);
        //Update the appState
        appState.courtesyPhone.item = selectedItemValue;
        appState.courtesyPhone.bond = selectedItemBond;
        //Update the "bond" element
        if ($("#customerType").is(":checked")) {
            $("#bond").val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
        } else {
            $("#bond").val(0);
        }
    } else if (appState.courtesyCharger.item == "none" && selectedItemValue.toLowerCase().includes("charger")) {
        $("#borrowItems").append(newRow);
        //Update the appState
        appState.courtesyCharger.item = selectedItemValue;
        appState.courtesyCharger.bond = selectedItemBond;

        //Update the "bond" element
        if ($("#customerType").is(":checked")) {
            $("#bond").val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
        } else {
            $("#bond").val(0);
        }
    } else {
        alert("The item was already added");
    }
});

//Click "Remove" button Event
$("#removeBtn").click(function (e) {
    //Prevent all default actions attached to this button.
    e.preventDefault();
    //Remove all added rows that have the classname = "newSelectedItem"
    $(".newSelectedItem").remove();
    //Update the appState
    appState.courtesyPhone = { item: "none", bond: 0 };
    appState.courtesyCharger = { item: "none", bond: 0 };
    //Update the "bond" element
    $("#bond").val(0);
});

//Change "customer type" event
$("#customerType").click(function () {
    appState.customerType = "customer";
    $("#bond").val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});

$("#businessType").click(function () {
    appState.customerType = "business";
    $("#bond").val(0);
});



//Total + GST Calculation
$("#customerType, #businessType, #warranty").change(function () {
	var bondValue = $("#bond").val();
	var serviceValue = $("#serviceFee").val();
	var totalPrice = +bondValue + +serviceValue;
	var fullGST = (totalPrice / 20) * 3;
	var completePrice = +totalPrice + +fullGST;
	$("#total").val(totalPrice);
	$("#GST").val(fullGST);
	$("#total_With_GST").val(completePrice);
});

$("#addBtn, #removeBtn").click(function () {
	var bondValue = $("#bond").val();
	var serviceValue = $("#serviceFee").val();
	var totalPrice = +bondValue + +serviceValue;
	var fullGST = (totalPrice / 20) * 3;
	var completePrice = +totalPrice + +fullGST;
	$("#total").val(totalPrice);
	$("#GST").val(fullGST);
	$("#total_With_GST").val(completePrice);
});

//Disable warranty if purchase date is greater than 24 months
$("#purchaseDate").change(function () {
    var date = new Date();
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);

    //Warrenty Year
    var warrantyYear = date.getFullYear() - 2;

    //Current date and the current date two years ago stored as variables
    var fullWarrantyYear = warrantyYear + "-" + month + "-" + day;
    var purchaseDate = $("#purchaseDate").val();

    //If the purchase date was 24 months or greater disable the warranty
    if (purchaseDate <= fullWarrantyYear) {
        $("#warranty").prop("disabled", true);
        $("#warranty").prop("checked", false);
        $("#serviceFee").val("85.00");
    } else {
        $("#warranty").prop("disabled", false);
    }
});

//Get the current date and set it as the maximum possible value for the purchase date input box.
$("#submitBtn").click(function () {
    var date = new Date();
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    var year = date.getFullYear();

    //Full date in one variable
    var fullDate = year + "-" + month + "-" + day;

    $("#purchaseDate").attr("max", fullDate);

    var end = $("#purchaseDate").val();
    $("#repairDate").attr("min", end);
    $("#repairDate").attr("max", fullDate);
});

//Updates when reset button is clicked
$("#resetBtn").click(function () {
    //Remove all added rows that have the classname = "newSelectedItem"
    $(".newSelectedItem").remove();

    //Update the appState
    appState.courtesyPhone = { item: "none", bond: 0 };
    appState.courtesyCharger = { item: "none", bond: 0 };
});

//------------------------------------------------------------------------------------------------------
//Repair Form Data
//-----------------------------------------------------------------------------------------------------
//Validation works, sends data to repair page
$("#repairForm").submit(function(e) {
    //Prevent the page from refreshing
    e.preventDefault()
    window.open("repair-booking.html");
})



//------------------------------------------------------------------------------------------------------
//Repair Page form population
//------------------------------------------------------------------------------------------------------
function populateForm() {
    //Retrive the data sent from index.html stored in local storage and replace the repair values
    document.getElementById("nameInfo").innerHTML= localStorage.getItem("nameValue");
    document.getElementById("street").innerHTML=localStorage.getItem("streetL");
    document.getElementById("fullAddress").innerHTML=localStorage.getItem("full_Address");
    document.getElementById("phone").innerHTML=localStorage.getItem("phoneNumber");
    document.getElementById("email").innerHTML=localStorage.getItem("emailAddress");

    document.getElementById("purchaseDate").innerHTML=localStorage.getItem("purchaseValue");
    document.getElementById("repairDate").innerHTML=localStorage.getItem("repairValue");
    document.getElementById("warranty").innerHTML=localStorage.getItem("warrantyValue");
    document.getElementById("IMEI").innerHTML=localStorage.getItem("imeiValue");
    document.getElementById("make").innerHTML=localStorage.getItem("makeValue");
    document.getElementById("modelNumber").innerHTML=localStorage.getItem("modelValue");
    document.getElementById("fault").innerHTML=localStorage.getItem("faultValue");
    document.getElementById("description").innerHTML=localStorage.getItem("descriptionValue");
    
    //Costs
    document.getElementById("bond").innerHTML = localStorage.getItem("bondAmount");
    document.getElementById("serviceFee").innerHTML = localStorage.getItem("service_Fee");
    document.getElementById("total").innerHTML = localStorage.getItem("totalAmount");
    document.getElementById("GST").innerHTML = localStorage.getItem("gstAmt");
    document.getElementById("total_with_GST").innerHTML = localStorage.getItem("totalGstAmount");

    //Amount Due
    document.getElementById("amountTotal").innerHTML = localStorage.getItem("totalGstAmount");

    //Courtesy Loan Device Details
    document.getElementById("itemTable").outerHTML = localStorage.getItem("item_Table");
    
    //Job Number
    document.getElementById("jobNo").innerHTML = localStorage.getItem("jobNo");

    //Repair Dates
    document.getElementById("invDate").innerHTML=localStorage.getItem("invoice_Date");
    document.getElementById("payDueDate").innerHTML=localStorage.getItem("payment_Date");

}

function init() { 
	myBooking = new Booking();
    localStorage.setItem("jobNo", 0000)
}

function saveData() {
    //Name
    var title = $('#title').val();
    var firstName = $("#fName").val();
    var lastName = $("#lName").val();
    var fullName = (title + " " + firstName + " " + lastName);
    
    //Location
    var street = $('#street').val();
    var suburb = $('#suburb').val();
    var city = $('#city').val();
    var postcode = $('#postCode').val();
    var fullAddress = (suburb + ", " + city + " " + postcode);

    //Contact Details
    var phone = $('#phone').val();
    var email = $('#email').val();

    //Dates
    var purchaseDate = $('#purchaseDate').val();
    var repairDate = $('#repairDate').val();
    var invoice_Time = new Date($.now());
    var payment_Time = new Date(new Date().getTime()+(5*24*60*60*1000));

    //Warranty  
    if ($('#warranty').is(':checked')) {
        var warrantyText = $("#warranty").is(':checked');
        var warrantyInfo = ("&#10004;"+ warrantyText);
    } else {
        var warrantyText = $("#warranty").is(':checked');
        var warrantyInfo = ("&#10005;"+ warrantyText);
    }
    //Information
    var IMEI = $("#IMEI").val();
    var phoneMake = $("#make").val();
    var modelNum = $("#modelNumber").val();
    var faultCategory = $("#fault").val();
    var addDescription = $("#description").val();

    //Costs
    var bond_Amt = $("#bond").val();
    var bondAmt = ("$" + bond_Amt);
    var servic_Fee = $("#serviceFee").val();
    var serviceFee = ("$" + servic_Fee);
    var total_Amt = $("#total").val();
    var totalAmt = ("$" + total_Amt);
    var gst_val = $("#GST").val();
    var gst = ("$" + gst_val);
    var total_Amt_GST = $("#totalGST").val();
    var total_With_GST = ("$" + total_Amt_GST);
    
    //Courtesy Loan Device Details
    var itemTable = document.getElementById("borrowItems").outerHTML;

    //Saves the data
    localStorage.setItem("nameValue", fullName)
    localStorage.setItem("streetL", street)
    localStorage.setItem("full_Address", fullAddress)
    localStorage.setItem("phoneNumber", phone)
    localStorage.setItem("emailAddress", email)
    localStorage.setItem("purchaseValue", purchaseDate)
    localStorage.setItem("repairValue", repairDate)
    localStorage.setItem("invoice_Date", invoice_Time)
    localStorage.setItem("payment_Date", payment_Time)
    localStorage.setItem("warrantyValue", warrantyInfo)
    localStorage.setItem("imeiValue", IMEI)
    localStorage.setItem("makeValue", phoneMake)
    localStorage.setItem("modelValue", modelNum)
    localStorage.setItem("faultValue", faultCategory)
    localStorage.setItem("descriptionValue", addDescription)
    localStorage.setItem("bondAmount", bondAmt)
    localStorage.setItem("service_Fee", serviceFee)
    localStorage.setItem("totalAmount", totalAmt)
    localStorage.setItem("gstAmt", gst)
    localStorage.setItem("totalGstAmount", total_With_GST)
    localStorage.setItem("item_Table", itemTable)
    localStorage.setItem("jobNo", +localStorage.getItem("jobNo") + 1)
}
//------------------------------------------------------------------------------------------------------
//JQUERY: Accordion Function
//------------------------------------------------------------------------------------------------------
//Initially hide all advanced
//$(".content-demo-area div ").hide();
$("#content-area-1").hide();
$("#content-area-2").hide();
$("#content-area-3").hide();
$("#content-area-4").hide();
$("#content-area-5").hide();

//Loop through all buttons and add "click" event to each of them
//and also the logic: hide all content sections and show only the according
//highlight background the clicked button
$(".btn-demo-area button").on("click", function () {
    //Set all buttons background to white
    $(".btn-demo-area button").css("background-color", "white");

    //Set the clicked button background to "orange" color
    $(this).css("background-color", "orange");

    //Hide all the content areas
    //$(".content-demo-area div").hide();
    $("#content-area-1").hide();
    $("#content-area-2").hide();
    $("#content-area-3").hide();
    $("#content-area-4").hide();
    $("#content-area-5").hide();

    //Show only the content area matching to the clicked button
    //$(".content-demo-area div").eq($(this).index()).show(1000);
    //$("#content-area-5").eq($(this).index()).show(1000);
});

$("#content-btn-1").on("click", function () {
    $("#content-area-1").show(1000);
})

$("#content-btn-2").on("click", function () {
    $("#content-area-2").show(1000);
})

$("#content-btn-3").on("click", function () {
    $("#content-area-3").show(1000);
})

$("#content-btn-4").on("click", function () {
    $("#content-area-4").show(1000);
})

$("#content-btn-5").on("click", function () {
    $("#content-area-5").show(1000);
})

//------------------------------------------------------------------------------------------------------
//Geolocation
//------------------------------------------------------------------------------------------------------
let x = document.getElementById("geoLocation");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}
//------------------------------------------------------------------------------------------------------
//Interactive Map
//------------------------------------------------------------------------------------------------------
$('svg path').each(function(index, item) {
	var id = $(item).attr('id');
	$('svg #' + id).on('click', function(e) {
		var id = $(e.currentTarget).attr('id');
		$('svg path').removeClass('active');
		$(e.currentTarget).addClass('active');
		window.alert(id + ' Clicked');
	});
});


//------------------------------------------------------------------------------------------------------
//JQUERY: FAQ Function
//------------------------------------------------------------------------------------------------------
let proxy = 'https://cors-anywhere.herokuapp.com/' ;
let json_url = "http://danieldangs.com/itwd6408/json/faqs.json";
//Use Jquery method to load Json file
$.getJSON(
	proxy + json_url, function(data) {//Get json file and assign it to "data"
		//Loop through all the questions and extract its question & answer
		console.log(data);
		$.each(data, function(i, question) {//i: index, question: object
			//Extract question and answer display on webpage
			let node = '<div class="col-12 col-md-6 p-2">' +
				'<div class="bg-warning h-100 p-2">' +
					'<h4>' + question.question + '</h4>' +
					'<p>' + question.answer + '</p>' +
				'<div>' +
			'</div>';
			$('#questions').append(node)
		});
	}
);
//Filter or search function
$("#search-box").on("keyup", function() {
	//Get entered keywords
	let keywords = $(this).val().toLowerCase();
	//Loop through all questions (wrapped in <div> element inside "questions" section),
	// find all question/answer containing keywords
	$("#questions div").filter(function() {
		//Keep displaying all element containing the keyword
		$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1); //indexOf(keywords) returns "-1"
																			//if not containing the keyword
	});
});

//Use JQuery to manipulate CSS style
$('h2').css({
  'background-color': 'gray',
  'text-align': 'center',
  'border': 'solid 2px green',
  'padding': '20px',
  'color': 'red'
});
//------------------------------------------------------------------------------------------------------
//Load JSON File stored on web server at http://danieldangs.com/itwd6408/json/faqs.json
