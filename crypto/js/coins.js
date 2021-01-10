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
          &nbsp;
        <button class="btn btn-outline-primary" v-on:click="search()">
          Search
        </button>
    </div>
    <div class="searchborder"></div>
    <div class="flex coinheader">
      <div class="wrapper5 overflow">#</div>
      <div class="wrapper25 overflow">Coin</div>
      <div class="wrapper10 overflow">USD Price</div>
      <div class="wrapper10 d-none d-sm-block overflow">BTC Price</div>
      <div class="wrapper15 d-none d-sm-block overflow">Market Cap</div>
      <div class="wrapper15 d-none d-sm-block overflow">24 Hour Volume</div>
      <div class="wrapper5 d-none d-sm-block overflow">1H Δ</div>
      <div class="wrapper5 d-none d-sm-block overflow">24H Δ</div>
      <div class="wrapper5 d-none d-sm-block overflow">7D Δ</div>
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
          <div class="wrapper15 d-none d-sm-block overflow">
            {{ coin.market_cap }} ({{ coin.market_cap_percent }})
          </div>
          <div class="wrapper15 d-none d-sm-block overflow">
            {{ coin.volume_24h }} ({{ coin.volume_24h_percent }})
          </div>
          <div class="wrapper5 d-none d-sm-block overflow">
            {{ coin.change_1h }}
          </div>
          <div class="wrapper5 d-none d-sm-block overflow">
            {{ coin.change_24h }}
          </div>
          <div class="wrapper5 d-none d-sm-block overflow">
          {{ coin.change_7d }}
        </div>
      </div>
    </template>
    <div style="margin: 16px">
      <div class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
        {{ loadingText }}
      </div>
    </div>
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
    }
  },
  created() {
    const ctx = this
    document.title = 'Crypto | Coins'

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

      if (this.query === '') this.coins = this.hold
    },
    search() {
      this.page = 0

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
      coins.map((element) => {
        element.url = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + element.symbol.toLowerCase() + '.png'

        element.price_usd = '$' + commas(element.price_usd.toFixed(2))
        element.price_btc = element.price_btc.toFixed(5)
        element.change_1h = element.change_1h.toFixed(2) + '%'
        element.change_24h = element.change_24h.toFixed(2) + '%'
        element.change_7d = element.change_7d.toFixed(2) + '%'

        element.market_cap = '$' + numWord(element.market_cap)
        element.market_cap_percent =
          element.market_cap_percent.toFixed(2) + '%'

        element.volume_24h = '$' + numWord(element.volume_24h)
        element.volume_24h_percent =
          element.volume_24h_percent.toFixed(2) + '%'
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
