const nav_template = `
  <nav class="navbar navbar-expand-lg navbar-light navborder sticky-top"
    style="padding-bottom: 6px; padding-top: 6px; background-color: #ddded1;">
    <a class="navbar-brand" href="#"><b>Quotes</b></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <div  v-if="quoteCtx.viewingAuthor" class="sborder"></div>
      <ul class="navbar-nav mr-auto">
        <li v-if="quoteCtx.viewingAuthor" :class="quoteCtx.nav['quotes']">
            <a style="display:block;"
              :href="'index.html#/author/quotes/' + quoteCtx.currentAuthor">
              {{ quoteCtx.currentAuthor }}'s Quotes
            </a>
        </li>
        <div class="sborder"></div>
        <li v-if="quoteCtx.viewingAuthor" :class="quoteCtx.nav['relations']">
            <a style="display:block;"
              :href="'index.html#/author/relations/' + quoteCtx.currentAuthor">
              {{ quoteCtx.currentAuthor }}'s Relations
            </a>
        </li>
        <div class="d-none d-sm-block">
            <li class="nav-link"><a>&nbsp;</a></li>
        </div>
    </ul>
    <div v-if="quoteCtx.viewingAuthor" class="sborder"></div>
    <ul class="navbar-nav navbar-right">
        <li class="nav-item">
          <span class="form-inline">
              <input class="form-control mr-sm-2" v-model="quoteCtx.authorQuery"
                  type="search" v-on:keyup.enter="quoteCtx.authorSearch()"
                  placeholder="Search for an author" aria-label="Search">
              <div class="btn btn-outline-secondary my-2 my-sm-0 mbutton"
                  type="submit" v-on:click="quoteCtx.authorSearch()">
                  Search
              </div>
          </span>
        </li>
        <div class="d-none d-sm-block">&nbsp;&nbsp;&nbsp;</div>
        <div class="sborder"></div>
        <li class="nav-item">
          <span class="form-inline">
              <input class="form-control mr-sm-2" v-model="quoteCtx.quoteQuery"
                  type="search" v-on:keyup.enter="quoteCtx.quoteSearch()"
                  placeholder="Search for a quote" aria-label="Search">
              <div class="btn btn-outline-secondary my-2 my-sm-0 mbutton"
                  type="submit" v-on:click="quoteCtx.quoteSearch()">
                  Search
              </div>
          </span>
        </li>
      </ul>
    </div>
  </nav>
  `

const bottom_template =
  `
  <div class="centered">
    <p>
      Quotes are from
      <a href="https://en.wikiquote.org"><b>Wikiquote</b></a>
      and author relations are from
      <a href="https://en.wikipedia.org"><b>Wikipedia</b></a>
    </p>
  </div>
  `

const loading_template =
  `
  <div v-if="quoteCtx.showLoading" class="progress">
    <div style="background-color:#ddded1 !important; width: 100%;
      border-bottom: 1px solid grey;"
      class="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar" aria-valuenow="75"
      aria-valuemin="0" aria-valuemax="100">
    </div>
  </div>
  <div style="margin-bottom: 16px;"></div>
  `

function highlight(string, needle) {
  return string.replace(new RegExp(needle, 'gi'), (str) => {
    return '<span style="background-color:#fffa00;">' + str + '</span>'});
}

const routes = [
  { path: '/', component: make() },
  { path: '/author/relations/:relations', component: make() },
  { path: '/author/quotes/:author', component: make() },
  { path: '/search/author/:authorSearch', component: make() },
  { path: '/search/quote/:quoteSearch', component: make() },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

const app = Vue.createApp({})

app.component('bottom', {
  template: bottom_template
})

app.component('navbar', {
  props: ['quoteCtx'],
  template: nav_template
})

app.component('loadingbar', {
  props: ['quoteCtx'],
  template: loading_template
})

app.use(router)
app.mount('#app')

$(document).ready(function() {
  $('.navbar-nav>li>a').on('click', function() {
    if (this.className == 'nav-link active')
      $('.navbar-collapse').collapse('hide')
  })

  $('.dropdown-menu>a').on('click', function() {
    $('.navbar-collapse').collapse('hide');
  })
})
