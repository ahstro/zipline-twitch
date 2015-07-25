// Twitch url and streams to fetch data about
var streams = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "comster404", "brunofin", "thomasballinger", "noobs2ninjas", "beohoff", "medrybw"],
    twitchUrl = "https://api.twitch.tv/kraken/";

// Creates an array with all future ajax calls
var ajaxArr = streams.map(function(stream) {
    return $.ajax({
        url: twitchUrl + "channels/" + stream,
        dataType: "jsonp",
        success: function() {
            $(".loading").append(".");
        }
    });
}).concat(streams.map(function(stream) {
    return $.ajax({
        url: twitchUrl + "streams/" + stream,
        dataType: "jsonp",
        success: function() {
            $('.loading').append(".");
        }
    });
}));

// Wait for document to load until document dependent code is run.
$(document).ready(function() {

    $('main').empty().append("<div class='loading'>Loading</div>");

    // Runs all ajax calls and calls the callback with their results as arguments
    $.when.apply($, ajaxArr).done(function() {

        // Create array from arguments
        args = Array.prototype.slice.call(arguments);

        // Remove loading message
        $('main').empty();

        // Create an array with appropriate HTML for every stream
        args.forEach(function(stream) {
            // Return if ajax request was unsuccessfull or 
            // if it's not a channel request (i.e. if it's a stream request)
            if(stream[1] !== "success" || stream[0].display_name === undefined) {
                return false;
            }

            // Get stream information
            profilePicture = stream[0].logo ? stream[0].logo : "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";
            displayName = stream[0].display_name;
            channelUrl = stream[0].url;
            info = stream[0].status ? stream[0].status : "No information available";
            id = displayName.toLowerCase();

            // Loop through ajax responses...
            args.forEach(function(stream) {
                // ...and find the one related to this stream
                if(stream[1] === "success" && stream[0].display_name === undefined) {
                    var streamSplit = stream[0]._links.channel.split('/');
                    if(id === streamSplit[streamSplit.length - 1]) {

                        // Check the online status of the stream and set variables accordingly
                        if(stream[0].stream) {
                            displayName = "<span class='onlineColor'>&bull;</span> " + displayName;
                            info = "<span class='info onlineColor'>" + info + "</span>";
                            onlineStatus = "online";
                        } else {
                            info = "";
                            onlineStatus = "offline";
                        }
                    }
                }
            });

            // Render current stream on screen
            $('main').append("<a href='" + channelUrl + "' class='" + onlineStatus + "' id='" + id + "'><div class='streamer'><img class='streamerPicture' src='" + profilePicture + "'>" + displayName + info + "</div></a>");

        });

    });

    // Add button functionality
    //
    // Bugish: If #offline is clicked before rendering all .online elements
    // the .online elements will be renered on with #offline active.
    // Can be prevented by not allowing these to be called until
    // all ajax and rendering functions are finished.
    $('#all').click(function() {
        $('.online').removeClass('hidden');
        $('.offline').removeClass('hidden');
        $('#all').addClass('active');
        $('#online').removeClass('active');
        $('#offline').removeClass('active');
    });

    $('#online').click(function() {
        $('.online').removeClass('hidden');
        $('.offline').addClass('hidden');
        $('#all').removeClass('active');
        $('#online').addClass('active');
        $('#offline').removeClass('active');
    });

    $('#offline').click(function() {
        $('.online').addClass('hidden');
        $('.offline').removeClass('hidden');
        $('#all').removeClass('active');
        $('#online').removeClass('active');
        $('#offline').addClass('active');
    });


    // Search functionality
    $('input[name=search]').keyup(function() {
        var children = Array.prototype.slice.call($('main').children());
        children.forEach(function(foo) {
            if(foo.id.match(new RegExp($('input[name=search]').val(), 'ig'))) {
                $('#' + foo.id).show();
            } else {
                $('#' + foo.id).hide();
            }
        });
    });

    // Prevent reloading on 'Enter' in search field
    $('input[name=search]').keypress(function(event) {
        if(event.keyCode === 10 || event.keyCode === 13) {
            event.preventDefault();
        }
    });

});
