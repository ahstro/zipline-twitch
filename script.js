var streams = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff","medrybw"],
    twitch_url = "https://api.twitch.tv/kraken/";


$(document).ready(function() {

    streams.forEach(function(stream) {
        var profilePicture,
        onlineStatus,
        channelUrl,
        displayName,
        info;

        $.ajax({
            url: twitch_url + "channels/" + stream,
            dataType: "jsonp",
            success: function(json) {
                // Get profile picture or use default
                profilePicture = json.logo ? json.logo : "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";
                displayName = json.display_name;
                channelUrl = json.url;
                info = json.status ? json.status : "No information available";

                $.ajax({
                    url: twitch_url + "streams/" + stream,
                    dataType: "jsonp",
                    success: function(json) {
                        // Set online/offline status
                        if (json.stream) {
                            displayName = "<span class='onlineColor'>&bull;</span> " + displayName;
                            info = "<span class='info onlineColor'>Streaming: " + info + "</span>";
                            onlineStatus = "online";
                        } else {
                            info = "";
                            onlineStatus = "offline";
                        }
                        $('main').append("<a href='" + channelUrl + "' class='" + onlineStatus + "' id='" + stream + "'><div class='streamer'><div class='streamerName'><img class='streamerPicture' src='" + profilePicture + "'>" + displayName + "</div>" + info + "</div></a>");
                    }
                });
            }
        });
    });

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


    $('input[name=search]').keyup(function(key) {
        //console.log($('input[name=search]').val());
        // TODO: Put slice() call outside function
        Array.prototype.slice.call($('main').children()).forEach(function(foo) {
            if(!foo.id.match(new RegExp($('input[name=search]').val(), 'ig'))) {
                $('#' + foo.id).hide();
            } else {
                $('#' + foo.id).show();
            }
        });
    });
});
