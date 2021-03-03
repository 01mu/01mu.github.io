const ATH = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body">
    <div class="singleinfo centered">
      <img height="20" width="20"
        onerror="this.src='https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'"
        :src="coinURL"/>&nbsp;
      <span class="figure">{{ coin }} ATH History</span>
    </div>
    <div style="margin: 16px;"></div>
    <template v-for="(point, index) in ath">
      <div class="athbox flex">
        <div class="figure athpointl wrapper50">
          <b>{{ '$' + commas(point['ath'].toFixed(3)) }}</b>
        </div>
        <div class="athpointr wrapper50">
          {{ timeConverter(point.time) }}
        </div>
      </div>
    </template>
    <div style="border-top: solid 1px #ccc;"></div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      navInfo: [],
      ath: [],
      coin: '',
      url: 'https://01mu.bitnamiapp.com/crypto/ath/',
      showBar: true,
      fullVisible: false,
      timeConverter: timeConverter,
      commas: commas,
    }
  },
  created() {
    this.navbar = getNavbar('coins')
    this.update()
    navbarInfo(this.navInfo)
    this.loadMore()
  },
  methods: {
    update() {
      this.ath = []
      this.coin = this.$route.params.id.toUpperCase()
      this.coinURL = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + this.coin + '.png'

      this.showBar = true
      this.fullVisible = false

      document.querySelector("link[rel*='icon']").href = this.coinURL

      document.title = 'Crypto | ' + this.coin + ' ATH History'
    },
    loadMore() {
      this.loadingText = 'Loading...'

      $.getJSON(this.url + this.coin, (json) => {
        this.ath = json
        this.showBar = false
        this.fullVisible = true
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.matched[0].path == from.matched[0].path) {
        this.update()
        this.loadMore()
      }
    }
  }
}
