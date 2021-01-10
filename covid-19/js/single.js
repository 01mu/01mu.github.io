const Single = {
  template:
  `
  <comp :destination="navbar"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div class="body col-sm-12">
    <div v-if="fullVisible">
      <div class="boldtitle">
          <img height="40" width="60" :src="icon"/>
          <div class="smargin"></div>
          {{ place }}
          <div class="smargin"></div>
      </div>
      <singledisplay :data="data" icon:="icon" place:="place" :commas="commas">
      </singledisplay>
    </div>
    <canvas id="chart"></canvas>
    <div v-if="fullVisible" class="box">
      <div class="dropdown">
        <button style="background-color: #ebdde1; font-weight: bold;
        color: black; width: 100%;" class="btn btn-secondary dropdown-toggle"
        type="button" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
          {{ picked }}
        </button>
        <div style="text-align: center; width: 100%;" class="dropdown-menu"
          aria-labelledby="dropdownMenuButton">
          <a v-on:click="generateChart('confirmed')" class="dropdown-item">
            Total Confirmed
          </a>
          <a v-on:click="generateChart('deaths')" class="dropdown-item">
            Total Deaths
          </a>
          <a v-on:click="generateChart('new_confirmed')" class="dropdown-item">
            New Confirmed
          </a>
          <a v-on:click="generateChart('new_deaths')" class="dropdown-item">
            New Deaths
          </a>
        </div>
      </div>
      <div v-if="news.length > 0" class="smargin"></div>
      <div v-if="news.length > 0" style="width: 100%;"
        class="btn btn-outline-primary" v-on:click="toggleNews()">
        {{ newsText }}
      </div>
    </div>
    <div v-if="newsToggle">
      <template v-for="(article, index) in news">
        <div class="newsbox overflow">
          <a :href="article.url">{{ article.title }}</a><br>
          <b>{{ article.source }}</b>&nbsp;
          <span style="color: grey;">
            {{ timeConverter(article.published) }}
          </span>
        </div>
      </template>
    </div>
    <bottom v-if="fullVisible"></bottom>
    <div style="padding: 1px;"></div>
  </div>
  `,
  components: {
    singledisplay: {
      props: ['data', 'place', 'icon', 'commas'],
      template:
      `
      <div class="row">
        <div class="col-sm-6">
          <div class="box">
            <b>New Confirmed Cases</b><br>
            {{commas(data[data.length-1].new_confirmed)}}
            ({{data[data.length-1].new_confirmed_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>New Confirmed Deaths</b><br>
            {{commas(data[data.length-1].new_deaths)}}
            ({{data[data.length-1].new_deaths_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>New Confirmed Recoveries</b><br>
            {{commas(data[data.length-1].new_recovered)}}
            ({{data[data.length-1].new_recovered_per.toFixed(2)}}%)
          </div>
        </div>
        <div class="col-sm-6">
          <div class="box">
            <b>Total Confirmed Cases</b><br>
            {{commas(data[data.length-1].confirmed)}}
            ({{data[data.length-1].confirmed_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>Total Confirmed Deaths</b><br>
            {{commas(data[data.length-1].deaths)}}
            ({{data[data.length-1].deaths_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>Total Confirmed Recoveries</b><br>
            {{commas(data[data.length-1].recovered)}}
            ({{data[data.length-1].recovered_per.toFixed(2)}}%)
          </div>
        </div>
      </div>
      `
    }
  },
  data() {
    return {
      url: 'https://01mu.bitnamiapp.com/covid-19/',
      place: '',
      type: '',
      data: [{'new_confirmed': 0, 'new_confirmed_per': 0,
        'new_deaths': 0, 'new_deaths_per': 0,
        'new_recovered': 0, 'new_recovered_per': 0,
        'confirmed': 0, 'confirmed_per': 0,
        'deaths': 0, 'deaths_per': 0,
        'recovered': 0, 'recovered_per': 0}],
      icon: '',
      picked: 'Total Confirmed',
      chart: null,
      chartLoaded: false,
      showBar: true,
      fullVisible: false,
      commas: commas,
      news: [],
      newsToggle: false,
      newsText: 'Show Headlines',
      timeConverter: timeConverter,
    }
  },
  created() {
    this.place = this.$route.params.place.replaceAll("%20", " ")
    this.type = this.$route.params.type

    if (this.$route.params.type == 'state') {
      this.type = 'us'
      this.navbar = getNavbar('states')
    } else this.navbar = getNavbar('countries')

    document.title = 'COVID-19 | ' + this.place
    this.update()
  },
  methods: {
    toggleNews() {
      this.newsToggle ^= 1

      if (this.newsToggle) this.newsText = 'Hide Headlines'
      else  this.newsText = 'Show Headlines'
    },
    generateChart(type) {
      var dataset = [[], []]

      for (p of this.data) {
        dataset[0].push(getTimeString(p['timestamp']))
        dataset[1].push(p[type])
      }

      switch(type) {
        case 'confirmed':
          label = this.picked = 'Total Confirmed'
          break
        case 'deaths':
          label = this.picked = 'Total Deaths'
          break
        case 'new_confirmed':
          label = this.picked = 'New Confirmed'
          break
        default:
          label = this.picked = 'New Deaths'
      }

      label += ' | ' + this.place

      if (screen.width <= 600)
      this.chart.canvas.parentNode.style.height = '400px'
      else
        this.chart.canvas.parentNode.style.height = '500px'

      this.chart.data.labels = dataset[0]
      this.chart.data.datasets[0].label = label
      this.chart.data.datasets[0].data = dataset[1]
      this.chart.update()
    },
    initChart() {
      const ctx = document.getElementById('chart');

      const options = {
        elements: {
          point:{
            radius: 0
          }
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: 'x-axis'
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            },
            gridLines: {
              display: true
            }
          }],
          yAxes: [{
            gridLines: {
              display: true
            }
          }]
        }
      }

      this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              borderColor: "#ab0a12",
              backgroundColor: "#e755ba",
              pointBackgroundColor: "#ab0a12",
              pointBorderColor: "#ab0a12",
              pointHoverBackgroundColor: "#ab0a12",
              pointHoverBorderColor: "#ab0a12",
              backgroundColor: "#fcfcfc",
              fill: true,
              label: 'COVID-19',
              data: []
            }]
          },
          options: options
      })

      this.chartLoaded = true
    },
    getIcon() {
      if (this.type == 'country')
        this.icon = 'https://01mu.bitnamiapp.com/' +
          'graphics/countries/' + countryCode(this.place) + '.PNG'
      else
        this.icon = 'https://01mu.bitnamiapp.com/graphics/states/' +
          replaceAll(this.place.toLowerCase(), " ", "-") + '.png'
    },
    update() {
      const ctx = this

      $.getJSON(this.url + this.type + '/' + this.place + '/0', (json) => {
        if (json.length == 0) {
          ctx.place = "Invalid location"
          return
        }

        ctx.news = json['news']
        ctx.data = json['cases']
        ctx.getIcon()

        if (ctx.place != 'Global') {
          ctx.initChart()
          ctx.generateChart('confirmed')
        }

        for (e of ctx.data) {
          if (e.new_confirmed < 0) e.new_confirmed = 0
          if (e.new_deaths < 0) e.new_deaths = 0
        }

        ctx.fullVisible = true
        ctx.showBar = false
      })
    },
  }
}
