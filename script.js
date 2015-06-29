var streams = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff","medrybw"],
    twitch_url = "https://api.twitch.tv/kraken/";

// Create an array with all future ajax calls
var ajaxArr = streams.map(function(stream) {
    return $.ajax({
        url: twitch_url + "channels/" + stream,
        dataType: "jsonp"
    });
}).concat(streams.map(function(stream) {
    return $.ajax({
        url: twitch_url + "streams/" + stream,
        dataType: "jsonp"
    });
}));

// Runs all ajax calls and calls the callback with their results as arguments
$.when.apply($, ajaxArr).done(function() {

    // Create array from arguments
    args = Array.prototype.slice.call(arguments);

    // Remove loading spinner
    $('main').empty();

    // Create an array with appropriate HTML for every stream
    args.forEach(function(stream) {
        // Return ajax request was unsuccessfull or 
        // if it's not a channel request (i.e. if it's a stream request)
        if(stream[1] !== "success" || stream[0].display_name === undefined) {
            return false;
        }

        // Get stream information
        profilePicture = stream[0].logo ? stream[0].logo : "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";
        displayName = stream[0].display_name;
        id = displayName.toLowerCase();
        channelUrl = stream[0].url;
        info = stream[0].status ? stream[0].status : "No information available";

        // Loop through ajax responses...
        args.forEach(function(stream) {
            // ...and find the one related to this `stream`
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
        $('main').append("<a href='" + channelUrl + "' class='" + onlineStatus + "' id='" + id + "'><div class='streamer'><div class='streamerName'><img class='streamerPicture' src='" + profilePicture + "'>" + displayName + "</div>" + info + "</div></a>");

    });

});

// Add button functionality when the document has loaded
$(document).ready(function() {
    // If #offline is clicked before rendering all .online elements
    // the .online elements will be renered on with #offline active.
    // Can be prevented by not allowing these to be called until
    // all ajax and rendering functions are finished.
    $('#all').click(function() {
        $('.online').removeClass('hidden');
        $('.offline').removeClass('hidden');
        $('#all>li').addClass('active');
        $('#online>li').removeClass('active');
        $('#offline>li').removeClass('active');
    });

    $('#online>li').click(function() {
        $('.online').removeClass('hidden');
        $('.offline').addClass('hidden');
        $('#all>li').removeClass('active');
        $('#online>li').addClass('active');
        $('#offline>li').removeClass('active');
    });

    $('#offline>li').click(function() {
        $('.online').addClass('hidden');
        $('.offline').removeClass('hidden');
        $('#all>li').removeClass('active');
        $('#online>li').removeClass('active');
        $('#offline>li').addClass('active');
    });


    $('input[name=search]').keyup(function() {
        // TODO: Put slice() call outside function
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
