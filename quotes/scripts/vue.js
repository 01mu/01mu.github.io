function make() {
  return {
    template:
    `
    <navbar :quoteCtx="this"></navbar>
    <loadingbar :quoteCtx="this"></loadingbar>
    <div v-if="showBody">
      <div class="body">
        <div v-if="noticeVisible" class="alert alert-secondary" role="alert">
            <b>{{ notice }}</b>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <column v-for="(p, i) in quotes[0]" :quote="p" :ctx="this"></column>
          </div>
          <div class="col-sm-4">
            <column v-for="(p, i) in quotes[1]" :quote="p" :ctx="this"></column>
          </div>
          <div class="col-sm-4">
            <column v-for="(p, i) in quotes[2]" :quote="p" :ctx="this"></column>
          </div>
        </div>
        <div style="margin-top: 8px"></div>
        <div v-if="showButton" class="btn btn-block btn-outline-secondary"
          v-on:click="loadMore()">
            {{ loadingText }}
        </div>
      </div>
      <bottom></bottom>
    </div>
    `,
    components: {
      column: {
        props: ['quote', 'ctx'],
        template:
        `
        <div @mouseover="" v-if="ctx.type == 'quote'">
          <div class="quote">
            <div class="overflow" v-html="quote.quote"></div>
            <div class="overflow author" style="margin-top: 10px;">
              <div class="alignleft">
                – <a class="author" v-bind:href=quote.link>
                <b>{{ quote.author }}</b>
                </a>
              </div>
              <div class="alignright">
                <!--<img src="img/link.png" width="18"/>&nbsp;
                <img src="img/copy.png" width="18"/>-->
              </div>
            </div>
          </div>
        </div>
        <div v-if="ctx.type == 'author'">
          <a :href="'index.html#/author/quotes/' + quote.author">
            <div class="quote" style="text-align: center;">
              {{ quote.author }}
            </div>
          </a>
        </div>
        `
      }
    },
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
    created() {
      this.init()
    },
    methods: {
      showError (text, persist) {
        const cx = this
        this.notice = text
        this.noticeVisible = true

        if (!persist) {
          clearInterval(this.timer)
          this.timer = setTimeout(function() { cx.noticeVisible = false }, 1500)
        }
      },
      authorSearch() {
        if (this.authorQuery === "") this.showError('Empty query', 0)
        else this.$router.push('/search/author/' + this.authorQuery)
      },
      quoteSearch() {
        if (this.quoteQuery === "") this.showError('Empty query', 0)
        else this.$router.push('/search/quote/' + this.quoteQuery)
      },
      loadMore() {
        const home = this
        home.loadingText = 'Loading...'

        $.getJSON(this.url, function(json) {
          var flag = 0

          if(json.length == 0) home.showError("No results", 1)
          if(json.length < 50) home.showButton = false

          for (i in json) {
            json[i].quote = '"' + json[i].quote + '"'

            home.quotes[flag++].push(json[i])

            if (flag == 3) flag = 0

            if (home.viewingAuthor)
              json[i].link = 'https://en.wikipedia.org/wiki/' + json[i].author
            else
              json[i].link = "index.html#/author/quotes/" + json[i].author

            if (home.$route.params.relations) json[i].author = json[i].relation

            if(home.$route.params.quoteSearch)
              json[i].quote = highlight(json[i].quote,
                home.$route.params.quoteSearch)
          }

          home.counter++
          home.showLoading = false
          home.showBody = true
          home.loadingText = 'Load more'
          home.format()
        })
      },
      getNavbar(dest) {
        var nav = { 'quotes': 'overflow navpad nav-link',
                    'relations': 'overflow navpad nav-link',}

        nav[dest] = 'overflow nav-link active'
        this.nav = nav
      },
      setViewingSearch(type, query) {
        if(type == 'quote') {
          document.title = 'Quote Search Results: ' + query
          this.type = 'quote'
          this.url = this.base + '/quotes/search/' + query + '/' + this.counter
        } else {
          document.title = 'Author Search Results: ' + query
          this.type = 'author'
          this.url = this.base + '/authors/search/' + query + '/' + this.counter
        }
      },
      setViewingAuthor(nav, auth) {
        this.viewingAuthor = true
        this.getNavbar(nav)
        this.currentAuthor = auth

        if (nav == 'quotes') {
          document.title = this.currentAuthor + " Quotes"
          this.url = this.base + '/authors/quotes/' + auth + '/' + this.counter
        } else {
          this.type = "author"
          document.title = this.currentAuthor + " Relations"
          this.url = this.base + '/relations/' + auth + '/' + this.counter
        }
      },
      format() {
        const author = this.$route.params.author
        const relations = this.$route.params.relations
        const authorSearch = this.$route.params.authorSearch
        const quoteSearch = this.$route.params.quoteSearch

        if (author) this.setViewingAuthor('quotes', author)
        else if(relations) this.setViewingAuthor('relations', relations)
        else if(authorSearch) this.setViewingSearch('author', authorSearch)
        else if(quoteSearch) this.setViewingSearch('quote', quoteSearch)
        else document.title = "Quotes"

      },
      init() {
        this.showButton = true
        this.noticeVisible = false
        this.counter = 0
        this.quotes = [[], [], []]
        this.format()
        this.loadMore()
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.matched[0].path == from.matched[0].path) {
          this.showBody = false
          this.showLoading = true
          this.init()
        }
      }
    }
  }
}
