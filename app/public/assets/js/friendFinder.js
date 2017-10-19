var currentQuestionNum = 0; // used to track current question using the question modal
document.addEventListener("DOMContentLoaded", function(){

      // auto populates fields for testing
      // $("#name").val("bobo");
      $("#photo").attr("placeholder", "http://cdn.newsapi.com.au/image/v1/85b6f99a1f31a83bfc4af6c71501948d");
      $("#photo").attr("value", "http://cdn.newsapi.com.au/image/v1/85b6f99a1f31a83bfc4af6c71501948d");      
      $("#photoImage").attr("src", $("#photo").attr("placeholder"));

      $( function() {
        $(".slider").slider({
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

      // auto populate values for testing
      // $('input.slider-input').each(function() {
      //   var aRandNum = Math.floor(Math.random()*6)
      //   $(this).val(aRandNum);
      //   $("#"+this.getAttribute("data-slider")).slider("value",aRandNum);
      // });


        $( "#accordion" ).accordion();  // for slider menu system
      } );

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

  $("#btn_qq").on("click", function(event){ // quickly run through questions in modal window
      getQuestion();
      $("#questionsModal").modal();     
  });

  // update the placeholder image if entered
  $("#photo").change(function(){
      $("#photoImage").attr("src",$("#photo").val());
  });    

  // generic slider for quickly entering survey questions in modal window
  $("#questionSlider").click(function(){
    var question = "#" + this.getAttribute("data-question");
    var title = "#" + this.getAttribute("data-title");
    var slider = "#" + this.getAttribute("data-slider");   
    var currentSliderVal=$("#questionSlider").slider("value");

    // update the acutal fields on the form for the survey
    $(question).val(currentSliderVal);  
    $(slider).slider("value", currentSliderVal);
    $(title).text("Answered");

    $("#questionSliderValue").text(currentSliderVal);
  });

  // get next question of the survey when clicked
  $("#btn_next").click(function(){
    getQuestion();  
  });

  function getQuestion(){
    // AJAX get the questions from the API. use modal as gui
    if (currentQuestionNum == 10){ // reset current question if all questions already answered
      currentQuestionNum = 0;
      $("#submit").click();             
      $("#questionsModal").modal('toggle');              
    } else {
      $.get("/api/questions/"+ currentQuestionNum , function(data) { 
          var modQuest = "<p>" + data.question + "&nbsp<span id='questionSliderValue'></span></p>";
          $("#modalQuestion").empty();
          $("#modalQuestion").append(modQuest);
          $("#questionTitle").text("Question " + (currentQuestionNum+1));
          $("#questionSlider").attr("data-question", "q" + (currentQuestionNum+1));
          $("#questionSlider").attr("data-title", "title" + (currentQuestionNum+1));
          $("#questionSlider").attr("data-slider", "slider" + (currentQuestionNum+1));
          currentQuestionNum++;
      }); 
    }      
  }

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