var request = require("request");
var sendgrid = require('sendgrid')("username", "password");

var checkSites = {
    Start: function() {
        this.SearchSiteWithResponseStatusCode('http://www.restaurants-toureiffel.com/uk/eiffel-tower-restaurants/58-tour-eiffel/new-years-eve-dinner-2015.html', 404);
        this.SearchSiteForText('http://www.cometoparis.com/catalog/new-years-eve-58-tour-eiffel-2201', "will be available soon.");
        this.SearchSiteForText('http://www.restaurants-toureiffel.com/UK/EIFFEL-TOWER-RESTAURANTS/58-TOUR-EIFFEL/Lunch-Dinner-in-paris-eiffel-tower.html', "New Year");
        this.SearchSiteForText('http://www.francetourisme.fr/eiffel-tower-restaurant.html', "New Year");
        this.SearchSiteForText('http://www.francetourisme.fr/new-year-eve-in-paris/new-years-eve-eiffel-tower-dinner.html', "Price upcoming");
    },
    SearchSiteForText: function(url, searchText) {
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var containsText = body.indexOf(searchText);

                if (containsText === 0) {
                    checkSites.sendEmail(url, searchText);
                }
            }
        });
    },
    SearchSiteWithResponseStatusCode: function (url, responseCode) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode !== responseCode) {
                checkSites.sendEmail(url, responseCode);
            }
        });
    },
    sendEmail: function(url, searchText) {
        var email = new sendgrid.Email({
            to: ['email1', 'email2', 'email3'],
            from: 'from',
            subject: 'You Can B00k EEET',
            text: url + " | Will allow you to book the reservation for new years eve!!! | Search: " + searchText,
            headers: { "Priority": "Urgent", "Importance": "high" }
    });

        sendgrid.send(email, function (err, json) {
            if (err) { return console.error(err); }
            console.log(json);
        });
    }
};

checkSites.Start();