// OMDB API http://www.omdbapi.com/?t=???&plot=full&apikey=1d96ca81;
// GIPHY https://api.giphy.com/v1/gifs/search?api_key=PorPxXd5WaUPFvGd2oLlj4n8kI1EbG99&q=???&limit=25&offset=0&rating=g&lang=en
// TasteDive API provides related content https://tastedive.com/api/similar?q=parks+and+recreation&info=1&limit=4&k=400006-fanPagr-OP0T5H8C
// TVMaze API for images of actors:  http://api.tvmaze.com/search/people?q=???


$(document).ready( function () {
    // Materialize method to auto-init all JavaScript functionality
    M.AutoInit();

    $("#add-media").on("click", function (event) {
        event.preventDefault();
        
        var title = $("#media-input").val().trim().split(" ").join("+");
      
        // $("#landing-page").style.display = "none";
        // $("#searched").style.display = "block";
        
        // // Materialize functionality for dropdowns
        // $(".dropdown-trigger").dropdown();
        // // To move the navbar to the side on mobile:  
        // $('.sidenav').sidenav();
        
        // OMDB
        $.ajax ({
            url: "http://www.omdbapi.com/?t=" + title + "&plot=full&apikey=1d96ca81",
            method: "GET",
            dataType: "jsonp"
        })
            .done( function(response) {
                console.log("OMDB", response);
                console.log("------------------------");
        
                var imagePoster = $("<img>").attr("src", response.Poster).addClass("responsive-img")
                    genre = response.Genre
                    actors = response.Actors;
        
                console.log(actors);
        
                $("#sidebar").prepend(imagePoster);
                $(".media-title").text(response.Title + " (" + response.Year + ")");
                $(".synopsis").text(response.Plot);
            });
    
        // GIPHY
        $.ajax ({
            url: "https://api.giphy.com/v1/gifs/search?api_key=PorPxXd5WaUPFvGd2oLlj4n8kI1EbG99&q=" + title + "&limit=5&offset=0&rating=g&lang=en",
            method:"GET"
        })
            .done( function(response) {
                console.log("GIPHY", response);
                console.log("------------------------");

                for (var i = 0; i < response.data.length; i++) {

                var gifURL = $("<img>").attr("src", response.data[i].images.fixed_height.url).addClass("responsive-img");

                $("#sidebar").append(gifURL);

                }

            });
    
    
        // TasteDive
        
        $.ajax ({
            url: "https://tastedive.com/api/similar?q=" + title+ "&info=1&limit=4&k=400006-fanPagr-OP0T5H8C",
            method: "GET",
            dataType: "jsonp"
        })
            .done( function(response) {
                console.log("TasteDive", response);
                console.log("------------------------");

                var relatedContent = response.Similar.Results;
                console.log(relatedContent);

                for (i=0;i<relatedContent.length;i++) {
                    var newRelated = $(`<div class="col s12 m6"><div class="card"><div class="card-content"><p>${relatedContent[i].Name}</p><p><a href="${relatedContent[i].wUrl}" target="_blank">Go to Wikipedia for more info</a></p><p>${relatedContent[i].wTeaser}</p></div></div></div>`);
                    $(".related").append(newRelated)
                };
                
                

            })
    })

    $(".cssClass").on("click", function (event) {

        event.preventDefault();

        var newTheme = $(this).attr("id")

        $("#csstheme").attr("href", "./assets/" + newTheme + ".css")

    });
    
    

})    