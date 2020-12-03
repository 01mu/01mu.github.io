const router = new VueRouter({
    routes: [],
});

var head = new Vue ({router,
    el: '#head',
    data: {
        vues: [quotes, authors, authorquotes, searchquotes, authorrelations],
        showAuthorOption: false,
        currentAuthor: '',
        active: {'quotes': 'active', 'relations': ''}
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
            this.toggle(quotes);
            head.showAuthorOption = false;
            this.$router.push('/quotes/all');
        },
        showAuthorQuotes: function(author) {
            authorquotes.chosenAuthor = author;
            this.$router.push('/aquotes/' + authorquotes.chosenAuthor);
        },
        showAuthorRelations: function(author) {
            authorrelations.chosenAuthor = author;
            this.$router.push('/arelations/' + authorrelations.chosenAuthor);
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
                    //head.showQuotesAll();
                    this.toggle(quotes);
                    head.showAuthorOption = false;
                    break;
                case 'asearch':
                    if(split[2] == undefined || split[2] === '') {
                        head.showQuotesAll();
                    } else {
                        authors.searchedAuthor = split[2];

                        this.toggle(authors);
                        authors.performSearch();
                    }

                    head.showAuthorOption = false;
                    break;
                case 'qsearch':
                    if(split[2] == undefined || split[2] === '') {
                        head.showQuotesAll();
                    } else {
                        searchquotes.searchTerm = split[2];

                        this.toggle(searchquotes);
                        searchquotes.showSearchedQuotes();
                    }

                    head.showAuthorOption = false;
                    break;
                case 'aquotes':
                    if(split[2] == undefined || split[2] === '') {
                        head.showQuotesAll();
                    } else {
                        var author = split[2];

                        authorquotes.chosenAuthor = author;

                        head.showAuthorOption = false;
                        head.currentAuthor = author;
                        head.active['relations'] = '';
                        head.active['quotes'] = 'active';

                        this.toggle(authorquotes);
                        authorquotes.showAuthorQuotes();
                    }
                    break;
                case 'arelations':
                    if(split[2] == undefined || split[2] === '') {
                        head.showQuotesAll();
                    } else {
                        var author = split[2];

                        authorrelations.chosenAuthor = author;

                        head.showAuthorOption = false;
                        head.currentAuthor = author;
                        head.active['relations'] = 'active';
                        head.active['quotes'] = '';

                        this.toggle(authorrelations);
                        authorrelations.showAuthorRelations();
                    }
                    break;
                default:
                    //head.showQuotesAll();
                    this.toggle(quotes);
                    head.showAuthorOption = false;
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
