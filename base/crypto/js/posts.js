const Posts = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body">
    <div v-if="fullVisible" class="singleinfo centered">
      <div v-if="type == 'all'">
        <span v-if="place == 'reddit'" class="figure">Recent /r/CryptoCurrency DD Mentions</span>
        <span v-else class="figure">Recent /biz/ Mentions</span>
      </div>
      <div v-else>
        <img height="20" width="20"
          onerror="this.src='https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'"
          :src="coinURL"/>&nbsp;
        <span v-if="place == 'reddit'" class="figure">
          Recent /r/CryptoCurrency DD {{ coin }} Mentions
        </span>
        <span v-else class="figure">
          Recent /biz/ {{ coin }} Mentions
        </span>
      </div>
    </div>
    <div style="margin: 16px;"></div>
    <div class="alert alert-danger centeralign" role="alert">
      <b>{{ msg }}</b>
    </div>
    <template v-for="(post, index) in postsShow">
      <div class="bizpostbox">
        <div v-html="post.comment"></div>
        <div class="mbottom"></div>
        <div class="overflow">
          <template v-for="(symbol, index) in post.symbols">
            <a :href="'index.html#/single/' + symbol">
              <img height="20" width="20"
                :src="'https://01mu.bitnamiapp.com/graphics/crypto/' + symbol + '.png'"
                style="cursor: pointer;"/>
            </a><span v-if="index != post.symbols.length - 1">&nbsp;</span>
          </template>
          |
          <b><a :href="post.url">{{ post.post_id }}</a></b> |
          <span style="color: grey;">
            {{ since(post.time) }}
          </span>
        </div>
      </div>
    </template>
    <div v-if="type == 'all'" class="input-group" style="margin-top: 16px;">
      <input
      v-on:keyup.enter="updateRank()"
        placeholder="Rank limit" v-model="rank" class="form-control">
        <div class="input-group-append">
          <div class="btn btn-outline-primary " v-on:click="updateRank()">
            Set rank limit
          </div>
        </div>
    </div>
    <div v-if="showLoading" style="margin-top: 16px;">
      <button :disabled="loadingText == 'Loading...'"
        class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
        {{ loadingText }}
      </button>
    </div>
    <div class="lastupdated">
      {{ lastUpdate }}
    </div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      views_msg: 'The views expressed in these messages belong to their \
        respective posters.',
      msg: '',
      navInfo: [],
      page: 0,
      posts: [],
      coin: '',
      loadingText: 'Load more',
      url: 'https://01mu.bitnamiapp.com/crypto/posts/biz/',
      showBar: true,
      showLoading: true,
      fullVisible: false,
      since: since,
      lastUpdate: null,
      show_limit: 25,
      rank: 100,
      ids: {},
      postsShow: [],
      lastID: Number.MAX_SAFE_INTEGER,
      place: '',
      type: '',
    }
  },
  created() {
    this.init()
    this.loadMore()
    navbarInfo(this.navInfo)
    this.navbar = getNavbar('mentions')
  },
  methods: {
    init() {
      if(this.$route.params.id)
        this.coin = this.$route.params.id.toUpperCase()

      this.place = this.$route.params.place
      this.type = this.$route.params.type

      if (this.place !== 'reddit' && this.place !== 'biz') console.log('err')
      if (this.type !== 'all' && this.type !== 'symbol') console.log('err')

      this.posts = []
      this.postsShow = []
      this.lastUpdate = null
      this.msg = this.views_msg
      this.page = 0
      this.lastID = Number.MAX_SAFE_INTEGER
      this.showBar = true
      this.rank = 50
      this.showLoading = true
      this.fullVisible = false
      this.loadingText = 'Load more'
      this.url = 'https://01mu.bitnamiapp.com/crypto/posts/'

      this.ids = new Map()

      if (this.type == 'all') {
        this.coinURL = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/BTC.png'

        if (this.place == 'biz') document.title = 'Recent /biz/ Mentions'
        else document.title = 'Recent /r/CryptoCurrency Mentions'
      } else {
        this.coinURL = 'https://01mu.bitnamiapp.com/' +
            'graphics/crypto/' + this.coin + '.png'

        if (this.place == 'biz')
          document.title = this.coin + ' /biz/ Mentions'
        else
          document.title = this.coin + ' /r/CryptoCurrency Mentions'
      }

      //document.querySelector("link[rel*='icon']").href = this.coinURL
    },
    updateRank() {
      if (this.rank <= 0 || this.rank > 500 || isNaN(this.rank))
        this.showError("Invalid range: 1 to 500")
      else {
        localStorage.setItem('biz_mentions_rank', this.rank)
        this.init()
        this.loadMore()
      }
    },
    loadMore() {
      this.loadingText = 'Loading...'

      const limit = localStorage.getItem('biz_mentions_rank')

      if (!limit) this.rank = 50
      else this.rank = limit

      if (this.type == 'all') {
        this.url = 'https://01mu.bitnamiapp.com/crypto/posts/all/' + this.place +'/' +
          this.rank + '/' + this.page++
      } else {
        this.url ='https://01mu.bitnamiapp.com/crypto/posts/symbol/' + this.place +'/'
          + this.coin + '/' + this.page++
      }

      $.getJSON(this.url, (json) => {
        const postArr = json['posts']

        if (postArr.length == 0 && this.page == 1) {
          this.msg = 'No posts for ' + this.coin
          this.showLoading = false
        }

        if (postArr.length < this.show_limit) {
          this.showLoading = false
        }

        this.posts = postArr
        this.loadingText = 'Load more'
        this.showBar = false
        this.fullVisible = true

        this.lastUpdate =
          'Last updated ' + since(json['last_update'].input_value)

        for (post of this.posts) {
          if (this.coin == 'ALL') {
            post.icon = 'https://01mu.bitnamiapp.com/' + 'graphics/crypto/' +
              post.symbol + '.png'
          } else {
            post.icon = 'https://01mu.bitnamiapp.com/' + 'graphics/crypto/' +
              this.coin + '.png'
          }

          if (this.place == 'biz') {
            post.url = 'https://boards.4chan.org/biz/thread/'
              + post.thread + '#p' + post.post_id
          } else {
              post.url = post.thread + post.post_id
            }
          }

        for (post of this.posts) {
          post.comment = post.comment.replace("\n", "<br><br>")

          if (!this.ids.has(post.post_id)) {
            var data = post
            data['symbols'] = []
            this.ids[post.post_id] = data
            this.ids.set(post.post_id, data)
          }

          if (!this.ids[post.post_id]['symbols'].includes(post.symbol))
            this.ids[post.post_id]['symbols'].push(post.symbol)
        }

        var a = []
        var last = this.lastID

        for (var v in this.ids) {
          if (this.place == 'reddit') {
            recent = this.ids[v].time

            if (recent < last) {
              a.push(this.ids[v])
            }

            this.lastID = Math.min(recent, this.lastID)
          } else {
            if (v < last) {
              a.push(this.ids[v])
            }

            this.lastID = Math.min(v, this.lastID)
          }
        }

        if (this.place == 'biz') a = a.reverse()

        //a.reverse()
        //this.postsShow = this.postsShow.reverse()
        this.postsShow = this.postsShow.concat(a)
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.matched[0].path.substring(0,7) == '/posts/') {
        this.init()
        this.loadMore()
      }
    }
  }
}
