var authorquotes = new Vue({
    el: '#authorquotes',
    data: {
        chosenAuthor: '',
        visible: true,
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

                if(json.length == 0) {
                    head.showQuotesAll();
                } else {
                    head.showAuthorOption = true;
                    //document.title = authorquotes.chosenAuthor + " Quotes";
                }

                for(var i = 0; i < json.length; i++) {
                    json[i].wikipedia = 'https://en.wikipedia.org/wiki/' +
                        json[i].author;

                    json[i].quote = '"' + json[i].quote + '"';

                    authorquotes.quotes[flag++].push(json[i]);

                    if(flag == 3) {
                        flag = 0;
                    }
                }

                if(json.length < 50) {
                    authorquotes.loadingText = 'Load more';
                }
            });
        },
        loadMore: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/' +
                'authors/quotes/' + this.chosenAuthor + '/' + ++this.counter;

            this.loadingText = 'Loading...';
            this.setQuotesArr(url);
        },
        showAuthorQuotes: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/' +
                'authors/quotes/' + this.chosenAuthor + '/0';

            this.initQuotesArr();
            this.setQuotesArr(url);
        }
    }
});
