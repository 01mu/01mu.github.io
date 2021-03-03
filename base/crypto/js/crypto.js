var navInfo  = []

const routes = [
  {path: '/', component: Home},
  {path: '/home', component: Home},
  {path: '/portfolio', component: Portfolio},
  {path: '/about', component: About},
  {path: '/coins', component: Coins},
  {path: '/performers', component: Performers},
  {path: '/heatmap', component: HeatMap},
  {path: '/mentions/:place', component: Mentions},
  {path: '/news/:place', component: News},
  {path: '/single', component: Portfolio},
  {path: '/single/:id', component: Single},
  {path: '/posts/:type/:place/:id', component: Posts},
  {path: '/posts/:type/:place/', component: Posts},
  {path: '/ath/:id', component: ATH},
  {path: '/timeline/:id', component: Timeline},
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

const app = Vue.createApp({})

app.component('comp', {
  props: ['destination', 'info'],
  template:
  `
  <div class="subnav scrollbox">
    <div class="subnavflex">
      <div class="subnav50l">
        <span v-html="info[0]"></span>&nbsp;
        <span v-html="info[1]"></span>&nbsp;
        <span v-html="info[2]"></span>&nbsp;
        <span v-html="info[3]"></span>
      </div>
      <div class="subnav50r">
        <span v-html="info[4]"></span>&nbsp;
        <span v-html="info[5]"></span>
      </div>
    </div>
  </div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light navborder"
    style="padding-bottom: 0px; padding-top: 0px;">
    <!--<a href="#"><img src="img/favicon.ico" height="28" width="28"/></a>&nbsp;-->
    <a class="navpad navbar-brand" href="#">Coinboole</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a :class="destination['home']" href="index.html#/home">
            <img src="img/home.png" height="16" width="16">
            Home
          </a>
        </li>
        <li class="nav-item">
          <a :class="destination['portfolio']" href="index.html#/portfolio">
            <img src="img/portfolio.png" height="16" width="16">
            Portfolio
          </a>
        </li>
        <li class="nav-item">
          <a :class="destination['performers']" href="index.html#/performers">
            <img src="img/performers.png" height="16" width="16">
            Performers
          </a>
        </li>
        <li class="nav-item">
            <a :class="destination['coins']" href="index.html#/coins">
            <img src="img/coins.png" height="16" width="16">
            Coins
          </a>
        </li>
        <li class="nav-item">
          <a :class="destination['heatmap']" href="index.html#/heatmap">
            <img src="img/hm.png" height="16" width="16">
            Heat Map
          </a>
        </li>
        <li class="nav-item dropdown">
          <a :class="destination['news']"
            href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="img/news.png" height="16" width="16">
              News
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown"
            style="margin-bottom: 16px;">
            <a class="dropdown-item" href="index.html#/news/hl">
              ◾ Headlines
            </a>
            <a class="dropdown-item" href="index.html#/news/hn">
              ◾ Hacker News
            </a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a :class="destination['mentions']"
            href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="img/mentions.png" height="16" width="16">
              Mentions
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown"
            style="margin-bottom: 16px;">
            <a class="dropdown-item" href="index.html#/posts/all/biz/">
              ◾ /biz/ Recent Mentions
            </a>
            <a class="dropdown-item" href="index.html#/posts/all/reddit/">
              ◾ /r/CryptoCurrency Recent Mentions
            </a>
            <hr>
            <a class="dropdown-item" href="index.html#/mentions/biz">◾ /biz/ (Past Hour)</a>
            <a class="dropdown-item" href="index.html#/mentions/reddit">◾ /r/CryptoCurrency (Past Hour)</a>
          </div>
        </li>
      </ul>
      <ul class="navbar-nav navbar-right">
        <li class="nav-item">
        </li>
      </ul>
    </div>
  </nav>
  `
})

app.component('loadingbar', {
  props: ['showbar'],
  template:
  `
  <div v-if="showbar" class="progress">
    <div style="background-color:dodgerblue !important; width: 100%"
      class="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar" aria-valuenow="100" aria-valuemin="0"
      aria-valuemax="100">
    </div>
  </div>
  <div style="margin-bottom: 16px"></div>
  `
})

app.component('bottom', {
  template:
  `
  <div style="color: grey; margin-top: 16px;" class="body centered">
    <p>[
      <a class="figure" href="index.html#/about">Coinboole 2021</a>
    ]
    </p>
  </div>
  `
})

app.use(router)
app.mount('#app')

$(document).ready(() => {
  $('.navbar-nav>li>a').on('click', () => {
    if (this.className == 'nav-link active')
      $('.navbar-collapse').collapse('hide')
  })

  $('.dropdown-menu>a').on('click', () => {
    $('.navbar-collapse').collapse('hide')
  })
})
