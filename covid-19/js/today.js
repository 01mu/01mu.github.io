const Today = {
  template:
  `
  <comp :destination="navbar"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body row">
    <tmargin :loc="'Global'"
      :dest="'country'"
      :data_confirmed="globalConfirmed"
      :data_deaths="globalDeaths"
      :stats="globalStats"
      :updated="lastUpdate['global']"
      :url="'https://01mu.bitnamiapp.com/graphics/countries/GLOBAL.PNG'">
    </tmargin>
    <tmargin :loc="'United States'"
      :dest="'state'"
      :data_confirmed="usConfirmed"
      :data_deaths="usDeaths"
      :stats="usStats"
      :updated="lastUpdate['us']"
      :url="'https://01mu.bitnamiapp.com/graphics/countries/US.PNG'">
    </tmargin>
    <bottom></bottom>
  </div>
  `,
  components: {
    tmargin: {
      props: ['url', 'data_confirmed', 'data_deaths', 'stats', 'loc', 'dest',
        'updated'],
      template:
      `
      <div class="col-sm-6">
        <div class="box">
        <div class="boxheader">
          <div class="boldtitle">
            <img style="margin-top: 5px;" height="40" width="60" :src="url"/>
            <div class="flagmargin"></div>
            {{ loc }}
          </div>
        </div>
        <div class="smargin"></div>
        {{ stats.new_confirmed }} New Confirmed Cases<br>
        {{ stats.new_deaths }} New Deaths
        <div class="smargin"></div>
        {{ stats.confirmed }} Total Confirmed Cases<br>
        {{ stats.deaths }} Total Deaths<br>
        </div>
        <div class="box">
          <div class="boxheader"><b>New Confirmed Cases<br>({{ loc }})</b></div>
          <div class="smargin"></div>
            <tdata v-for="place in data_confirmed"
              :count="place.new_confirmed"
              :per="place.new_confirmed_per"
              :name="place[dest]"
              :dest="dest"
              :flag="place.url"></tdata>
        </div>
        <div class="box">
          <div class="boxheader"><b>New Deaths<br>({{ loc }})</b></div>
          <div class="smargin"></div>
            <tdata v-for="place in data_deaths"
              :count="place.new_deaths"
              :per="place.new_deaths_per"
              :name="place[dest]"
              :dest="dest"
              :flag="place.url"></tdata>
        </div>
        <div class="smalltext">
        <p style="color: grey">{{ loc }} last updated on {{ updated }}</p>
        </div>
      </div>
      `,
      components: {
        tdata: {
         props: ['name', 'count', 'per', 'flag', 'dest'],
         template:
         `
         <div class="flex">
            <div class="wrapper33">
              <a :href="'index.html#/single/' + dest + '/' + name">
                <img height="20" width="30" style="cursor: pointer;"
                  :title="name"
                  :src="flag"/>
              </a>
            </div>
            <div class="wrapper33">{{ count }}</div>
            <div class="wrapper33">
              {{ Number.parseFloat(per).toFixed(2) }}%
            </div>
         </div>
         `
        }
      }
    }
  },
  data() {
    return {
      url: 'https://01mu.bitnamiapp.com/covid-19/today',
      globalStats: [],
      usStats: [],
      globalConfirmed: [],
      globalDeaths: [],
      usConfirmed: [],
      usDeaths: [],
      lastUpdate: [],
      fullVisible: false,
      showBar: true,
    }
  },
  created() {
    const ctx = this

    document.title = 'COVID-19 | Today'
    this.navbar = getNavbar('today')

    $.getJSON(this.url, (json) => {
      ctx.globalStats = json.individual.global
      ctx.usStats = json.individual.united_states
      ctx.globalConfirmed = json.global.confirmed
      ctx.globalDeaths = json.global.deaths
      ctx.usConfirmed = json.united_states.confirmed
      ctx.usDeaths = json.united_states.deaths
      ctx.lastUpdate['global'] = json.global.last_update
      ctx.lastUpdate['us'] = json.united_states.last_update

      ctx.format()
      ctx.fullVisible = true
      ctx.showBar = false
    })
  },
  methods: {
    format() {
      for (v of ['global', 'us'])
        this.lastUpdate[v] = timeConverter(this.lastUpdate[v])

      for (v of ['new_confirmed', 'confirmed', 'new_deaths', 'deaths']) {
        this.globalStats[v] = commas(this.globalStats[v])
        this.usStats[v] = commas(this.usStats[v])
      }

      for (list of [this.globalConfirmed, this.usConfirmed])
        list.map((a) => {
          a.new_confirmed = commas(a.new_confirmed)
        });

      for (list of [this.globalDeaths, this.usDeaths])
        list.map((a) => {
          a.new_deaths = commas(a.new_deaths)
        });

      [this.globalConfirmed, this.globalDeaths].map((a) => {
        a.map((element) => {
          element.url = 'https://01mu.bitnamiapp.com/' +
            'graphics/countries/' + countryCode(element.country) + '.PNG'
        })
      });

      [this.usConfirmed, this.usDeaths].map((a) => {
        a.map((element) => {
          element.url = 'https://01mu.bitnamiapp.com/' +
            'graphics/states/' +
            replaceAll(element.state.toLowerCase(), " ", "-") + '.png'
        })
      });
    },
  }
}
