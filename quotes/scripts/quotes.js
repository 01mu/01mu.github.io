function make() {
    return {
        template:
        `
        <navbar :h="this"></navbar>
        <loadingbar :h="this"></loadingbar>
        <div v-if="showBody">
            <div class="body">
                <div v-if="noticeVisible" class="alert alert-secondary"
                    role="alert">
                    <b>{{ notice }}</b>
                </div>
                <div class="row">
                    <div class="col-sm-4">
                        <column v-for="(p, index) in quotes[0]" :quote="p"
                            :h="this"></column>
                    </div>
                    <div class="col-sm-4">
                        <column v-for="(p, index) in quotes[1]" :quote="p"
                            :h="this"></column>
                    </div>
                    <div class="col-sm-4">
                        <column v-for="(p, index) in quotes[2]" :quote="p"
                            :h="this"></column>
                    </div>
                </div>
                <div style="margin-top: 8px"></div>
                <div v-if="showButton"
                    class="btn btn-block btn-outline-secondary"
                    v-on:click="loadMore()">
                    {{ loadingText }}
                </div>
            </div>
            <bottom></bottom>
        </div>
        `,
        data() {
            return {
                noticeVisible: false,
                notice: "",
                showLoading: true,
                showBody: false,
                showButton: true,
                currentAuthor: "",
                nav: [],
                quoteQuery: "",
                authorQuery: "",
                type: "quote",
                loadingText: "Load more",
                viewingAuthor: false,
                url: 'https://01mu.bitnamiapp.com/quotes/quotes/all',
                base: 'https://01mu.bitnamiapp.com/quotes',
                quotes: null,
                counter: 0,
            }
        },
        components: {
            column: {
                props: ['quote', 'h'],
                template:
                `
                <div @mouseover="" v-if="h.type == 'quote'">
                    <a :href="'index.html#/author/quotes/' + quote.author">
                        <div class="quote">
                            <div class="overflow" v-html="quote.quote"></div>
                            <div class="overflow" style="margin-top: 10px;
                                font-size: 18px;">
                                – <a class="author"
                                    v-bind:href=quote.w target="_blank">
                                    <b>{{ quote.author }}</b>
                                </a>
                                <br>
                            </div>
                        </div>
                    </a>
                </div>
                <div v-if="h.type == 'author'">
                    <a :href="'index.html#/author/quotes/' + quote.author">
                        <div class="quote" style="text-align: center;">
                            {{ quote.author }}
                        </div>
                    </a>
                </div>
                `
            }
        },
        methods: {
            showError (text, persist) {
                const p = this;
                this.notice = text;
                this.noticeVisible = 1;
                if(!persist) {
                    clearInterval(this.timer);
                    this.timer = setTimeout(function() { p.noticeVisible = 0; },
                        1500);
                }
            },
            authorSearch() {
                if(this.authorQuery === "") {
                    this.showError("Empty query", 0);
                } else {
                    this.$router.push('/search/author/' + this.authorQuery);
                }
            },
            quoteSearch: function() {
                if(this.quoteQuery === "") {
                    this.showError("Empty query", 0);
                } else {
                    this.$router.push('/search/quote/' + this.quoteQuery);
                }
            },
            loadMore() {
                const home = this;

                home.loadingText = "Loading...";

                $.getJSON(this.url, function(json) {
                    var flag = 0;

                    if(json.length == 0) {
                        home.showError("No results", 1);
                    }

                    if(json.length < 50) {
                        home.showButton = false;
                    }

                    for(var i = 0; i < json.length; i++) {
                        json[i].w = 'https://en.wikipedia.org/wiki/' +
                            json[i].author;

                        json[i].quote = '"' + json[i].quote + '"';

                        if(home.$route.params.quoteSearch != null) {
                            json[i].quote = highlight(json[i].quote,
                                home.$route.params.quoteSearch);
                        }

                        if(home.$route.params.relations != null) {
                            json[i].author = json[i].relation;
                        }

                        home.quotes[flag++].push(json[i]);

                        if(flag == 3) {
                            flag = 0;
                        }
                    }

                    home.counter++;
                    home.format();
                    home.showLoading = false;
                    home.showBody = true;
                    home.loadingText = "Load more";
                });
            },
            getNavbar(dest) {
                var nav = {'quotes': 'overflow navpad nav-link', 'relations':
                    'overflow navpad nav-link'};

                nav[dest] = 'overflow nav-link active';

                this.nav = nav;
            },
            setViewingSearch(type, query) {
                if(type == 'quote') {
                    document.title = "Quote Search Results: " + query;
                    this.type = "quote";
                    this.url = this.base + '/quotes/search/' + query + '/' +
                        this.counter;
                } else {
                    document.title = "Author Search Results: " + query;
                    this.type = "author";
                    this.url = this.base + '/authors/search/' + query + '/' +
                        this.counter;
                }
            },
            setViewingAuthor(nav, author) {
                this.viewingAuthor = true;
                this.getNavbar(nav);
                this.currentAuthor = author;

                if(nav == 'quotes') {
                    document.title = this.currentAuthor + " Quotes";
                    this.url = this.base + '/authors/quotes/' + author + '/' +
                        this.counter;
                } else {
                    this.type = "author";
                    document.title = this.currentAuthor + " Relations";
                    this.url = this.base + '/relations/' + author + '/' +
                        this.counter;
                }
            },
            format() {
                const author = this.$route.params.author;
                const relations = this.$route.params.relations;
                const authorSearch = this.$route.params.authorSearch;
                const quoteSearch = this.$route.params.quoteSearch

                if(author) {
                    this.setViewingAuthor('quotes', author);
                } else if(authorSearch) {
                    this.setViewingSearch("author", authorSearch);
                } else if(quoteSearch) {
                    this.setViewingSearch("quote", quoteSearch);
                } else if(relations) {
                    this.setViewingAuthor('relations', relations);
                } else {
                    document.title = "Quotes";
                }
            },
            init() {
                this.showButton = true;
                this.noticeVisible = false;
                this.counter = 0;
                this.quotes = [[], [], []];
                this.format();
                this.loadMore();
            }
        },
        watch: {
            '$route' (to, from) {
                if (to.matched[0].path == from.matched[0].path) {
                    this.showBody = false;
                    this.showLoading = true;
                    this.init();
                }
            }
        },
        created() {
            this.init();
        }
    }
}
