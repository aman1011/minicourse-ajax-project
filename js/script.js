
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $('#street').val();
    var city = $('#city').val();

    address = street + ',' + city;
    $greeting.text('So, you want to live in ' + address + ' ?');

    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '">');

    // Your NYTimes AJAX request.
    request_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?query=" + city + "&sort=newest&apikey=cd70092e341c42d1b617931f450d744d";
    $.getJSON(request_url, function(data) {
        $nytHeaderElem.text('New York Times Articles about '+ city);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + 
                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + 
                '<p>' + article.snippet + '</p></li>');
        }
    }).fail(function(e) {
        $nytHeaderElem.text('NY Times was not able to display the articles');
    });

    // The wikipedia API url.
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    wiki_url = "https://en.wiipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikicallback";
    $.ajax({
        url: wiki_url, 
        dataType:'jsonp',
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
