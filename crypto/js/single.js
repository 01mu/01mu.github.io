const Single = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div class="hm">
    <div class="row">
      <div class="col-sm-10">
        <div v-if="fullVisible" class="singleinfo centered">
          <img height="20" width="20"
            onerror="this.style.display='none'"
            :src="this.coinInfo['icon']"/>&nbsp;
          <b>{{ coin }}</b>
        </div>
        <schart></schart>
        <div style="margin: 16px;"></div>
        <div v-if="fullVisible" class="d-none d-sm-block">
          <div class="input-group">
            <button class="btn btn-outline-primary" v-on:click="setMinute()">
              Minutes</button>&nbsp;
            <button class="btn btn-outline-primary" v-on:click="setHourly()">
              Hours</button>&nbsp;
            <button class="btn btn-outline-primary" v-on:click="setDaily()">
              Days</button>&nbsp;
            <button class="btn btn-outline-primary" v-on:click="setWeekly()">
              Weeks</button>&nbsp;
            <button class="btn btn-outline-primary" v-on:click="setMonthly()">
              Months</button>&nbsp;
            <input v-on:keyup.enter="update()" placeholder="Span"
              v-model="limit"
              class="form-control">&nbsp;
            <button class="btn btn-outline-primary" v-on:click="update()">
              Set span
            </button>
          </div>
        </div>
        <div v-if="fullVisible" class="d-block d-sm-none">
          <div class="col-sm-12" style="text-align: center;">
            <button class="singlebutton btn btn-outline-primary"
              v-on:click="setMinute()">
              Minutes</button>
            <button class="singlebutton btn btn-outline-primary"
              v-on:click="setHourly()">
              Hours</button>
            <button class="singlebutton btn btn-outline-primary"
              v-on:click="setDaily()">
              Days</button>
            <button class="singlebutton btn btn-outline-primary"
              v-on:click="setWeekly()">
              Weeks</button>
            <button class="singlebutton btn btn-outline-primary"
              v-on:click="setMonthly()">
              Months</button>
            <div style="margin: 8px;"></div>
            <div class="input-group">
              <input v-on:keyup.enter="update()" placeholder="Span"
                v-model="limit"
                class="form-control">&nbsp;
              <button class="btn btn-outline-primary" v-on:click="update()">
                Set span
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="fullVisible" class="col-sm-2">
        <div class="singleinfo" style="text-align: center;">
          <b>Info</b>
        </div>
        <div class="singleinfo">
          <img src="img/cmc.png" height="16" width="16">
          Open: {{ coinInfo.open }}
        </div>
        <div class="singleinfo">
          <img src="img/cmc.png" height="16" width="16">
          Close: {{ coinInfo.close }}
        </div>
        <div class="singleinfo">
          <img src="img/cmc.png" height="16" width="16">
          Change: {{ coinInfo.change }}
        </div>
        <div class="singleinfo">
          <img src="img/cmc.png" height="16" width="16">
          High: {{ coinInfo.high }}
        </div>
        <div class="singleinfo">
          <img src="img/cmc.png" height="16" width="16">
          Low: {{ coinInfo.low }}
      </div>
      <div class="singleinfo" style="text-align: center;">
        <b>Recent Coins</b>
      </div>
      <template v-for="(coin, index) in recentCoins">
        <div class="singleinfo" style="text-align: center;">
          <a :href="'index.html#/single/' + recentCoins[index]">
            <img height="20" width="20"
              style="cursor: pointer;"
              :src="recentIcons[index]"/>
          </a>
          &nbsp;
          <a :href="'index.html#/single/' + recentCoins[index]">
            {{ recentCoins[index] }}
          </a>
        </div>
      </template>
     </div>
    </div>
  </div>
  `,
  components: {
    schart: {
      template:
      `<div style="display: block;"><canvas id="coinChart"></canvas></div>`
    }
  },
  data() {
    return {
      navInfo: [],
      fullVisible: false,
      coinChart: null,
      showBar: true,
      coinHistoryDisplay: 6,
      coin: 'BTC',
      limit: 30,
      lastMode: '',
      recentCoins: [],
      recentIcons: [],
      coinInfo: {'icon' : '', 'open': 0, 'close': 0, 'high': 0, 'low': 0,
        'change': 0},
    }
  },
  created() {
    this.coin = this.$route.params.id
    this.navbar = getNavbar('coins')

    if(localStorage.getItem('chart_limit') == undefined) this.limit = 30
    else this.limit = localStorage.getItem('chart_limit')

    navbarInfo(this.navInfo)
    this.update()
  },
  methods: {
    setMinute() {
      const url = 'https://min-api.cryptocompare.com/data/histominute' +
        '?fsym=' + this.coin + '&tsym=USD&limit=' + this.limit +
        '&aggregate=1&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Minutes)')
      localStorage.setItem('chart_mode', 'minute')
    },
    setHourly() {
      const url = 'https://min-api.cryptocompare.com/data/histohour?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=1&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Hours)')
      localStorage.setItem('chart_mode', 'hour')
    },
    setDaily() {
      const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=1&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' (Days)')
      localStorage.setItem('chart_mode', 'day')
    },
    setWeekly() {
      const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=7&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Weeks)')
      localStorage.setItem('chart_mode', 'week')
    },
    setMonthly() {
      const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=30&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Months)')
      localStorage.setItem('chart_mode', 'month')
    },
    setChart(dataset, type) {
      if(this.coinChart == null) {
        const single = this
        const ctx = document.getElementById('coinChart').getContext('2d')

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
                display:false
              }
            }],
            yAxes: [{
              gridLines: {
                display:false
              }
            }]
          }
        }

        const ch = new Chart(ctx, {
          type: 'candlestick',
          data: {
            datasets: [{
              label: single.coin + ' ' + type,
              data: dataset
            }]
          },
          options: options
        })

        if(screen.width <= 600) ch.canvas.parentNode.style.height = '400px'
        else ch.canvas.parentNode.style.height = '500px'

        this.coinChart = ch
      } else {
        this.coinChart.data.datasets[0].label = this.coin + ' ' + type
        this.coinChart.data.datasets[0].data = dataset
        this.coinChart.update()
      }

      $('html, body').animate({ scrollTop: 0 }, 'fast')
    },
    upaux(url, type) {
      const ctx = this

      $.getJSON(url, (json) => {
        const response = json['Response']
        var dataset = []
        var highest = 0
        var lowest = Number.MAX_SAFE_INTEGER

        if (response == 'Error')  {
            ctx.coin = 'Error'
            return
        }

        document.title  = 'Crypto | ' + ctx.coin

        for (i in json['Data']) {
          var element = json['Data'][i]
          var point = {};

          point['t'] = luxon.DateTime.fromSeconds(element.time).valueOf()
          point['o'] = element.open
          point['h'] = element.high
          point['l'] = element.low
          point['c'] = element.close

          dataset.push(point)

          highest = Math.max(element.high, highest)
          lowest = Math.min(element.low, lowest)
        }

        ctx.coinInfo['open'] = json['Data'][0].high
        ctx.coinInfo['close'] = json['Data'][json['Data'].length - 1].high
        ctx.setCoinInfo(highest, lowest)
        ctx.setChart(dataset, type)
        ctx.updateCoinHistory()
        ctx.setRecentCoins()
        ctx.showBar = false
        ctx.fullVisible = true
      })
    },
    setCoinInfo(highest, lowest) {
      this.coinInfo['change'] = this.getChange(this.coinInfo['close'],
        this.coinInfo['open'])
      this.coinInfo['high'] = '$' + commas(highest.toFixed(2))
      this.coinInfo['low'] = '$' + commas(lowest.toFixed(2))
      this.coinInfo['open'] = '$' + commas(this.coinInfo['open'].toFixed(2))
      this.coinInfo['close'] = '$' + commas(this.coinInfo['close'].toFixed(2))
    },
    getChange(current, previous) {
      var v = (Math.abs(current - previous) / previous) * 100

      if (current === previous || previous === 0) return 0

      if (current < previous) v = v.toFixed(2) * -1
      else v = '+' + v.toFixed(2)

      return v + '%'
    },
    setRecentCoins() {
      const ctx = this

      this.recentIcons = []
      this.recentCoins = JSON.parse(localStorage.getItem('coin_history'))
        .reverse()

      this.recentCoins.forEach((element) => {
        var icon = 'https://01mu.bitnamiapp.com/' +
          'graphics/crypto/' + element.toLowerCase() + '.png'

        ctx.recentIcons.push(icon)
      })
    },
    updateCoinHistory() {
      var i = 1
      var oldHis = JSON.parse(localStorage.getItem('coin_history'))
      var toStr = []

      if (oldHis == undefined) {
          localStorage.setItem('coin_history', JSON.stringify([this.coin]))
      } else {
        oldHis = JSON.parse(localStorage.getItem('coin_history'))

        if (!oldHis.includes(this.coin)) oldHis.push(this.coin)
        if (oldHis.length > this.coinHistoryDisplay)
            for (i = 1; i < oldHis.length; i++) toStr[i - 1] = oldHis[i]
        else toStr = oldHis

        localStorage.setItem('coin_history', JSON.stringify(toStr))
      }
    },
    update(url, type) {
      localStorage.setItem('chart_limit', this.limit)

      this.coinInfo['icon'] = 'https://01mu.bitnamiapp.com/' +
        'graphics/crypto/' + this.coin.toLowerCase() + '.png'

      switch (localStorage.getItem('chart_mode')) {
        case 'minute': this.setMinute(); break;
        case 'hour': this.setHourly(); break;
        case 'day': this.setDaily(); break;
        case 'week': this.setWeekly(); break;
        case 'month': this.setMonthly(); break;
        default: this.setDaily(); break;
      }
    },
  },
  watch: {
    '$route' (to, from) {
      if (to.matched[0].path == from.matched[0].path) {
        this.coin = this.$route.params.id
        this.update()
        $('html, body').animate({ scrollTop: 0 }, 'fast')
      }
    }
  }
}
