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
      url: 'https://01mu.bitnamiapp.com/crypto/news/',
      showBar: true,
      fullVisible: false,
      timeConverter: timeConverter,
    }
  },
  created() {
    const ctx = this
    this.navbar = getNavbar('news')

    document.querySelector("link[rel*='icon']").href =
      'https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'

    navbarInfo(this.navInfo)
    document.title = 'Crypto | News'
    this.loadMore()
  },
  methods: {
    loadMore() {
      const ctx = this

      this.loadingText = 'Loading...'

      $.getJSON(this.url + this.page++, (json) => {
        ctx.news = ctx.news.concat(json)
        ctx.loadingText = 'Load more'
        ctx.showBar = false
        ctx.fullVisible = true

        for (article of ctx.news) {
          if (article.image == null) article.image = 'img/none.png'
        }
      })
    }
  }
}
