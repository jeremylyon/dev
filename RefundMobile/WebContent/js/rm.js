/* Where's My Refund mobile 
 * 
 * rm.js
 * 
 * By: Jeremy Lyon, Greg White
 * 
 * Version 1.0 
 * September 20th, 2013
 * 
 *  
 * */



// On-load for page named splash

	function clearFormContents(){
		
		 $('#results').empty();
		 $("#wmrFormElement")[0].reset();
			// Set Filing Status drop down to disabled until a well formed SSN is entered
			$('select').selectmenu('disable');	
			// Set expected refund text box to disabled until a well formed SSN is entered
			$('#er').attr("disabled", "disabled");
			// Disable submit button until required form elements are ready
			$('#submit').button('disable'); 
		 $("#formElements").parent().show();		 
		 
		 //Fix Sticky button
		 $(".clearFormContents").removeClass( $.mobile.activeBtnClass ); 
	}

$(document).on("pageinit","#splash" ,function(){	


});		


//On-load for page named wmrForm
$(document).on("pageinit","#wmrForm" ,function(){	
	
			
	// Prepare loader icon
	$( document ).bind( 'mobileinit', function(){
		  $.mobile.loader.prototype.options.text = "loading";
		  $.mobile.loader.prototype.options.textVisible = false;
		  $.mobile.loader.prototype.options.theme = "a";
		  $.mobile.loader.prototype.options.html = "";
		});
  
	
	// Set Filing Status drop down to disabled until a well formed SSN is entered
	$('select').selectmenu('disable');	
	// Set expected refund text box to disabled until a well formed SSN is entered
	$('#er').attr("disabled", "disabled");
	// Disable submit button until required form elements are ready
	$('#submit').button('disable'); 		
	

	// Check SSN on key-up to determine length
	$(".formSSN").keyup(function(e) {						
			
		
		if (($("input#ssn").val().length)==9){
			
			// Enable expected return element when SSN is well formed
			enableFilingStatus();	
			$("#er").removeAttr("disabled");			
			
		}
		// If SSN element is not well formed ensure that select menu remains disabled
		else {
			$('select').selectmenu('disable');
		}
		
		
		
	});
	
	// Check Expected Refund on keyup to determine length
	$(".formER").keyup(function(e) {		
		
	
		
		//if ER is well formed enable the submit button and the select menu
		if (($("input#er").val().length)>=1){			
			$('#submit').button('enable'); 		
			$('select').selectmenu('enable');
		}
		// If SSN element is not well formed ensure that select menu and submit button remains disabled
		else {
			$('select').selectmenu('disable');
			$('#submit').button('disable'); 	
		}
		
		
		
	});
	
	// Convert valid key array into object 
	function oc(a) {
	  var o = {};
	  for(var i=0;i<a.length;i++)
	  {
	    o[a[i]]='';
	  }
	  return o;
	}	
	
	// Enable filing status menu function
	function enableFilingStatus(){
		$('select').selectmenu('enable');	
	}		
	
	// Evaluate number fields for invalid characters, delete invalid characters on key-up
	$(".formNumber").keydown(function(e) {		
		
		
		
		var validNumericKeys = new Array(48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110);
		var validFunctionKeys = new Array(0,8,9,37,39,46);
		
		var code = (e.keyCode ? e.keyCode
				: e.which);

		if ((code in oc(validFunctionKeys)
				|| code in oc(validNumericKeys)
				|| code == 189 || code == 109 || (code == 86 && e.ctrlKey == true))
				&& e.shiftKey == false) {		
			
			return true;
		} else {
			return false;
		}
		}).change("blur",function() {$(this).val($(this).val().replace(/[^0-9]/g, ""));	
	
		});	
	
	// JSONP AJAX web service call function w/ callback
	function CallService(ssn,fs,er, callbackF){
				
		// Set REST Service location
		//var webServiceURL = 'http://d-36312.dor.local:9080/MobileRefund/rest/status';
		var webServiceURL = 'http://revenue3.dor.local:10073/MobileRefund/rest/status';			

		// Set input parameter variables
		var data = {ssn:ssn,fs:fs,er:er};	   
		
		// AJAX call
		$.ajax({
	        url: webServiceURL, 
	        type: "GET",
	        dataType: "jsonp", 
	        timeout: 5000,
	        data: data,   
	        crossDomain: true,	  
	        jsonpCallback: callbackF,
	        success: OnSuccess, 
	        error: OnError
	    });			
		
		return false;
	}
	
	
	// Display refund status message on success
	function OnSuccess(data, status){		
		
		// Set default status image and banner text
		var statusImage = "nf.png";
		var statusBannerText = "STATUS: NOT FOUND";
		
		// Cast data.message to string
		var str = data.message;		
		
		// Change status image and banner text based on message code
		// Message code is first character of message string
		if (str.substring(0,1) == "1") {
			var statusImage = "nf.png";
			var statusBannerText = "STATUS: NOT FOUND";			
			}
	    if (str.substring(0,1) == "2") {
			var statusImage = "pr.png";
			var statusBannerText = "STATUS: PROCESSING";
	    	} 
	    if (str.substring(0,1) == "3") {
			var statusImage = "pr.png";
			var statusBannerText = "STATUS: PROCESSING";
	    	} 
        if (str.substring(0,1) == "4") {
			var statusImage = "pr.png";
			var statusBannerText = "STATUS: COMPLETE";
        	} 		
		
		// Hide all form elements on wmrForm page and make room for return status message
	    $("#formElements").parent().hide();	  
	    
	    // Append status image, status banner text and return status message to DIV
	    $('#results').append("<div data-role='content' class='resultsOuterPanel'>" +
	    		"<div id='results' data-role='content' class='resultsInnerPanel'>" +
	    		"<img src='images/"+statusImage+"' class='statusImage' />" +
	    		"<p class='statusBannerText'>"+statusBannerText+"</p>" +
	    		"<p id='refundResultsMessage'><br /><br />" +str.substring(1,(str.length)) + "</p>" +
	    		"</div>" +
	    		"</div>" );	   
	    
	    // Hide the loader icon
	    $.mobile.loading('hide');    
		}

	// Exception handling for bad AJAX call. 
	function OnError(jqXHR, exception) { 
	    console.log("ajax error");		
	    console.log(jqXHR);
	    console.log(exception);	    
	    
            if (jqXHR.status === 0) {
            	document.location.href="#error";
            } else if (jqXHR.status == 404) {
            	document.location.href="#error";
            } else if (jqXHR.status == 500) {
            	document.location.href="#error";
            }
            if (exception === 'parsererror') {
            	document.location.href="#error";
            } else if (exception === 'timeout') {
            	document.location.href="#error";
            } else if (exception === 'abort') {
            	document.location.href="#error";
            } else {
            	document.location.href="#error";
            }
	}
	
	// Listener for submit button event	
	$(".getStatusButton").click(function(){				
		
		var ssn = $("#ssn").val();
		var fs = $("#fs").val();
		var er = $("#er").val();	
		
    	// Turn on loader icon
 		$.mobile.loading( 'show', {
 			text: '',
 			textVisible: true,
 			theme: 'z',
 			html: ""
 		});
 		
 		// Call the AJAX service
		
		CallService(ssn,fs,er,"getReturnStatusMessage");	
		
		
	});

	// Listener for clear/reset form page
	$(".clearFormContents").click(function() {		
	
		clearFormContents();
		
	});	
	
	
	
	
});

//On-load for page named error
$(document).on("pageinit","#error" ,function(){	
	

	clearFormContents();
		
	
});	




