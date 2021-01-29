const BizPosts = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body">
    <div class="alert alert-danger centeralign" role="alert">
      <b>{{ msg }}</b>
    </div>
    <template v-for="(post, index) in posts">
      <div class="bizpostbox">
        <div v-html="post.comment"></div>
        <div class="mbottom"></div>
        <a :href="'index.html#/single/' + coin">
          <img height="20" width="20" :src="coinURL"
            style="cursor: pointer;"/>
        </a>&nbsp;|
        <b><a :href="post.url">{{ post.post_id }}</a></b> |
        <span style="color: grey;">
          {{ since(post.time) }}
        </span>
      </div>
    </template>
    <div v-if="showLoading" style="margin-top: 16px;">
      <div class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
        {{ loadingText }}
      </div>
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
      url: 'https://01mu.bitnamiapp.com/crypto/posts/',
      showBar: true,
      showLoading: true,
      fullVisible: false,
      since: since,
      show_limit: 25,
    }
  },
  created() {
    this.init()
    this.navbar = getNavbar('mentions')
    this.loadMore()
    navbarInfo(this.navInfo)
  },
  methods: {
    init() {
      this.coin = this.$route.params.id.toUpperCase()
      this.posts = []
      this.msg = this.views_msg
      this.page = 0
      this.showLoading = true
      this.fullVisible = false
      this.loadingText = 'Load more'
      this.coinURL = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + this.coin + '.png'

      document.querySelector("link[rel*='icon']").href = this.coinURL

      document.title = 'Crypto | ' + this.coin + ' /biz/ Posts'
    },
    loadMore() {
      this.loadingText = 'Loading...'

      $.getJSON(this.url + this.coin + '/' + this.page++, (json) => {
        if (json.length == 0 && this.page == 1) {
          this.msg = 'No posts for ' + this.coin
          this.showLoading = false
        }

        if (json.length < this.show_limit) {
          this.showLoading = false
        }

        this.posts = this.posts.concat(json)
        this.loadingText = 'Load more'
        this.showBar = false
        this.fullVisible = true

        for (post of this.posts)
          post.url = 'https://boards.4chan.org/biz/thread/'
            + post.thread_id + '#p' + post.post_id
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
