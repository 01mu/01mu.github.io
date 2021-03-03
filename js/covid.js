var navInfo  = []

const routes = [
  {path: '/', component: Today},
  {path: '/countries', component: Countries},
  {path: '/states', component: States},
  {path: '/single/:type/:place', component: Single},
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
  <nav class="navpad navbar navbar-expand-lg navbar-light navborder"
    style="padding-bottom: 0px; padding-top: 0px; background-color: #f2f2f2;">
    <a class="navpad navbar-brand" href="#">
      <!--<img src="img/favicon.png" height="32" width="32">&nbsp;-->
      <b>COVID-19</b>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a :class="destination['today']"
            href="index.html#">
            <img src="img/today.png" height="16" width="16">&nbsp;Today</a>
        </li>&nbsp;
        <li class="nav-item">
          <a :class="destination['countries']"
            href="index.html#/countries">
            <img src="img/global.png" height="16" width="16">&nbsp;Global</a>
        </li>&nbsp;
        <li class="nav-item">
          <a :class="destination['states']"
          href="index.html#/states">
            <img src="img/usa.png" height="16" width="16">&nbsp;United States</a>
        </li>
      </ul>
        <ul v-if="info.length != 0" class="navbar-nav navbar-right">
        <li class="nav-item">
          <img class="navinfoicon" src="img/covid.png" height="16" width="16">
          <span class="navinfotext">&nbsp;{{ info[0] }}</span>
        </li>&nbsp;&nbsp;
        <li class="nav-item">
          <img class="navinfoicon"  src="img/covid.png" height="16" width="16">
          <span class="navinfotext">&nbsp;{{ info[1] }}</span>
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
    <div style="background-color: lightgrey; !important; width: 100%;
      border-bottom: 1px solid #ab0a12;"
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
  <div style="color: grey;" class="body centered">
    <p>
      Case data collected from
      <b>
        <a style="color: grey;" href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">the JHU CSSE</a>
      </b>
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
