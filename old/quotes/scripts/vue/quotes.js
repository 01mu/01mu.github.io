var quotes = new Vue({
    el: '#quotes',
    data: {
        chosenAuthor: '',
        visible: true,
        quotes: [],
        loadingText: 'Load more',
        counter: 0,
        url: 'https://smallfolio.bitnamiapp.com/quotes/quotes/all'
    },
    methods: {
        loadMore: function() {
            quotes.loadingText = 'Loading...';

            $.getJSON(this.url, function(json) {
                var flag = 0;

                for(var i = 0; i < json.length; i++) {
                    json[i].wikipedia = 'https://en.wikipedia.org/wiki/' +
                        json[i].author;

                    quotes.quotes[flag++].push(json[i]);

                    if(flag == 3) {
                        flag = 0;
                    }
                }

                quotes.loadingText = 'Load more';
            });
        },
        showAuthorQuotes: function(author) {
            var a = [];

            for(var i = 0; i < 3; i++) {
                a[i] = [];
            }

            this.quotes = a;
            this.url = 'https://smallfolio.bitnamiapp.com/quotes/' +
                'authors/quotes/' + this.chosenAuthor + '/0';

            $.getJSON(this.url, function(json) {
                var flag = 0;

                for(var i = 0; i < json.length; i++) {
                    json[i].wikipedia = 'https://en.wikipedia.org/wiki/' +
                        json[i].author;

                    json[i].quote = '"' + json[i].quote + '"';

                    quotes.quotes[flag++].push(json[i]);

                    if(flag == 3) {
                        flag = 0;
                    }
                }
            });
        }
    },
    created: function() {
        var a = [];

        for(var i = 0; i < 3; i++) {
            a[i] = [];
        }

        this.quotes = a;

        $.getJSON(this.url, function(json) {
            var flag = 0;

            for(var i = 0; i < json.length; i++) {
                json[i].wikipedia = 'https://en.wikipedia.org/wiki/' +
                    json[i].author;

                json[i].quote = '"' + json[i].quote + '"';

                quotes.quotes[flag++].push(json[i]);

                if(flag == 3) {
                    flag = 0;
                }
            }
        });
    }
});
