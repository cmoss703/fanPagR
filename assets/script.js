$(document).ready(function () {
    // Materialize method to auto-init all Materialize.js functionality:
    M.AutoInit();

    // On page-load, hide HTML skeleton.
    $("#searched").hide();

    // Function to display saved titles in our navbars:
    function savetoNav() {
    
        for (var i = 0; i < localStorage.length; i++) {
            $("#dropdown2").append(`<li><a href="#!" class="savedTitle">${localStorage.key(i)}</a></li>`);
            $("#dropdown4").append(`<li><a href="#!" class="savedTitle">${localStorage.key(i)}</a></li>`)
        }};
    // called on page-load.
    savetoNav();

    var queryTitle;

    // Function for API calls:
    function addMedia(queryTitle) {
        // First, clear all media content on the current page...
        $(".media").html("");
        // ...reveal our HTML skeleton...
        $("#searched").show();
        // ...and hide the landing page.
        $("#landing-page").hide();

        // Then, make OMDB API call...
        $.ajax({
            url: "https://www.omdbapi.com/?t=" + queryTitle + "&plot=full&apikey=1d96ca81",
            method: "GET",
        })
            .done(function (response) {
                // console.log(response);
                // Modal for bad user input
                if (response["Response"] === "False") {
                    $("#modal").modal('open');
                }
                // But if the user inputs a valid TV show or movie in the OMDB...
                var imagePoster = $("<img>").attr("src", response.Poster).attr("class", "responsive-img");
                // ...display the title, year, and plot, per OMDB...
                $("#sidebar").prepend(imagePoster);
                $(".media-title").text(response.Title);
                $(".media-year").text(" (" + response.Year + ")");
                $(".synopsis").text(response.Plot);

                // ...grab the star actors from the response
                var actors = response.Actors.split(",");

                // ...and then run the OMDB actors through the TVMaze API.
                for (let i = 0; i < actors.length; i++) {
                    $.ajax({
                        url: "https://api.tvmaze.com/search/people?q=" + actors[i].split(" ").join("+"),
                        method: "GET",
                    })
                        .done(function (response) {
                            // Create Actors content...
                            var actorLink = $("<a>").attr("href", response[0].person.url).attr("title", "Go to this actor's TVMaze profile").attr("target", "_blank");
                            var newActorCards =
                                    (`
                                    <div class="card hoverable col l6 s12">
                                    <div class="card-image">
                                        <img class="actorPhoto" src="${response[0].person.image["original"]}">
                                        <span class="card-title titleBar white-text">${response[0].person.name}</span>
                                        </div>  
                                        </div>
                                `);
                            // ...and display it.
                            $(".actors").append(actorLink.append(newActorCards).addClass("responsive-img"));


                        });
                }
            });

        // Then run the title search through the GIPHY API, expecting 15 results:
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?api_key=PorPxXd5WaUPFvGd2oLlj4n8kI1EbG99&q=" + queryTitle + "&limit=15&offset=0&rating=g&lang=en",
            method: "GET"
        })  
            .done(function (response) {
                // Generate a header for our aside,
                var gifHeader = $("<h5>").text("GIFs from this title").addClass("gif-header");
                // and append it to the aside.
                $("#sidebar").append(gifHeader);
                // then append GIFs from GIPHY to the aside.
                for (var i = 0; i < response.data.length; i++) {
                    var gifURL = $("<img>").attr("src", response.data[i].images.fixed_height.url).addClass("responsive-img");
                    $("#sidebar").append(gifURL);
                }
            });
        // Then run the same title through the TasteDive API.
        $.ajax({
            url: "https://tastedive.com/api/similar?q=" + queryTitle + "&info=1&limit=4&k=400006-fanPagr-OP0T5H8C",
            method: "GET",
            dataType: "jsonp"
        })
            .done(function (response) {
                // Grab TasteDive's recommend related titles...
                var relatedContent = response.Similar.Results;
                // ...and generate dynamic Materialize cards for each related title: Title, plot, Wikipedia link, and embedded YouTube clip.
                for (i = 0; i < relatedContent.length; i++) {
                    var newRelated = $(`

                <div class="card hoverable">
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
                      <span class="card-title titleBar white-text">${relatedContent[i].Name}<i class="material-icons right">close</i></span>
                      <p class="grey-text">${relatedContent[i].wTeaser}</p>
                    </div>
                </div>
        
                    `);
    
                    $(".related").append(newRelated);
                }

            })

    };

    // Function for displaying a saved fan page:
    function dropdownTitle(title) {
        queryTitle = title.trim().split(" ").join("+");
        var titleObject = localStorage.getItem(title);
        var newTheme = JSON.parse(titleObject).theme;
        addMedia(queryTitle);
        $("#csstheme").attr("href", newTheme)
    }

    // When the modal for bad user input is closed, reload the page to begin a new search.
    $(".modal-close").on("click", function() {
        location.reload();
    });

    // When the search button is clicked:
    $("#add-media").on("click", function (event) {
        event.preventDefault();
        queryTitle = $("#media-input").val().trim().split(" ").join("+");
        addMedia(queryTitle);
    });

    // When the New Search button is clicked, go back to our landing page.
    $(".newSearch").on("click", function () {
        location.reload();
    });  

    // When a theme button is clicked:
    $(".cssClass").on("click", function (event) {
        event.preventDefault();
        // Grab the button's id, corresponding the CSS file of the same name,
        var newTheme = $(this).attr("id")
        // and change the CSS source of the page to the corresponding CSS file.
        $("#csstheme").attr("href", "./assets/" + newTheme + ".css")

    });

    // When the floating save button is clicked:
    $("#saveButton").on("click", function (event) {
        event.preventDefault();
        // Create an object for localStorage to save, including the current title and page theme,
        var title = $(".media-title").text();
        var theme = $("#csstheme").attr("href");
        var titleObject = {'title': title, 'theme': theme};
        // and check if the user has already saved the current title.
        if (localStorage.getItem(title) === null){
            M.toast({html: "Fan page saved!"});
            localStorage.setItem(title , JSON.stringify(titleObject));
        } else if (localStorage.getItem(title) !== null) {
            M.toast({html: "You already saved this fan page!"});
        };
        // console.log(localStorage.getItem(title));
        $("#dropdown2").html('');
        $("#dropdown4").html('');
        // Then, display updated Saved Titles dropdowns.
        savetoNav(); 
    });
    
    // When a saved title in either desktop or mobile navbar is clicked:
    $("#dropdown2").on("click", "li", function (event) {
        event.preventDefault();
        var title = $(this).text();
        dropdownTitle(title);
    });
    $("#dropdown4").on("click", "li", function (event) {
        event.preventDefault();
        var title = $(this).text();
        dropdownTheme(title);
    });
    
})    