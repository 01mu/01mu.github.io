function make() {
  return {
    data() {
      return {
        countries: [],
        hold: [],
        sortOption: {},
        sortBG: {},
        show_l: ['Confirmed', 'confirmed'],
        show_r: ['Deaths', 'deaths'],
        picked: 'Total',
        sortToggle: 0,
        commas: commas,
        fullVisible: false,
        showBar: true,
      }
    },
    created() {
      const ctx = this

      this.navbar = this.setNavbar()
      this.place = this.setPlace()

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
        ctx.hold = [...ctx.countries]

        for (v of ctx.countries) {
          if (v.new_deaths < 0) v.new_deaths = 0
          if (v.new_confirmed < 0) v.new_confirmed = 0
        }

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

        if(type === 'new') {
          this.picked = 'New';
          this.show_l = ['New Confirmed', 'new_confirmed'];
          this.show_r = ['New Deaths', 'new_deaths']
          this.sort('new_confirmed')
        } else {
          this.picked = 'Total'
          this.show_l = ['Confirmed', 'confirmed']
          this.show_r = ['Deaths', 'deaths']
          this.sort('confirmed')
        }
      },
      updateSearch({type, target}) {
        var searchDisplay = [];
        var t = target.value.toLowerCase();

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

        for (p of ['loc', 'confirmed', 'deaths', 'new_confirmed', 'new_deaths'])
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

const template =
  `
  <comp :destination="navbar"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body">
    <div class="box">
        <form>
          <label class="radio-inline">
            <input type="radio" id="one" value="Total"
              v-model="picked"
              v-on:click="setType('total')">
              Total Confirmed / Total Deaths
          </label>
          &nbsp;
          <label class="radio-inline">
            <input type="radio" id="two" value="New"
              v-model="picked"
              v-on:click="setType('new')">
              New Confirmed / New Deaths
          </label>
        </form>
        <div class="smargin2"></div>
          <input class="form-control"
            style="text-align: center;" placeholder="Search" type="text"
            @input="updateSearch" @change="updateSearch">
    </div>
    <div class="smargin2"></div>
    <div class="lbox">
      <div class="flex">
        <div class="wrapper50 smargin2">
          <u><a v-bind:class="sortOption['loc']"
            v-on:click="sort('loc')">{{ col }}</a></u>
        </div>
        <div style="text-align:center;" :class="sortBG[show_l[1]]">
          <u><a v-bind:class="sortOption[show_l[1]]"
            v-on:click="sort(show_l[1])">{{show_l[0]}}</a></u>
        </div>
        <div style="text-align:center;" :class="sortBG[show_r[1]]">
          <u><a v-bind:class="sortOption[show_r[1]]"
            v-on:click="sort(show_r[1])">{{show_r[0]}}</a></u>
        </div>
      </div>
      <casedata v-for="place in countries"
        v-bind:dest="col.toLowerCase()"
        v-bind:show_l="show_l[1]"
        v-bind:show_r="show_r[1]"
        v-bind:commas="commas"
        v-bind:sortbg="sortBG"
        v-bind:place="place">
      </casedata>
    </div>
    <bottom></bottom>
  </div>
  `

const components = {}

components.casedata =
{
   props: ['place', 'dest', 'show_l', 'show_r', 'commas', 'sortbg'],
   template:
   `
   <div class="flex">
      <div :class="sortbg['loc']">
        <img height="20" width="30" v-bind:src="place.url"/>
        &nbsp;
        <a :href="'index.html#/single/' + dest + '/' + place[dest]">
          {{place.loc}}
        </a>
      </div>
      <div style="text-align:center;" :class="sortbg[show_l]">
        {{ commas(place[show_l]) }}
      </div>
      <div style="text-align:center;" :class="sortbg[show_r]">
        {{ commas(place[show_r]) }}
      </div>
   </div>
   `
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

