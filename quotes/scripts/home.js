function make() {
    return {
        template:
        `
        <navbar :h="this"></navbar>
        <loadingbar :h="this"></loadingbar>
        <div v-if="showBody">
            <div class="body">
                <div v-if="noticeVisible" class="alert alert-secondary" role="alert">
                    <b>{{ notice }}</b>
                </div>
                <div class="row">
                    <div class="col-sm-4">
                        <column v-for="(p, index) in quotes[0]" :quote="p"
                            :type="type"></column>
                    </div>
                    <div class="col-sm-4">
                        <column v-for="(p, index) in quotes[1]" :quote="p"
                            :type="type"></column>
                    </div>
                    <div class="col-sm-4">
                        <column v-for="(p, index) in quotes[2]" :quote="p"
                            :type="type"></column>
                    </div>
                </div>
                <div style="margin-top: 8px"></div>
                <button v-if="showButton"
                    class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
                    {{ loadingText }}
                </button>
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
                props: ['quote', 'type'],
                template:
                `
                <div v-if="type == 'quote'">
                <a :href="'index.html#/author/quotes/' + quote.author">
                <div class="quote">
                    <div v-html="quote.quote">
                    </div>
                    <div style="margin-top: 10px; font-size: 18px;">
                        – <a v-bind:href=quote.w target="_blank">
                            {{ quote.author }}
                        </a><br>
                    </div>
                </div>
                </a>
                </div>

                <div v-if="type == 'author'">
                <a :href="'index.html#/author/quotes/' + quote.author">
                    <div class="quote" style="text-align: center;"> {{ quote.author }} </div>
                    </a>
                </div>
                `
            }
        },
        methods: {
            showError (text) {
                const p = this;
                this.notice = text;
                this.noticeVisible = 1;
                clearInterval(this.timer);
                this.timer = setTimeout(function() { p.noticeVisible = 0; },
                    1500);
            },
            getNavbar: function(dest) {
                var nav = {'quotes': 'overflow navpad nav-link', 'relations':
                    'overflow navpad nav-link'};

                nav[dest] = 'overflow nav-link active';

                this.nav = nav;
            },
            authorSearch: function() {
                if(this.authorQuery === "") this.showError("Empty query")
                else this.$router.push('/search/author/' + this.authorQuery);
            },
            quoteSearch: function() {
                if(this.quoteQuery === "") {
                    this.showError("Empty query")
                } else {
                    window.location.href = "file:///home/daniel/Git/01mu.github.io/quotes/index.html#/search/quote/"
                        + this.quoteQuery;
                }

                //this.$router.push('/search/quote/' + this.quoteQuery);
            },
            update: function() {
                var a = [];

                for(var i = 0; i < 3; i++) {
                    a[i] = [];
                }

                this.quotes = a;
                this.loadMore();
            },
            loadMore: function() {
                const home = this;

                $.getJSON(this.url, function(json) {
                    var flag = 0;
                    var i;

                    if(json.length < 50) home.showButton = false;

                    for(i = 0; i < json.length; i++) {
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
                    home.setURL();
                    home.showLoading = false;
                    home.showBody = true;
                });
            },
            setURL: function() {
                if(this.$route.params.author != null) {
                    var author = this.$route.params.author;
                    this.viewingAuthor = true;
                    this.currentAuthor = this.$route.params.author;
                    this.getNavbar('quotes');
                    document.title = this.currentAuthor + " Quotes";
                    this.url = this.base + '/authors/quotes/' + author + '/' + this.counter;
                } else if(this.$route.params.authorSearch != null) {
                    this.type = "author";
                    document.title = "Author Search Results: " + this.$route.params.authorSearch;
                    this.url = 'https://01mu.bitnamiapp.com/quotes/authors/search/'
                        + this.$route.params.authorSearch + '/' + this.counter;
                } else if(this.$route.params.quoteSearch != null) {
                    this.type = "quote";
                    document.title = "Quote Search Results: " + this.$route.params.quoteSearch;
                    this.url = 'https://01mu.bitnamiapp.com/quotes/quotes/search/'
                        + this.$route.params.quoteSearch + '/' + this.counter;
                } else if(this.$route.params.relations != null) {
                    this.viewingAuthor = true;
                    this.type = "author";
                    this.getNavbar('relations');
                    this.currentAuthor = this.$route.params.relations;
                    document.title = this.currentAuthor + " Relations";
                    this.url = 'https://01mu.bitnamiapp.com/quotes/relations/'
                        + this.$route.params.relations + '/0';
                } else {
                    document.title = "Quotes";
                }
            },
            init: function() {
                this.counter = 0;
                this.setURL();
                this.update();
                console.log(1)
            }
        },
        created() {
            this.init();

            this.$watch(() => this.$route.params,
                (toParams, previousParams) => {
                    //this.init();
                }
            )
        }
    }
}
