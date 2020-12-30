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
  props: ['destination'],
  template:
  `
  <nav class="navpad navbar navbar-expand-lg navbar-light bg-light navborder
    sticky-top"
    style="padding-bottom: 0px; padding-top: 0px;">
    <a class="navpad navbar-brand" href="#"><b>COVID-19</b></a>
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
            href="index.html#">Today</a>
        </li>&nbsp;
        <li class="nav-item">
          <a :class="destination['countries']"
            href="index.html#/countries">Global</a>
        </li>&nbsp;
        <li class="nav-item">
          <a :class="destination['states']"
          href="index.html#/states">United States</a>
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
        <a style="color: grey;" href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">JHU CSSE</a>
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
