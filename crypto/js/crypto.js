var navInfo  = []

const routes = [
  {path: '/', component: Portfolio},
  {path: '/portfolio', component: Portfolio},
  {path: '/coins', component: Coins},
  {path: '/performers', component: Performers},
  {path: '/heatmap', component: HeatMap},
  {path: '/biz', component: Biz},
  {path: '/news', component: News},
  {path: '/single', component: Portfolio},
  {path: '/single/:id', component: Single},
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
  <nav class="navbar navbar-expand-lg navbar-light bg-light navborder"
    style="padding-bottom: 0px; padding-top: 0px;">
    <a class="navpad navbar-brand" href="#"><b>Crypto</b></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
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
          <a :class="destination['news']" href="index.html#/news">
            <img src="img/news.png" height="16" width="16">
            News
          </a>
        </li>
        <li class="nav-item">
          <a :class="destination['heatmap']" href="index.html#/heatmap">
            <img src="img/hm.png" height="16" width="16">
            Heat Map
          </a>
        </li>
        <li class="nav-item dropdown">
        <a :class="destination['mentions']"
          href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          <img src="img/mentions.png" height="16" width="16">
            Mentions
        </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="index.html#/biz">/biz/</a>
          </div>
        </li>
      </ul>
      <ul v-if="info.length != 0" class="navbar-nav navbar-right">
        <li class="nav-item smalltext">
          <a>
            <img src="img/cmc.png" height="16" width="16">
            {{ info[0] }}&nbsp;&nbsp;
          </a>
        </li>
        <li class="nav-item smalltext">
          <a>
            <img src="img/cmc.png" height="16" width="16">
            {{ info[1] }}&nbsp;&nbsp;
          </a>
        </li>
        <li class="nav-item smalltext">
        <a>
          <img src="img/cmc.png" height="16" width="16">
          {{ info[2] }}&nbsp;&nbsp;
        </a>
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
      role="progressbar" aria-valuenow="75" aria-valuemin="0"
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
    <p>
      <b>
        <a style="color: grey;" href="https://01mu.github.io/crypto">Crypto</a>
      </b> | <b>About</b>
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
