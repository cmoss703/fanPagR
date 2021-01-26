// OMDB API http://www.omdbapi.com/?t=???&plot=full&apikey=1d96ca81;
// GIPHY https://api.giphy.com/v1/gifs/search?api_key=PorPxXd5WaUPFvGd2oLlj4n8kI1EbG99&q=???&limit=25&offset=0&rating=g&lang=en
// TasteDive API provides related content https://tastedive.com/api/similar?q=parks+and+recreation&info=1&limit=4&k=400006-fanPagr-OP0T5H8C
// TVMaze API for images of actors:  http://api.tvmaze.com/search/people?q=???


$(document).ready(function () {
    // Materialize method to auto-init all JavaScript functionality
    M.AutoInit();

    for (var i = 0; i < localStorage.length; i++) {
        $("#dropdown2").append(`<li><a href="#!" class="savedTitle">${localStorage.getItem(localStorage.key(i))}</a></li>`);
        $("#dropdown4").append(`<li><a href="#!" class="savedTitle">${localStorage.getItem(localStorage.key(i))}</a></li>`)
    }

    $("#searched").hide();

    $("#add-media").on("click", function (event) {
        event.preventDefault();
        $(".media").html("");
        $("#searched").show();
        $("#landing-page").hide();

        var queryTitle = $("#media-input").val().trim().split(" ").join("+");

        // OMDB
        $.ajax({
            url: "http://www.omdbapi.com/?t=" + queryTitle + "&plot=full&apikey=1d96ca81",
            method: "GET",
            dataType: "jsonp"
        })
            .done(function (response) {

                var imagePoster = $("<img>").attr("src", response.Poster).attr("class", "responsive-img");
                genre = response.Genre;
                actors = response.Actors.split(",");



                $("#sidebar").prepend(imagePoster);
                $(".media-title").text(response.Title);
                $(".media-year").text(" (" + response.Year + ")");
                $(".synopsis").text(response.Plot);

                // TVMaze
                for (let i = 0; i < actors.length; i++) {
                    $.ajax({
                        url: "http://api.tvmaze.com/search/people?q=" + actors[i].split(" ").join("+"),
                        method: "GET",
                    })
                        .done(function (response) {

                            var newActorCards =
                                    (`
                                    <div class="card blue-grey darken-4 col l6 s12">
                                    <div class="card-image">
                                        <img class="actorPhoto" src="${response[0].person.image["original"]}">
                                        <span class="card-title">${response[0].person.name}</span>
                                        </div>  
                                        </div>
      
                                `);

                            $(".actors").append(newActorCards).addClass("responsive-img");

                        });
                }
            });


        // GIPHY
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?api_key=PorPxXd5WaUPFvGd2oLlj4n8kI1EbG99&q=" + queryTitle + "&limit=5&offset=0&rating=g&lang=en",
            method: "GET"
        })
            .done(function (response) {

                for (var i = 0; i < response.data.length; i++) {

                    var gifURL = $("<img>").attr("src", response.data[i].images.fixed_height.url).addClass("responsive-img");

                    $("#sidebar").append(gifURL);

                }

            });


        // TasteDive

        $.ajax({
            url: "https://tastedive.com/api/similar?q=" + queryTitle + "&info=1&limit=4&k=400006-fanPagr-OP0T5H8C",
            method: "GET",
            dataType: "jsonp"
        })
            .done(function (response) {

                var relatedContent = response.Similar.Results;

                for (i = 0; i < relatedContent.length; i++) {
                    var newRelated = $(`

                <div class="card hoverable blue-grey darken-4">
                    <div class="card-image waves-effect waves-block waves-light">
                      <div class="video-container">
                        <iframe class="activator" src="${relatedContent[i].yUrl}"></iframe>
                      </div> 
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

    $("#saveButton").on("click", function (event) {
        event.preventDefault();
        var title = $(".media-title").text();
        if (localStorage.getItem(title) === null) {
            M.toast({ html: "Fan paged saved!" });
            localStorage.setItem(title, title);
        } else if (localStorage.getItem(title) !== null) {
            M.toast({ html: "You already saved this fan page!" });
        }

    })

    $("#newSearch").on("click", function () {
        location.reload();
    })


})    