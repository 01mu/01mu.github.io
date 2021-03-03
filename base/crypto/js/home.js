const Home = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="bigger row">
    <div class="col-sm-9">
      <hr>
      Recent News
      <hr>
      <template v-for="(article, index) in data['hn']">
        <div class="aligned">
          <p class="overflow"><a :href="article.url">
            ◾{{ article.title }}</a>
            <span style="color: grey;">
              | {{ timeConverter(article.published) }}
            </span>
          </p>
        </div>
      </template>
      <template v-for="(article, index) in data['hl']">
        <div class="aligned">
          <p class="overflow"><a :href="article.url">
            ◾{{ article.title }}</a>
            <span style="color: grey;">
              |
              {{ article.source }}
              | {{ timeConverter(article.published) }}
            </span>
          </p>
        </div>
      </template>
      <hr>
      <div class="row">
        <div class="col-sm-6">
          /biz/ Mentions (Past Hour)<hr>
          <template v-for="(mention, index) in data['biz_mentions']">
            <mention :mention="mention" :place="'biz'"></mention>
          </template>
        </div>
        <div class="col-sm-6">
          /r/CryptoCurrency Mentions (Past Hour)<hr>
          <template v-for="(mention, index) in data['reddit_mentions']">
            <mention :mention="mention" :place="'reddit'"></mention>
          </template>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <hr>
      Performers (1 Hour)
      <hr>
      <div class="flex">
        <div class="wrapper50">
          <performers v-for="(p, index) in data.performers['change_1h_desc']"
            :performer="p"></performers>
          </div>
          &nbsp;&nbsp;
          <div class="wrapper50">
            <performers v-for="(p, index) in data.performers['change_1h_asc']"
              :performer="p"></performers>
          </div>
        </div>
      <hr>
      Performers (24 Hours)
      <hr>
      <div class="flex">
        <div class="wrapper50">
          <performers v-for="(p, index) in data.performers['change_24h_desc']"
            :performer="p"></performers>
          </div>
          &nbsp;&nbsp;
          <div class="wrapper50">
            <performers v-for="(p, index) in data.performers['change_24h_asc']"
              :performer="p"></performers>
          </div>
        </div>
      <hr>
      Performers (7 Days)
      <hr>
      <div class="flex">
        <div class="wrapper50">
          <performers v-for="(p, index) in data.performers['change_7d_desc']"
            :performer="p"></performers>
        </div>
        &nbsp;&nbsp;
        <div class="wrapper50">
          <performers v-for="(p, index) in data.performers['change_7d_asc']"
            :performer="p"></performers>
        </div>
      </div>
      <hr>
      Top Coins
      <hr>
      <template v-for="(coin, index) in data['coins']">
        <div class="flex">
          <div class="wrapper50">
          <p class="overflowhome">
            <a :href="'index.html#/single/' + coin.symbol">
              <img height="20" width="20"
                style="cursor: pointer;"
                :src="coin.url"/>
              </a>
              &nbsp;
            <a :href="'index.html#/single/' + coin.symbol">
              {{ coin.name }} ({{ coin.symbol }})
            </a>
          </p>
          </div>
          <div class="wrapper50 athpointr" style="color: grey;">
           {{ coin.price_usd }}
         </div>
       </div>
      </template>
    </div>
    <bottom></bottom>
  </div>
  `,
  components: {
    performers: {
      props: ['performer'],
      template:
      `
      <div class="flex coinpadding">
        <div class="wrapper50 overflowhome">
          <a :href="'index.html#/single/' + performer.symbol">
            <img height="20" width="20"
              style="cursor: pointer;"
              v-on:click="head.showSingle(performer.symbol)"
              :src="performer.url"/>
            </a> <a :href="'index.html#/single/' + performer.symbol">
            {{ performer.symbol }}
          </a>
        </div>
        <div class="wrapper50 athpointr">
          <span v-if="performer.change >= 0" style="color: green;">
            +{{ performer.change.toFixed(2) }}%
          </span>
          <span v-else style="color: red;">
            {{ performer.change.toFixed(2) }}%
          </span>
        </div>
      </div>
      `
    },
    mention: {
      props: ['mention', 'place'],
      template:
      `
        <div class="flex">
          <div class="wrapper50">
          <p class="overflowhome">
          <a :href="'index.html#/single/' + mention.symbol">
            <img height="20" width="20"
              style="cursor: pointer;"
              :src="mention.url"/>
          </a>
          &nbsp;
          <a :href="'index.html#/single/' + mention.symbol">
            {{ mention.name }} ({{ mention.symbol }})
          </a>
          </p>
          </div>
          <div class="wrapper50 athpointr">
            <p>
            {{ mention.total }}
            <span class="greytext">
              ({{ mention.name_diff }})
            </span><a :href="'index.html#/posts/symbol/' + place + '/' + mention.symbol">[+]</a>
            </p>
          </div>
        </div>
      `
    }
  },
  data() {
    return {
      performerTypes: ['change_1h_asc', 'change_1h_desc',
        'change_24h_asc', 'change_24h_desc',
        'change_7d_asc', 'change_7d_desc'],
      timeConverter: timeConverter,
      navInfo: [],
      data: [],
      showBar: true,
      fullVisible: false,
      performerLimit: 100,
      mentionLimit: 100,
      url: 'https://01mu.bitnamiapp.com/crypto/home/'
    }
  },
  created() {
    this.navbar = getNavbar('home')
    document.title = 'Coinboole'
    navbarInfo(this.navInfo)

    const performerLimit = localStorage.getItem('performers_rank')
    const mentionLimit = localStorage.getItem('biz_rank')

    if (!performerLimit) this.performerLimit = 100
    else this.performerLimit = performerLimit

    if (!mentionLimit) this.mentionLimit = 100
    else this.mentionLimit = mentionLimit

    $.getJSON(this.url + this.performerLimit + '/' + this.mentionLimit, (json) => {
      for (article of json['hl']) {
        if (article.image == null || article.source == 'Hacker News')
          article.image = 'img/none.png'
        else
          article.image = 'https://01mu.bitnamiapp.com/graphics/news/' +
            article.image
      }
      for (article of json['hn']) {
        if (article.image == null || article.source == 'Hacker News')
          article.image = 'img/none.png'
        else
          article.image = 'https://01mu.bitnamiapp.com/graphics/news/' +
            article.image
      }

      this.formatCoins(json['coins'])
      this.formatPerformers(json['performers'])
      for (source of ['biz_mentions', 'reddit_mentions'])
        this.formatCounts(json[source])

      this.data = json
      this.showBar = false
      this.fullVisible = true
    })
  },
  methods: {
    formatCoins(coins) {
      coins.map((e) => {
        e.url = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + e.symbol + '.png'

        e.change_1h = e.change_1h.toFixed(2)
        e.change_24h = e.change_24h.toFixed(2)
        e.change_7d = e.change_7d.toFixed(2)

        e.color_1h = e.color_24h = e.color_7d = 'color: red;'

        if (e.change_1h >= 0) {
          e.change_1h = '+' + e.change_1h
          e.color_1h = 'color: green;'
        }

        if (e.change_24h >= 0) {
          e.change_24h = '+' + e.change_24h
          e.color_24h = 'color: green;'
        }

        if (e.change_7d >= 0) {
          e.change_7d = '+' + e.change_7d
          e.color_7d = 'color: green;'
        }

        e.change_1h = e.change_1h + '%'
        e.change_24h = e.change_24h + '%'
        e.change_7d = e.change_7d + '%'

        e.price_usd = '$' + commas(e.price_usd.toFixed(2))
        e.price_btc = e.price_btc.toFixed(5)

        e.market_cap = '$' + numWord(e.market_cap)
        e.market_cap_percent = e.market_cap_percent.toFixed(2) + '%'

        e.volume_24h = '$' + numWord(e.volume_24h)
        e.volume_24h_percent = e.volume_24h_percent.toFixed(2) + '%'

      })
    },
    formatPerformers(json) {
      this.performerTypes.forEach((p) => {
        json[p].map((element) => {
          element.url = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + element.symbol + '.png'
        })
      })
    },
    formatCounts(counts) {
      counts.map((e) => {
        e.url = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + e.symbol + '.png'

        e.name_diff = Math.abs(e.total - e.total_prev)

        if (e.name_count < e.name_count_prev) e.name_diff *= -1
        else e.name_diff = '+' + e.name_diff
      })
    }
  }
}
