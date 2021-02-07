const HeatMap = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div class="bigger" v-if="fullVisible">
    <table class="hmtable">
      <thead>
        <tr>
          <th></th>
          <template v-for="(date, index) in dates">
            <th style="text-align: center;" v-if="small && index > 16">
              <span class="figure">{{ date.date }}</span>
            </th>
            <th style="text-align: center;" v-else-if="!small && index > 4">
              <span class="figure">{{ date.date }}</span>
            </th>
          </template>
        </tr>
      </thead>
      <tbody class="table">
        <template v-for="(hm, index) in heatmap">
          <tr>
            <td style="text-align: center;">
              <a :href="'index.html#/single/' + hm[0].symbol">
                <img height="20" width="20"
                  style="cursor: pointer;"
                  :src="hm[0].icon"/>
              </a>
            </td>
            <template v-for="(coin, index) in hm">
              <td class="hmtd" v-if="small && index > 16" :style="coin.color">
                {{ coin.difference }}
              </td>
              <td class="hmtd" v-else-if="!small && index > 4"
                :style="coin.color">
                {{ coin.difference }}
              </td>
            </template>
          </tr>
        </template>
        <tr class="ave" v-if="showAve">
          <td class="ave"><b>μ</b></td>
          <template v-for="(ave, index) in averages">
            <td v-if="small && index > 16" style="background-color: #b3e0ff;">
              {{ ave }}
            </td>
            <td v-else-if="!small && index > 4"
              style="background-color: #b3e0ff;">
              {{ ave }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 16px;">
      <button :disabled="loadingText == 'Loading...'"
        class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
        {{ loadingText }}
      </button>
    </div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      navInfo: [],
      fullVisible: false,
      showBar: true,
      url: 'https://01mu.bitnamiapp.com/crypto/heatmap/',
      heatmap: [],
      page: 0,
      dates: [],
      lastUpdated: '',
      loadingText: 'Load more',
      small: false,
      averages: [],
      showAve: false,
    }
  },
  created() {
    const ctx = this
    document.title = 'Crypto | Heat Map'

    document.querySelector("link[rel*='icon']").href =
      'https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'

    if(screen.width <= 600) this.small = true

    $.getJSON(this.url + this.page, (json) => {
      json['heat_map'][0].forEach((element) => {
        const date = new Date(element.time * 1000)
        const d = (date.getMonth() + 1) + '/' + date.getDate()

        ctx.dates.push({'date': d, 'style': 'hidden-xs'})
      })

      ctx.getAverages(json['heat_map'])
      ctx.formatHM(json['heat_map'])
      ctx.setColors(json['heat_map'])
      ctx.heatmap = json['heat_map']

      ctx.showBar = false
      ctx.fullVisible = true

      ctx.lastUpdated = 'Last updated ' +
        since(json.last_update_heat_map.input_value)
    })

    this.navbar = getNavbar('heatmap')
    navbarInfo(this.navInfo)
  },
  methods: {
    formatHM: (hm) => {
      hm.forEach((coin) => {
        coin[0].icon = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + coin[0].symbol + '.png'
      })

      hm.forEach((coin) => {
        coin.forEach((element) => {
          element.difference = element.difference.toFixed(2)

          if (element.difference > 0)
            element.difference = '+' + element.difference
        })
      })
    },
    getColor(diff) {
      switch (true) {
        case (diff < 0 && diff > -.5): color = '#ffc2b3;'; break;
        case (diff <= -.5 && diff > -1): color = '#ffad99;'; break;
        case (diff <= -1 && diff > -2): color = '#ff9980;'; break;
        case (diff <= -2 && diff > -3): color = '#ff8566;'; break;
        case (diff <= -3): color = '#ff704d;'; break;
        case (diff >= 0 && diff < .5): color = '#b3ffcc;'; break;
        case (diff >= .5 && diff < 1): color = '#99ffbb;'; break;
        case (diff >= 1 && diff < 2): color = '#80ffaa;'; break;
        case (diff >= 2 && diff < 3): color = '#66ff99;'; break;
        default: color = '#66ff99;'
      }

      return 'text-align: center; background-color:' + color
    },
    setColors(hm) {
      const heatmap = this;

      hm.forEach((coin) => {
        coin.forEach((element) => {
          element.color = heatmap.getColor(element.difference)
        })
      })
    },
    loadMore() {
      const ctx = this

      this.loadingText = 'Loading...'

      $.getJSON(this.url + ++this.page, (json) => {
        ctx.loadingText = 'Load more'
        ctx.getAverages(json['heat_map'])
        ctx.formatHM(json['heat_map'])
        ctx.setColors(json['heat_map'])
        ctx.heatmap = ctx.heatmap.concat(json['heat_map'])
      })
    },
    getAverages(hm) {
      var totals = []
      var i = 0

      for (i = 0; i < 21; i++) totals[i] = 0

      hm.forEach((coin) => {
        for(var i = 0; i < coin.length; i++)
          totals[i] += coin[i].difference
      })

      for (i = 0; i < 21; i++) {
        totals[i] = (totals[i] / 21).toFixed(2)

        if (totals[i] > 0) totals[i] = '+' + totals[i]
      }

      this.averages = totals
      this.showAve = true
    }
  },
}
