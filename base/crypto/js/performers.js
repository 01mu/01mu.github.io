const Performers = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible">
    <div class="bigger row">
      <div class="col-sm-4">
        <div class="perfheader"><span class="figure">1 Hour Change</span></div>
        <div class="flex">
          <div class="wrapper50">
            <performers v-for="(p, index) in performers['change_1h_desc']"
              :performer="p"></performers>
            </div>
            <div class="wrapper50">
              <performers v-for="(p, index) in performers['change_1h_asc']"
                :performer="p"></performers>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="perfheader"><span class="figure">24 Hour Change</span></div>
          <div class="flex">
            <div class="wrapper50">
              <performers v-for="(p, index) in performers['change_24h_desc']"
                :performer="p"></performers>
              </div>
              <div class="wrapper50">
                <performers v-for="(p, index) in performers['change_24h_asc']"
                  :performer="p"></performers>
            </div>
        </div>
      </div>
        <div class="col-sm-4">
          <div class="perfheader"><span class="figure">7 Day Change</span></div>
          <div class="flex">
            <div class="wrapper50">
              <performers v-for="(p, index) in performers['change_7d_desc']"
                :performer="p"></performers>
            </div>
            <div class="wrapper50">
              <performers v-for="(p, index) in performers['change_7d_asc']"
                :performer="p"></performers>
            </div>
          </div>
      </div>
    </div>
    <div class="bigger prefmargin">
      <div v-if="noticeVisible" class="alert alert-danger" role="alert">
        <b>{{ notice }}</b>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <input v-on:keyup.enter="updateRank()"
          placeholder="Rank limit" v-model="rank" class="form-control">
          <div class="input-group-append">
            <div class="btn btn-outline-primary " v-on:click="updateRank()">
              Set rank limit
            </div>
          </div>
      </div>
      <div style="margin-top: 16px;">
        <button :disabled="loadingText == 'Loading...'"
          class="btn btn-block btn-outline-primary"
          v-on:click="loadMore()">
          {{ loadingText }}
        </button>
      </div>
      <div class="lastupdated">
        {{ lastUpdated }}
      </div>
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
        <div class="wrapper50 overflow">
          <a :href="'index.html#/single/' + performer.symbol">
            <img height="20" width="20"
              style="cursor: pointer;"
              v-on:click="head.showSingle(performer.symbol)"
              :src="performer.url"/>
            </a>
            &nbsp;
          <a :href="'index.html#/single/' + performer.symbol">
            {{ performer.symbol }}
          </a>
        </div>
        <div class="wrapper50 overflow">
          <span v-if="performer.change >= 0">
            +{{ performer.change.toFixed(2) }}%
          </span>
          <span v-else>
            {{ performer.change.toFixed(2) }}%
          </span>
        </div>
      </div>
      `
    }
  },
  data() {
    return {
      navInfo: [],
      fullVisible: false,
      showBar: true,
      url: 'https://01mu.bitnamiapp.com/crypto/performers/',
      performers: [],
      rank: 0,
      page: 0,
      lastUpdated: '',
      loadingText: 'Load more',
      noticeVisible: false,
      notice: '',
      performerTypes: ['change_1h_asc', 'change_1h_desc',
        'change_24h_asc', 'change_24h_desc',
        'change_7d_asc', 'change_7d_desc'],
    }
  },
  created() {
    this.load()
    document.title = 'Performers'

    //document.querySelector("link[rel*='icon']").href =
    //  'https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'

    navbarInfo(this.navInfo)
    this.navbar = getNavbar('performers')
  },
  methods: {
    showError(text) {
      const ctx = this
      this.notice = text
      this.noticeVisible = 1
      clearInterval(this.timer)
      this.timer = setTimeout(function() { ctx.noticeVisible = 0 }, 1500)
    },
    load() {
      const ctx = this
      const limit = localStorage.getItem('performers_rank')

      if (!limit) this.rank = 100
      else this.rank = limit

      $.getJSON(this.url + this.rank + '/' + this.page, (json) => {
        ctx.showBar = false
        ctx.fullVisible = true
        ctx.formatPerformers(json)
        ctx.performers = json
        ctx.lastUpdated = 'Last updated ' +
          since(json.last_update_coins.input_value)
      })
    },
    updateRank() {
      if (this.rank <= 0 || this.rank > 500 || isNaN(this.rank))
        this.showError("Invalid range: 1 to 500")
      else {
        localStorage.setItem('performers_rank', this.rank)
        this.page = 0
        this.load()
      }
    },
    formatPerformers(json) {
      this.performerTypes.forEach((p) => {
        json[p].map((element) => {
          element.url = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + element.symbol + '.png'
        })
      })
    },
    loadMore() {
      const performers = this
      this.loadingText = 'Loading...'

      $.getJSON(this.url + this.rank + '/' + ++this.page, (json) => {
        performers.formatPerformers(json)

        performers.performerTypes.forEach(function(p) {
          performers.performers[p] = performers.performers[p].concat(json[p])
        })

        performers.loadingText = 'Load more'
      })
    }
  },
}
