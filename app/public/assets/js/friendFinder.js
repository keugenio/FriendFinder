document.addEventListener("DOMContentLoaded", function(){
      $( function() {
        $(".slider").slider({
          value:-1,
          min: 0,
          max: 5,
          step: 1,
          slide: function( event, ui ) {
          var question = this.getAttribute("data-question");
          var title = this.getAttribute("data-title");        
            $( "#"+question ).val( ui.value );
            $("#"+title).text("Answered")
          }      
        });
        $( "#accordion" ).accordion();  
      } );

      // auto populates fields for testing
      $("#name").val("bobo");
      $("#photo").attr("placeholder", "http://cdn.newsapi.com.au/image/v1/85b6f99a1f31a83bfc4af6c71501948d");
      $("#photo").attr("value", "http://cdn.newsapi.com.au/image/v1/85b6f99a1f31a83bfc4af6c71501948d");      
      $("#photoImage").attr("src", $("#photo").attr("placeholder"));
      $('input.slider-input').each(function() {
        $(this).val(Math.round(Math.random()*4+1));
        $("#"+this.getAttribute("data-slider")).val($(this).val());
      });

      var unAnswered = ""; // to hold unanswered questions



    // Capture the form inputs 
    $("#submit").on("click", function(event){
      event.preventDefault();

      // If all required fields are filled
      if (validateForm() == true){   
          var scores=[];  

          // for each slider input value, push value into scores array       
          $('.slider-input').each(function() {
            scores.push(parseInt($(this).val().trim()));
          });     

          // Create an object for the user's data
          var newFriend = {
            name: $("#name").val().trim(),
            photo: $("#photo").val().trim(),
            scores:scores
          };

          // console.log("before:" + JSON.stringify(newFriend));

          // AJAX post the data to the API. open modal with best match info
          $.post("/api/friends", newFriend, function(data) {          

            // API returns best match's name and photo to be displayed.
            $("#myBFFname").text(data.name);
            $('#myBFFimage').attr("src", data.photo);

            // Show the modal with the best match 
            $("#resultsModal").modal();
            clearValues();
          });
      }
      else
      {
        swal("Please fill out all fields before submitting!", unAnswered + " not answered yet.", "error");
      }
        
        return false;
  });

  $("#photo").change(function(){
      $("#photoImage").attr("src",$("#photo").val());
  });    



  // Form validation
  function validateForm() {
        var isValid = true;
        // check if name and email is entered
        $('.form-control').each(function() {
          if ( this.value === '' ){
              isValid = false;
              unAnswered += this.getAttribute("id") + " ";
            }
        });


        // check that each input slider value is not empty, 
        $('.slider-input').each(function() {

          if( this.value === ""){
            unAnswered += this.getAttribute("id") + " ";
            isValid = false;
          }
        })

        return isValid;
  }
  function clearValues(){
        $('.form-control').each(function() {
          this.value = '';
        });  
        $("#photoImage").src =="";
        $('.slider-input').each(function() {
          this.value = '';
        });

  }
});