var searchquotes = new Vue({
    el: '#searchquotes',
    data: {
        searchTerm: '',
        visible: false,
        quotes: [],
        loadingText: 'Load more',
        counter: 0
    },
    methods: {
        initQuotesArr: function() {
            var a = [];

            for(var i = 0; i < 3; i++) {
                a[i] = [];
            }

            this.quotes = a;
        },
        setQuotesArr: function(url) {
            $.getJSON(url, function(json) {
                var flag = 0;

                for(var i = 0; i < json.length; i++) {
                    json[i].wikipedia = 'https://en.wikipedia.org/wiki/' +
                        json[i].author;

                    json[i].quote = '"' + json[i].quote + '"';
                    json[i].quote = highlight(json[i].quote,
                        searchquotes.searchTerm);

                    searchquotes.quotes[flag++].push(json[i]);

                    if(flag == 3) {
                        flag = 0;
                    }
                }

                if(json.length < 50) {
                    searchquotes.loadingText = 'Load more';
                }
            });
        },
        loadMore: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/' +
                'quotes/search/' + this.searchTerm + '/' + ++this.counter;

            this.loadingText = 'Loading...';
            this.setQuotesArr(url);
        },
        showSearchedQuotes: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/' +
                'quotes/search/' + this.searchTerm + '/0';

            this.initQuotesArr();
            this.setQuotesArr(url);
        }
    }
});
