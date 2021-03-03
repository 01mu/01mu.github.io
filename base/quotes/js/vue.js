function make() {
  return {
    template:
    `
    <navbar :ctx="this"></navbar>
    <loadingbar :ctx="this"></loadingbar>
    <div v-if="showBody">
      <div class="body">
        <div v-if="noticeVisible" class="alert alert-secondary" role="alert">
            <b>{{ notice }}</b>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <column v-for="(p, i) in quotes[0]" :index="i" :column=0
              :quote="p" :ctx="this"></column>
          </div>
          <div class="col-sm-4">
            <column v-for="(p, i) in quotes[1]" :index="i" :column=1
              :quote="p" :ctx="this"></column>
          </div>
          <div class="col-sm-4">
            <column v-for="(p, i) in quotes[2]" :index="i" :column=2
              :quote="p" :ctx="this"></column>
          </div>
        </div>
        <button :disabled="loadingText == 'Loading...'"
          v-if="showButton" class="btn btn-block btn-outline-secondary
          loadingbutton"
          v-on:click="loadMore()">
            {{ loadingText }}
        </button>
      </div>
      <bottom></bottom>
    </div>
    `,
    components: {
      column: {
        props: ['quote', 'ctx', 'index', 'column'],
        template:
        `
        <div @mouseover="" v-if="ctx.type == 'quote'">
          <div class="quote">
            <div class="overflow">{{ quote.quote }}</div>
            <div class=" flex author">
              <div class="wrapper80">
                –
                <a class="authortext"
                  :title="quote.author +  ' - ' + quote.title"
                  v-bind:href=quote.link>
                  {{ quote.author }}
                </a>
              </div>
              <div class="wrapper20">
                <div class="alignright">
                  <a class="icon"
                    :title="quote.author + ' - Wikiquote'"
                    :href="'https://en.wikiquote.org/wiki/' + quote.author">
                    <img src="img/link.png" width="18"/>
                  </a>&nbsp;
                  <a v-if="quote.liked == 0"
                    v-on:click="ctx.like(quote, index, column)" class="icon">
                    <img src="img/fav_hollow.png" width="18"/>
                  </a>
                  <a v-if="quote.liked == 1"
                    v-on:click="ctx.like(quote, index, column)" class="icon">
                    <img src="img/fav_full.png" width="18"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="ctx.type == 'author'">
          <a :href="'index.html#/author/quotes/' + quote.author">
            <div class="authorsearch" style="text-align: center;">
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
        notice: '',
        showLoading: true,
        showBody: false,
        showButton: true,
        currentAuthor: '',
        nav: [],
        quoteQuery: '',
        authorQuery: '',
        type: "quote",
        loadingText: 'Load more',
        viewingAuthor: false,
        url: 'https://01mu.bitnamiapp.com/quotes/quotes/all',
        base: 'https://01mu.bitnamiapp.com/quotes',
        quotes: null,
        counter: 0,
        quotesLoaded: false,
      }
    },
    created() {
      this.getNavbar()
      this.init()
    },
    methods: {
      like(quote, index, column) {
        if (!likedIDs.has(quote.id)) {
          if (this.$route.params.quoteSearch)
            quote.quote = this.dehighlight(quote.quote)

          const quoteAdd = {'quote': quote.quote, 'id': quote.id,
            'author': quote.author}

          this.quotes[column][index].liked = 1
          likedQuotes.unshift(quoteAdd)
          likedIDs.add(quote.id)
        } else {
          for (q in likedQuotes)
            if (likedQuotes[q].id == quote.id) likedQuotes.splice(quote, 1)

          this.quotes[column][index].liked = 0
          likedIDs.delete(quote.id)

          if (this.$route.path === '/favorites') this.showFavorites()
        }

        localStorage.setItem('likedquotes',
          JSON.stringify([...likedQuotes]))

        localStorage.setItem('likedids', JSON.stringify([...likedIDs]))
      },
      showError (text, persist) {
        this.notice = text
        this.noticeVisible = true

        if (!persist) {
          clearInterval(this.timer)
          this.timer = setTimeout(() => { this.noticeVisible = false }, 1500)
        }
      },
      authorSearch() {
        if (this.authorQuery === '') this.showError('Empty query', 0)
        else this.$router.push('/search/author/' + this.authorQuery)
      },
      quoteSearch() {
        if (this.quoteQuery === '') this.showError('Empty query', 0)
        else this.$router.push('/search/quote/' + this.quoteQuery)
      },
      loadMore() {
        this.loadingText = 'Loading...'

        $.getJSON(this.url, (json) => {
          var flag = 0

          if (json.length == 0) this.showError("No results", 1)
          if (json.length < 50) this.showButton = false

          for (i in json) {
            json[i].quote = '"' + json[i].quote + '"'

            this.quotes[flag++].push(json[i])

            if (flag == 3) flag = 0

            if (this.viewingAuthor) link = 'https://en.wikipedia.org/wiki/'
            else link = 'index.html#/author/quotes/'

            if (this.$route.params.relations) json[i].author = json[i].relation

            /*if (this.$route.params.quoteSearch)
              json[i].quote = this.highlight(json[i].quote,
                this.$route.params.quoteSearch)*/

            if (this.$route.params.author) json[i].title = 'Wikipedia'
            else json[i].title = 'Quotes'

            json[i].link = link + json[i].author

            if (likedIDs.has(json[i].id)) json[i].liked = 1
            else json[i].liked = 0
          }

          this.counter++
          this.showLoading = false
          this.showBody = true
          this.loadingText = 'Load more'
          this.format()
        })
      },
      getNavbar(dest) {
        var nav = {'quotes': 'nav-link navicon',
          'relations': 'nav-link navicon',
          'favorites': 'nav-item navicon'}

        if (dest == 'favorites')
          nav[dest] = 'nav-item active'
        else
          nav[dest] = 'nav-link active'

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
        this.currentAuthor = auth

        this.getNavbar(nav)

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
        else if (relations) this.setViewingAuthor('relations', relations)
        else if (authorSearch) this.setViewingSearch('author', authorSearch)
        else if (quoteSearch) this.setViewingSearch('quote', quoteSearch)
        else if (this.$route.path === '/favorites') this.showFavorites()
        else document.title = 'Quotes'
      },
      showFavorites() {
        this.showBody = true
        this.showButton = false
        this.showLoading = false
        this.quotes = [[], [], []]
        var flag = 0

        this.getNavbar('favorites')

        document.title = 'Quotes | Favorites'

        if (likedQuotes.length == 0) this.showError("No favorites", 1)

        for (quote of likedQuotes) {
          this.quotes[flag++].push(quote)
          quote.link = 'index.html#/author/quotes/' + quote.author

          if (flag == 3) flag = 0

          if (likedIDs.has(quote.id)) quote.liked = 1
          else quote.liked = 0
        }
      },
      init() {
        this.showButton = true
        this.noticeVisible = false
        this.counter = 0
        this.quotes = [[], [], []]
        this.format()

        if (this.$route.path !== '/favorites') this.loadMore()
      },
      highlight(string, needle) {
        return string.replace(new RegExp(needle, 'gi'), (str) => {
          return '<span style="background-color:#fffa00;">' + str + '</span>'});
      },
      dehighlight(string) {
        return string.replace(/<span style="background-color:#fffa00;">/g, '')
          .replace(/<\/span>/g, '')
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
