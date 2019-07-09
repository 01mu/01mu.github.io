const router = new VueRouter({
    routes: [],
});

var head = new Vue ({router,
    el: '#head',
    data: {
        vues: [quotes, authors, authorquotes, searchquotes]
    },
    methods: {
        toggle: function(show) {
            var head = this;

            this.vues.forEach(function(e) {
                if(e != show) {
                    e.visible = false;
                }
            });

            show.visible = true;
        },
        showQuotesAll: function() {
            this.$router.push('/quotes/all');
        },
        showAuthorQuotes: function(author) {
            authorquotes.chosenAuthor = author;
            this.$router.push('/aquotes/' + authorquotes.chosenAuthor);
        },
        authorSearch: function() {
            this.$router.push('/asearch/' + authors.searchedAuthor);
        },
        quotesSearch: function() {
            this.$router.push('/qsearch/' + searchquotes.searchTerm);
        },
        setRoute: function() {
            var head = this;
            var split = this.$router.history.current.path.split('/');

            switch(split[1]) {
                case 'quotes':
                    this.toggle(quotes);
                    break;
                case 'asearch':
                    if(split[2] == undefined || split[2] === '') {
                        head.showQuotesAll();
                    } else {
                        authors.searchedAuthor = split[2];

                        this.toggle(authors);
                        authors.performSearch();
                    }
                    break;
                case 'qsearch':
                    if(split[2] == undefined || split[2] === '') {
                        head.showQuotesAll();
                    } else {
                        searchquotes.searchTerm = split[2];

                        this.toggle(searchquotes);
                        searchquotes.showSearchedQuotes();
                    }
                    break;
                case 'aquotes':
                    if(split[2] == undefined || split[2] === '') {
                        head.showQuotesAll();
                    } else {
                        authorquotes.chosenAuthor = split[2];

                        this.toggle(authorquotes);
                        authorquotes.showAuthorQuotes();
                    }
                    break;
                default:
                    this.toggle(quotes);
                    break;
            };
        }
    },
    watch: {
        '$route' (to, from) {
            this.setRoute();
        }
    },
    created: function() {
        this.setRoute();
    }
});
