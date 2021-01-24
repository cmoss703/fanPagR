// OMDB API http://www.omdbapi.com/?t=???&plot=full&apikey=1d96ca81;
// GIPHY https://api.giphy.com/v1/gifs/search?api_key=PorPxXd5WaUPFvGd2oLlj4n8kI1EbG99&q=???&limit=25&offset=0&rating=g&lang=en
// TasteDive API provides related content https://tastedive.com/api/similar?q=parks+and+recreation&info=1&limit=4&k=400006-fanPagr-OP0T5H8C
// TVMaze API for images of actors:  http://api.tvmaze.com/search/people?q=???


$(document).ready( function () {
    // Materialize method to auto-init all JavaScript functionality
    M.AutoInit();

    $("#searched").hide();

        // $("#landing-page").style.display = "none";
        // $("#searched").style.display = "block";

    $("#add-media").on("click", function (event) {
        event.preventDefault();
        $(".media").html("");
        $("#searched").show();

        var title = $("#media-input").val().trim().split(" ").join("+");
        
        // OMDB
        $.ajax ({
            url: "http://www.omdbapi.com/?t=" + title + "&plot=full&apikey=1d96ca81",
            method: "GET",
            dataType: "jsonp"
        })
            .done( function(response) {
    
                var imagePoster = $("<img>").attr("src", response.Poster).attr("class", "responsive-img");
                    genre = response.Genre;
                    actors = response.Actors.split(",");
        
                    
        
                $("#sidebar").prepend(imagePoster);
                $(".media-title").text(response.Title + " (" + response.Year + ")");
                $(".synopsis").text(response.Plot);

                // TVMaze
                for (let i=0; i < actors.length ; i++ ){
                    $.ajax({
                        url: "http://api.tvmaze.com/search/people?q=" + actors[i].split(" ").join("+"),
                        method: "GET",
                    })
                        .done( function (response) {
                            
                            var newActorCards = (`
                            <div class="card blue-grey darken-4">
                                
                                <span class="card-title">${response[0].person.name}</span>
                            </div>        
                            `);
                            $(".actors").append(newActorCards);
                        
                           
                        });
                }        
            });        
            
    
        // GIPHY
        $.ajax ({
            url: "https://api.giphy.com/v1/gifs/search?api_key=PorPxXd5WaUPFvGd2oLlj4n8kI1EbG99&q=" + title + "&limit=5&offset=0&rating=g&lang=en",
            method:"GET"
        })
            .done( function(response) {

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

                var relatedContent = response.Similar.Results;

                for (i=0;i<relatedContent.length;i++) {
                    var newRelated = $(`

                <div class="card blue-grey darken-4">
                    <div class="card-image waves-effect waves-block waves-light">
                      <iframe class="activator" width="100%" height="400" src="${relatedContent[i].yUrl}"></iframe>
                    </div>
                    <div class="card-content">
                      <span class="card-title activator white-text">${relatedContent[i].Name}<i class="material-icons right">more_vert</i></span>
                      <p><a href="${relatedContent[i].wUrl}" target="_blank">Go to Wikipedia for more info</a></p>
                    </div>
                    <div class="card-reveal">
                      <span class="card-title grey-text">${relatedContent[i].Name}<i class="material-icons right">close</i></span>
                      <p class="grey-text">${relatedContent[i].wTeaser}</p>
                    </div>
                </div>
        
                    `);
                    
                    $(".related").append(newRelated);
                }
                
                

            })
    });
    
    $(".cssClass").on("click", function (event) {

        event.preventDefault();

        var newTheme = $(this).attr("id")

        $("#csstheme").attr("href", "./assets/" + newTheme + ".css")

    });
    
    

})    