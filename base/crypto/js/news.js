const News = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body">
    <template v-for="(article, index) in news">
      <div class="aligned">
        <img style="width: 100px; height: 50px;" :src="article.image">&nbsp;
        <p class="overflow"><a :href="article.url">
          {{ article.title }}</a><br>
          <span class="figure">{{ article.source }}</span>
          <span style="color: grey;">
            | {{ timeConverter(article.published) }}
          </span>
        </p>
      </div>
    </template>
    <div style="margin-top: 16px;">
      <button :disabled="loadingText == 'Loading...'"
        class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
        {{ loadingText }}
      </button>
    </div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      navInfo: [],
      page: 0,
      news: [],
      loadingText: 'Load more',
      baseURL: 'https://01mu.bitnamiapp.com/crypto/news/',
      url: '',
      showBar: true,
      fullVisible: false,
      timeConverter: timeConverter,
      place: ''
    }
  },
  created() {
    const ctx = this
    this.navbar = getNavbar('news')

    this.init()

    //document.querySelector("link[rel*='icon']").href =
    //  'https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'

    navbarInfo(this.navInfo)
    document.title = 'News'
    this.loadMore()
  },
  methods: {
    init() {
      this.news = []
      this.page = 0
      this.showBar = true
      this.fullVisible = false

      if (this.$route.params.place == 'hl') {
        this.place = 'hl'
        this.url = this.baseURL + 'hl/'
      } else if (this.$route.params.place == 'hn') {
        this.place = 'hn'
        this.url = this.baseURL + 'hn/'
      }
    },
    loadMore() {
      const ctx = this

      this.loadingText = 'Loading...'

      $.getJSON(this.url + this.page++, (json) => {
        ctx.loadingText = 'Load more'
        ctx.showBar = false
        ctx.fullVisible = true

        for (article of json['news']) {
          if (ctx.place == 'hn' || article.image == null)
            article.image = 'img/none.png'
          else
            article.image = 'https://01mu.bitnamiapp.com/graphics/news/' +
              article.image
        }

        ctx.news = ctx.news.concat(json['news'])
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.matched[0].path == from.matched[0].path) {
        this.init()
        this.loadMore()
      }
    }
  }
}
