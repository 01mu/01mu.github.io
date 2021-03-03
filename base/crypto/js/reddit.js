const Reddit = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div class="body" v-if="fullVisible">
    <div class="flex coinheader">
      <div class="figure wrapper50">Coin</div>
      <div class="figure wrapper40 overflow">Past Hour Mentions</div>
      <div class="figure wrapper10 overflow">Posts</div>
    </div>
    <template v-for="(count, index) in bizCounts">
      <div class="coinpadding flex">
        <div class="wrapper50 overflow">
          <a :href="'index.html#/single/' + count.symbol">
            <img height="20" width="20"
              style="cursor: pointer;"
              v-on:click="head.showSingle(count.symbol)"
              :src="count.url"/>
          </a>
          &nbsp;
          <a :href="'index.html#/single/' + count.symbol">
            {{ count.name }} ({{ count.symbol }})
          </a>
        </div>
        <div class="wrapper40">
          <div class="d-block d-sm-none centeralign">
            {{ count.total }}&nbsp;<span class="greytext">({{ count.name_diff }})</span>
          </div>
          <div class="d-none d-sm-block">
            {{ count.total }}&nbsp;<span class="greytext">({{ count.name_diff }})</span>
          </div>
        </div>
        <div class="wrapper10">
           <a class="viewposts" :href="'index.html#/posts/' + count.symbol">
            [View]
          </a>
        </div>
      </div>
    </template>
    <div v-if="noticeVisible" class="alert alert-danger" role="alert">
      <b>{{ notice }}</b>
    </div>
    <div class="input-group" style="margin-top: 16px;">
      <input v-on:keyup.enter="updateRank()"
        placeholder="Rank limit" v-model="rank" class="form-control">
        <div class="input-group-append">
          <button class="btn btn-outline-primary" v-on:click="updateRank()">
            Set rank limit
          </button>
        </div>
    </div>
    <div class="lastupdated">
      {{ lastUpdated }}
    </div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      navInfo: [],
      fullVisible: false,
      showBar: true,
      url: 'https://01mu.bitnamiapp.com/crypto/reddit/',
      rank: 50,
      bizCounts: [],
      lastUpdated: '',
      noticeVisible: false,
      notice: '',
      st: 0,
      since: since,
    }
  },
  created() {
    const ctx = this
    const limit = localStorage.getItem('biz_rank')

    document.querySelector("link[rel*='icon']").href =
      'https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'

    if (limit == null) this.rank = 50
    else this.rank = limit

    document.title = 'Crypto | /biz/ Mentions'

    this.load()
    navbarInfo(this.navInfo)
    this.navbar = getNavbar('mentions')
  },
  methods: {
    showError(text) {
      const ctx = this
      this.notice = text
      this.noticeVisible = 1
      clearInterval(this.timer)
      this.timer = setTimeout(() => { ctx.noticeVisible = 0 }, 1500)
    },
    load() {
      const ctx = this

      $.getJSON(this.url + this.rank + '/0', (json) => {
          console.log(json)
          ctx.formatCounts(json['reddit'])
          ctx.bizCounts = json['reddit']
          ctx.showBar = false
          ctx.fullVisible = true
          ctx.lastUpdated =
            'Last updated ' + since(json.last_update_reddit.input_value)
      })
    },
    sort(type) {
      switch (type) {
        case 'name':
          if (!biz.st) z = (a, b) => (a.name_count > b.name_count) ? 1 : -1
          else z = (a, b) => (a.name_count < b.name_count) ? 1 : -1
          break
        default:
          if (!biz.st) z = (a, b) => (a.name_diff > b.name_diff) ? 1 : -1
          else z = (a, b) => (a.name_diff < b.name_diff) ? 1 : -1
          break
      }

      this.st ^= 1
      this.bizCounts.sort(z)
    },
    updateRank() {
      if (this.rank <= 0 || this.rank > 500 || isNaN(this.rank))
        this.showError('Range: 1 to 500')
      else {
        localStorage.setItem('biz_rank', this.rank)
        this.page = 0
        this.load()
      }
    },
    formatCounts(counts) {
      counts.map((e) => {
        e.url = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + e.symbol + '.png'

        e.name_diff = Math.abs(e.total - e.total_prev)

        if (e.name_count < e.name_count_prev) e.name_diff *= -1
        else e.name_diff = '+' + e.name_diff
      })
    },
  },
}
