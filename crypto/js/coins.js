const Coins = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="bigger">
    <div class="input-group" style="margin-top: 16px;">
        <input v-on:keyup.enter="search()"
          placeholder="Search for a coin" style="text-align: center;"
          v-model="query" class="form-control">
          <div class="input-group-append">
            <div class="btn btn-outline-primary" v-on:click="search()">
              Search
            </div>
          </div>
    </div>
    <div class="searchborder"></div>
    <div class="flex coinheader">
      <div class="wrapper5 overflow">#</div>
      <div class="wrapper25 overflow">Coin</div>
      <div class="wrapper10 overflow">USD Price</div>
      <div class="wrapper10 d-none d-sm-block overflow">BTC Price</div>
      <div class="wrapper10 d-none d-sm-block overflow">Market Cap</div>
      <div class="wrapper10 d-none d-sm-block overflow">MC %</div>
      <div class="wrapper10 d-none d-sm-block overflow">24H Vol.</div>
      <div class="wrapper7 d-none d-sm-block overflow">1H</div>
      <div class="wrapper7 d-none d-sm-block overflow">24H</div>
      <div class="wrapper7 d-none d-sm-block overflow">7D</div>
    </div>
    <template v-for="(coin, index) in coins">
      <div class="coinpadding flex">
        <div class="wrapper5 overflow">{{ coin.rank }}</div>
        <div class="wrapper25 overflow">
          <a :href="'index.html#/single/' + coin.symbol">
            <img height="20" width="20"
              style="cursor: pointer;"
              v-on:click="head.showSingle(coin.symbol)"
              :src="coin.url"/>&nbsp;
          </a>
          <a :href="'index.html#/single/' + coin.symbol">
            {{ coin.name }} ({{ coin.symbol }})
          </a>
        </div>
        <div class="wrapper10 overflow">
          {{ coin.price_usd }}
        </div>
        <div class="wrapper10 d-none d-sm-block overflow">
          {{ coin.price_btc }}
        </div>
        <div class="wrapper10 d-none d-sm-block overflow">
          {{ coin.market_cap }}
        </div>
        <div class="wrapper10 d-none d-sm-block overflow">
            {{ coin.market_cap_percent }}
        </div>
        <div class="wrapper10 d-none d-sm-block overflow">
          {{ coin.volume_24h }} <!--({{ coin.volume_24h_percent }})-->
        </div>
        <div class="wrapper7 d-none d-sm-block overflow boldfont">
          <span :style="coin.color_1h">{{ coin.change_1h }}</span>
        </div>
        <div class="wrapper7 d-none d-sm-block overflow boldfont">
          <span :style="coin.color_24h">{{ coin.change_24h }}</span>
        </div>
        <div class="wrapper7 d-none d-sm-block overflow boldfont">
          <span :style="coin.color_7d">{{ coin.change_7d }}</span>
        </div>
      </div>
    </template>
    <div v-if="showMoreButton" style="margin: 16px">
      <div class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
        {{ loadingText }}
      </div>
    </div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      navInfo: [],
      fullVisible: false,
      showBar: true,
      query: '',
      nav: 'coins',
      searchURL: 'https://01mu.bitnamiapp.com/crypto/search/',
      url: 'https://01mu.bitnamiapp.com/crypto/coins/',
      coins: [],
      hold: [],
      searchList: [],
      page: 0,
      searchedFor: false,
      lastUpdated: '',
      loadingText: 'Load more',
      showMoreButton: true,
    }
  },
  created() {
    const ctx = this
    document.title = 'Crypto | Coins'

    document.querySelector("link[rel*='icon']").href =
      'https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'

    $.getJSON(this.url + this.page, (json) => {
      ctx.coins = json.coins
      ctx.lastUpdated = 'Last updated ' +
        since(json.last_update_coins.input_value)

      ctx.formatCoins(ctx.coins)
      ctx.showBar = false
      ctx.fullVisible = true
      ctx.hold = [...ctx.coins]
    })

    navbarInfo(this.navInfo)
    this.navbar = getNavbar('coins')
  },
  methods: {
    performSearch() {
      var searchDisplay = [];
      const t = this.query.toLowerCase();

      for (p of this.searchList) {
        const hasName = p['name'].toLowerCase().includes(t)
        const hasSymbol = p['symbol'].toLowerCase().includes(t)

        if (hasName || hasSymbol) searchDisplay.push(p)
      }

      this.coins = searchDisplay

      if (this.query === '') {
        this.showMoreButton = true
        this.coins = this.hold
      }
    },
    search() {
      this.page = 0
      this.showMoreButton = false

      if (!this.searchedFor) {
        $.getJSON(this.searchURL, (json) => {
          this.formatCoins(json.coins)
          this.searchList = json.coins
          this.searchedFor = true
          this.performSearch()
        })
      } else {
        this.performSearch()
      }
    },
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
    loadMore() {
      const ctx = this

      this.loadingText = 'Loading...'

      $.getJSON(this.url + ++this.page, (json) => {
        ctx.loadingText = 'Load more'
        ctx.formatCoins(json.coins)
        ctx.coins = ctx.coins.concat(json.coins)
      })
    },
  },
}
