const template =
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body">
    <div class="box">
      <div class="dropdown">
        <button style="background-color: #ebdde1; font-weight: bold;
        color: black; width: 100%;" class="btn btn-secondary dropdown-toggle"
        type="button" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
          {{ picked }}
        </button>
        <div style="text-align: center; width: 100%;" class="dropdown-menu"
          aria-labelledby="dropdownMenuButton">
          <a v-on:click="setType('total')" class="dropdown-item">
            Total Confirmed / Total Deaths
          </a>
          <a v-on:click="setType('new')" class="dropdown-item">
            New Confirmed / New Deaths
          </a>
          <a v-on:click="setType('totalpern')" class="dropdown-item">
            Total (Per 100,000 Population)
          </a>
          <a v-on:click="setType('newpern')" class="dropdown-item">
            New (Per 100,000 Population)
          </a>
        </div>
      </div>
      <div class="smargin"></div>
      <input class="form-control"
        style="text-align: center;" :placeholder="searchFor" type="text"
        @input="updateSearch" @change="updateSearch">
    </div>
    <div class="smargin2"></div>
    <div class="lbox">
      <div class="flex">
        <div class="wrapper50 smargin2">
          <u><a :class="sortOption['loc']"
            v-on:click="sort('loc')">{{ col }}</a></u>
        </div>
        <div style="text-align:center;" :class="sortBG[show_l[1]]">
          <u><a :class="sortOption[show_l[1]]"
            v-on:click="sort(show_l[1])">{{show_l[0]}}</a></u>
        </div>
        <div style="text-align:center;" :class="sortBG[show_r[1]]">
          <u><a :class="sortOption[show_r[1]]"
            v-on:click="sort(show_r[1])">{{show_r[0]}}</a></u>
        </div>
      </div>
      <casedata v-for="place in countries"
        :dest="col.toLowerCase()"
        :show_l="show_l[1]"
        :show_r="show_r[1]"
        :commas="commas"
        :sortbg="sortBG"
        :pern="perN"
        :place="place">
      </casedata>
    </div>
    <bottom></bottom>
  </div>
  `

const components = {}

components.casedata =
{
   props: ['place', 'dest', 'show_l', 'show_r', 'commas', 'sortbg', 'pern'],
   template:
   `
   <div class="flex">
      <div :class="sortbg['loc']">
        <img height="20" width="30" :src="place.url"/>
        &nbsp;
        <a :href="'index.html#/single/' + dest + '/' + place[dest]">
          {{ place.loc }}
        </a>
      </div>
      <div v-if="!pern" style="text-align:center;" :class="sortbg[show_l]">
        {{ commas(place[show_l]) }}
      </div>
      <div v-else style="text-align:center;" :class="sortbg[show_l]">
        {{ place[show_l].toFixed(2) }}
      </div>
      <div v-if="!pern"  style="text-align:center;" :class="sortbg[show_r]">
        {{  commas(place[show_r]) }}
      </div>
      <div v-else style="text-align:center;" :class="sortbg[show_r]">
        {{ place[show_r].toFixed(2) }}
      </div>
   </div>
   `
}

function make() {
  return {
    data() {
      return {
        navInfo: [],
        countries: [],
        hold: [],
        sortOption: {},
        sortBG: {},
        show_l: ['Confirmed', 'confirmed'],
        show_r: ['Deaths', 'deaths'],
        picked: 'Total Confirmed / Total Deaths',
        perN: false,
        sortToggle: 0,
        commas: commas,
        fullVisible: false,
        showBar: true,
        perConst: 100000,
      }
    },
    created() {
      const ctx = this

      navbarInfo(this.navInfo)

      this.navbar = this.setNavbar()
      this.place = this.setPlace()

      this.searchFor = 'Search for a ' + this.place

      if (this.place === 'country') {
        this.col = 'Country'
        document.title = 'COVID-19 | Global'
      } else {
        this.col = 'State'
        document.title = 'COVID-19 | United States'
      }

      $.getJSON(this.url(), (json) => {
        ctx.countries = json
        ctx.format()
        ctx.visible = true

        for (v of ctx.countries) {
          if (v.new_deaths < 0) v.new_deaths = 0
          if (v.new_confirmed < 0) v.new_confirmed = 0

          for (type of ['confirmed', 'deaths', 'new_deaths', 'new_confirmed'])
            v[type + '_pern'] = v[type] / v.population * this.perConst
        }

        ctx.hold = [...ctx.countries]
        ctx.fullVisible = true
        ctx.showBar = false
      })

      for (p of ['loc', 'confirmed', 'deaths', 'new_confirmed', 'new_deaths'])
        this.sortBG[p] = 'wrapper25'

      this.sortOption['confirmed'] = 'selected'
      this.sortBG['confirmed'] = 'wrapper25 bgselected'
      this.sortBG['loc'] = 'wrapper50'
    },
    methods: {
      setType(type) {
        this.sortToggle = 1

        switch (type) {
          case 'new':
            this.perN = 0
            this.picked = 'New Confirmed / New Deaths'
            this.show_l = ['New Confirmed', 'new_confirmed']
            this.show_r = ['New Deaths', 'new_deaths']
            this.sort('new_confirmed')
            break
          case 'newpern':
            this.perN = 1
            this.picked = 'New (Per 100,000 Population)'
            this.show_l = ['New Confirmed', 'new_confirmed_pern']
            this.show_r = ['New Deaths', 'new_deaths_pern']
            this.sort('new_confirmed_pern')
            break
          case 'total':
            this.perN = 0
            this.picked = 'Total Confirmed / Total Deaths'
            this.show_l = ['Confirmed', 'confirmed']
            this.show_r = ['Deaths', 'deaths']
            this.sort('confirmed')
            break
          case 'totalpern':
            this.perN = 1
            this.picked = 'Total (Per 100,000 Population)'
            this.show_l = ['Confirmed', 'confirmed_pern']
            this.show_r = ['Deaths', 'deaths_pern']
            this.sort('confirmed_pern')
            break
        }
      },
      updateSearch({type, target}) {
        var searchDisplay = [];
        const t = target.value.toLowerCase();

        for (p of this.hold)
          if (p[this.place].toLowerCase().includes(t)) searchDisplay.push(p)

        this.countries = searchDisplay
      },
      sort(type) {
        if (!this.sortToggle) sortFn = (a, b) => (a[type] > b[type]) ? 1 : -1
        else sortFn = (a, b) => (a[type] < b[type]) ? 1 : -1

        this.sortOption[type] = 'selected';

        if (type != 'loc') this.sortBG[type] = 'wrapper25 bgselected'
        else this.sortBG[type] = 'wrapper50 bgselected'

        for (p of ['loc', 'confirmed', 'deaths', 'new_confirmed',
          'new_deaths', 'confirmed_pern', 'deaths_pern', 'new_confirmed_pern',
          'new_deaths_pern'])
          if (p != type) {
            this.sortOption[p] = 'not_selected'

            if (p != 'loc') this.sortBG[p] = 'wrapper25'
            else this.sortBG[p] = 'wrapper50'
          }

        this.sortToggle ^= 1
        this.countries.sort(sortFn)
        this.hold.sort(sortFn)
      },
    }
  }
}

const Countries = make()
const States = make()

Countries.template = States.template = template;
Countries.components = States.components = components

Countries.methods.url = () => 'https://01mu.bitnamiapp.com/covid-19/countries'
Countries.methods.setNavbar = () => getNavbar('countries')
Countries.methods.setPlace = () => 'country'

States.methods.url = () => 'https://01mu.bitnamiapp.com/covid-19/states'
States.methods.setNavbar = () => getNavbar('states')
States.methods.setPlace = () => 'state'

Countries.methods.format = function() {
  this.countries.map((element) => {
    element.loc = element.country
    element.url = 'https://01mu.bitnamiapp.com/graphics/countries/' +
      countryCode(element.country) + '.PNG'
  })
}

States.methods.format = function() {
  this.countries.map((element) => {
    element.loc = element.state
    element.url = 'https://01mu.bitnamiapp.com/graphics/states/' +
      replaceAll(element.state.toLowerCase(), " ", "-") + '.png'
  })
}
