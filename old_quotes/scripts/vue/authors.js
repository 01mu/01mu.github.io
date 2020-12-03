var authors = new Vue({
    el: '#authors',
    data: {
        searchedAuthor: '',
        visible: false,
        searchResults: [],
        loadingText: 'Load more',
        counter: 0
    },
    methods: {
        loadMore: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/authors/' +
                'search/' + this.searchedAuthor + '/' + ++this.counter;

            quotes.loadingText = 'Loading...';

            $.getJSON(url, function(json) {
                authors.searchResults = authors.searchResults.concat(json);

                authors.loadingText = 'Load more';
            });
        },
        performSearch: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/authors/' +
                'search/' + this.searchedAuthor + '/0';

            this.counter = 0;
            this.searchResults = [];

            $.getJSON(url, function(json) {
                authors.searchResults = json;
                /*if(json.length === 1) {
                    head.showAuthorQuotes(json[0].author);
                } else {
                    authors.searchResults = json;
                }*/
            });
        }
    }
});
