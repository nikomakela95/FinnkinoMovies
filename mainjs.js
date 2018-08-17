
	window.onload = function () { // Do this when window loads
		var xmlhttp = new XMLHttpRequest(); // New XMLHttpRequest
		xmlhttp.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/",true);
		xmlhttp.send();

		xmlhttp.onreadystatechange=function() {		

			if(xmlhttp.readyState==4 && xmlhttp.status==200){
				var xmlDoc = xmlhttp.responseXML; 
				//var allquotes = xmlDoc.getElementsByTagName("TheatreArea");
				var allquotes = xmlDoc.getElementsByTagName("Name");
				var id = xmlDoc.getElementsByTagName("ID");
				var select = document.getElementById("city");
				
				for (var i = 0; i < allquotes.length; i++) {
					var option = document.createElement('option');
       				 option.text =  allquotes[i].innerHTML;
       				 option.value = id[i].innerHTML;
        			 select.add(option);
				}
			}
		}

		var dates = document.getElementById("date"); // Find pulldown menu for dates

		var d = new Date(); // New date object
      	
		// Create 10 list elements (dates)
      	for (var i = 0; i < 10; i++) {
      		//If day is 10 or higher
      		if((d.getDate() + i) >= 10 ){
      			var datestring = (d.getDate() +i) + ".0" +(d.getMonth()+1)  + "." + d.getFullYear();
      			// if day is under 10, add 0
      		}else{
      			datestring = "0" +(d.getDate() +i) + ".0" +(d.getMonth()+1)  + "." + d.getFullYear()
      		}
      		var option = document.createElement('option'); // Create option to menu
       			option.text = option.value = datestring;
        		dates.add(option); // Add dates to menu 
      	}

};




			
	// Function for changing the showed movies
	function changeCity() {
		// Parts of the url
		var api = 'https://www.finnkino.fi/xml/Schedule/?area=';
		var theatre = document.getElementById("city").value;
		var date = document.getElementById("date").value;
		var url = api + theatre + "&" + "dt=" + date;

		var xmlhttp = new XMLHttpRequest(); // New XMLHttpRequest
		xmlhttp.open("GET", url, true);
		xmlhttp.send(); // Send the request with above arguments
		console.log(url);

		// EventHandler that is called when the readyState attribute changes
		xmlhttp.onreadystatechange=function() {		

			//When readyState is 4 and status is 200, the response is ready
			if(xmlhttp.readyState==4 && xmlhttp.status==200){
				var xmlDoc = xmlhttp.responseXML; //Save response to a variable
				var shows = xmlDoc.getElementsByTagName("Show"); // Find all "Show" tags in the xml document
				var table = "<table>"; // Start creating the table for movies 
				table += '<th>' + "" + '</th>';
				table += '<th>' + "Movie" + '</th>';
				table += '<th>' +  "Theatre" + '</th>';
				table += '<th>' + "Time" + '</th>';

			// Loop through xml document and find title, theater, images and starting time for the movies
			for (var i = 0; i < shows.length; i++){	
				var showName = shows[i].getElementsByTagName("OriginalTitle")[0].innerHTML;
				var movieTheatre = shows[i].getElementsByTagName("Theatre")[0].innerHTML;
				var image = shows[i].getElementsByTagName("Images")[0].getElementsByTagName("EventLargeImagePortrait")[0].innerHTML;
				var startTime = shows[i].getElementsByTagName("dttmShowStart")[0].innerHTML;
				var date = new Date(startTime).toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"});
				
				//Place movie details to table
				table += '<tr>';
				table += '<td>' +  "<img src=" + image  + ">" + '</td>';
				table += '<td>' +  showName +  '</td>';
				table += '<td>' +  movieTheatre +  '</td>';
				table += '<td>' +  date +  '</td>';
				table += '</tr>';
				
				document.getElementById("table").innerHTML = table; // Show the created table

				}
			}
		}
	};

			

	$(document).ready(function(){
		$('#search').keydown(function(){

  			$('#result').html('');
  			var searchField = $('#search').val();
  			var expression = new RegExp(searchField, "i");

			$.ajax({

    			type: "GET",
    			url: "https://www.finnkino.fi/xml/Events/",
    			dataType: "xml",
    			success: function(xml){
    				var title = xml.getElementsByTagName("OriginalTitle");
    				$.each(title, function(index, value){

    					if (value.innerHTML.search(expression) != -1){
    						if(searchField != ""){ 
    							$('#result').append('<li class="list-group-item link-class"> '+value.innerHTML+' </li>');
					}
    			} 
  			});
   		}   
  	});

});
 	$('#result').on('click', 'li', function(e) {

 		$.ajax({
    	type: "GET",
    	url: "https://www.finnkino.fi/xml/Events/",
   	 	dataType: "xml",
   	 	success: function(xml){

    		var events = xml.getElementsByTagName("Event");
    		var text = $(e.target).html();
    		console.log(text);
			//document.getElementById("table").innerHTML = text;
			var i;
			var synopsis;
			var teksti =" ";
    		for (i = 0; i < events.length; i++){

    	   		var titles = events[i].getElementsByTagName("OriginalTitle")[0].innerHTML;
    	   		synopsis = events[i].getElementsByTagName("ShortSynopsis")[0].innerHTML;
    	   		console.log(synopsis);
    	   		//var synopsis = events[j].getElementsByTagName("ID")[0].innerHTML;
    	   		//var synopsis = titles.getElementsByTagName("ShortSynopsis")[0].innerHTML;

    			if (titles = text) {
    				//synopsis = events[i].getElementsByTagName("ShortSynopsis")[0];
    				teksti += titles + "<br>" + synopsis;
    				break;
    				
    				//var synopsis = titles.getElementsByTagName("ShortSynopsis")[0].innerHTML;
    				
    			}
    			document.getElementById("table").innerHTML = teksti;
    		}
    		
    	
  
  			var click_text = $(this).text().split('|');
  			$('#search').val('');
  			$("#result").html('');

			}
 		});
 	});
 });

		