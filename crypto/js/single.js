const Single = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="!isSmall" class="d-sm-block d-none singlebody">
    <div class="row">
      <div v-if="showCMC && fullVisible"  class="col-sm-2">
        <cmcinfo :commas="commas" :coinCMC="coinCMC"></cmcinfo>
      </div>
      <div :class="centerClass">
        <schart :fullVisible="fullVisible" :coinInfo="coinInfo"
           :coin="coin" :coinName="coinName"></schart>
        <div style="margin: 16px;"></div>
        <div v-if="fullVisible">
          <buttons :ctx="this"></buttons>
        </div>
      </div>
      <pricerecent :coinInfo="coinInfo" :chartType="chartType"
        :coinList="coinList" :fullVisible="fullVisible"></pricerecent>
    </div>
    <bottom v-if="fullVisible"></bottom>
  </div>

  <div v-else class="d-sm-none singlebody">
    <div class="row">
      <div :class="centerClass">
        <schart :fullVisible="fullVisible" :coinInfo="coinInfo"
           :coin="coin"></schart>
        <div style="margin: 16px;"></div>
        <div v-if="fullVisible">
          <buttons :ctx="this"></buttons>
        </div>
      </div>
      <pricerecent :coinInfo="coinInfo" :coinList="coinList" :chartType="chartType"
        :fullVisible="fullVisible"></pricerecent>
      <div v-if="showCMC && fullVisible"  class="col-sm-2">
        <cmcinfo :commas="commas" :coinCMC="coinCMC" :small="isSmall"></cmcinfo>
      </div>
    </div>
    <bottom v-if="fullVisible"></bottom>
  </div>
  `,
  components: {
    pricerecent: {
      props: ['coinInfo', 'coinList', 'fullVisible', 'chartType'],
      template:
      `
        <div v-if="fullVisible" class="col-sm-2">
          <div v-if="chartType == 'Price'">
            <div class="singlebordertop singleinfo singletitle" style="text-align: center;">
              <b>Price</b>
            </div>
            <priceinfo :name="'Open'" :fig="coinInfo.open"></priceinfo>
            <priceinfo :name="'Close'" :fig="coinInfo.close"></priceinfo>
            <div class="singleinfo">
              Change: <b><span :style="coinInfo.color">
                {{ coinInfo.change }}</span></b>
            </div>
            <priceinfo :name="'High'" :fig="coinInfo.high"></priceinfo>
            <priceinfo :name="'Low'" :fig="coinInfo.low"></priceinfo>
          </div>
          <div v-else>
            <div class="singlebordertop singleinfo singletitle" style="text-align: center;">
              <b>Volume</b>
            </div>
            <volinfo :name="'Max Volume'" :fig="coinInfo.maxvol"></volinfo>
            <volinfo :name="'Min Volume'" :fig="coinInfo.minvol"></volinfo>
            <volinfo :name="'Average Volume'" :fig="coinInfo.avgvol"></volinfo>
          </div>
          <div class="singleinfo singletitle" style="text-align: center;">
            <b>Recent Coins</b>
          </div>
          <template v-for="(coin, index) in coinList">
            <div :class="coin.selected">
              <a :href="'index.html#/single/' + coin.symbol">
                <img height="20" width="20"
                  style="cursor: pointer;"
                  onerror="this.src='https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'"
                  :src="coin.icon"/>
              </a>
              &nbsp;
              <a :href="'index.html#/single/' + coin.symbol">
                {{ coin.symbol }}
              </a>
            </div>
          </template>
          <div class="singletitle singleinfo" style="text-align: center;">
            <b>More</b>
          </div>
          <div class="singleinfo">
          <a :href="'index.html#/ath/' + coinInfo.symbol">
            <b>[{{ coinInfo.symbol }} ATH History]</b>
          </a>
          </div>
        </div>
      `,
      components: {
        volinfo: {
          props: ['name', 'fig'],
          template:
          `
            <div class="singleinfo">
              {{ name }}<br> <span class="figure">{{ fig }}</span>
            </div>
          `
        },
        priceinfo: {
          props: ['name', 'fig'],
          template:
          `
            <div class="singleinfo">
              {{ name }}: <span class="figure">{{ fig }}</span>
            </div>
          `
        }
      },
    },
    cmcinfo: {
      props: ['commas', 'coinCMC', 'small'],
      template:
      `
        <div class="singlebordertophide singleinfo singletitle"
          style="text-align: center;">
          <b>Market</b>
        </div>
        <mi :small="small" :name="'Rank'" :fig="coinCMC.rank"></mi>
        <mi :small="small" :name="'USD Price'" :fig="'$' + commas(coinCMC.price_usd.toFixed(3))"></mi>
        <mi :small="small" :name="'BTC Price'" :fig="coinCMC.price_btc"></mi>
        <mi :small="small" :name="'ETH Price'" :fig="coinCMC.price_eth"></mi>
        <mi :small="small" :name="'24H Volume'" :fig="'$' + commas(coinCMC.volume_24h)"></mi>
        <mi :small="small" :name="'Total Supply'" :fig="commas(coinCMC.total_supply)"></mi>
        <mi :small="small" :name="'Circulating Supply'" :fig="commas(coinCMC.circulating_supply)"></mi>
        <mi :small="small" :name="'Max Supply'" :fig="commas(coinCMC.max_supply)"></mi>
        <mi :small="small" :name="'Market Cap'" :fig="'$' + commas(coinCMC.market_cap)"></mi>
        <mi :small="small" :name="'Market Cap %'" :fig="coinCMC.market_cap_percent + '%'"></mi>
      `,
      components: {
        mi: {
          props: ['name', 'fig', 'small'],
          template:
          `
            <div v-if="small" class="singleinfo">
              <div class="flex">
                <div class="athpointl wrapper50">
                  {{ name }}
                </div>
                <div class="athpointr wrapper50">
                  <span class="figure">{{ fig }}</span>
                </div>
              </div>
            </div>
            <div v-else class="singleinfo">
              {{ name }}<br><span class="figure">{{ fig }}</span>
            </div>
          `
        }
      },
    },
    schart: {
      props: ['fullVisible', 'coinInfo', 'coin', 'coinName'],
      template:
      `
        <div v-if="fullVisible" class="singleinfo centered">
          <img height="20" width="20"
            onerror="this.src='https://01mu.bitnamiapp.com/graphics/crypto/BTC.png'"
            :src="coinInfo['icon']"/>&nbsp;
          <b>{{ coinName }} {{ coin }}</b>
        </div>
        <div id="chartContainer" style="display: block;"><canvas id="coinChart"></canvas></div>
      `
    },
    buttons: {
      props: ['ctx'],
      template:
      `
       <div class="input-group">
        <input v-on:keyup.enter="ctx.update()" placeholder="Span"
          v-model="ctx.limit"
          class="form-control">
          <div class="input-group-append">
            <button class="btn btn-outline-primary" v-on:click="ctx.update()">
              Set span
            </button>
          </div>
        </div>
        <div style="margin-top: 16px;"></div>
        <div class="flex">
          <div class="wrapper50">
            <div class="dropdown">
              <button style="width: 100%;"
              class="btn btn-outline-primary dropdown-toggle"
              type="button" id="dropdownMenuButton" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
                {{ ctx.chartType }}
              </button>
              <div style="text-align: center; width: 100%;"
                class="dropdown-menu"
                aria-labelledby="dropdownMenuButton">
                <a v-on:click="ctx.toggleType('price')" class="dropdown-item">
                  Price
                </a>
                <a v-on:click="ctx.toggleType('volume')" class="dropdown-item">
                  Volume
                </a>
              </div>
            </div>
          </div>&nbsp;
          <div class="wrapper50">
            <div class="dropdown">
              <button style="width: 100%;"
              class="btn btn-outline-primary dropdown-toggle"
              type="button" id="dropdownMenuButton" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
                {{ ctx.mode }}
              </button>
              <div style="text-align: center; width: 100%;"
                class="dropdown-menu"
                aria-labelledby="dropdownMenuButton">
                <a v-on:click="ctx.setMinute()" class="dropdown-item">
                  Minutes
                </a>
                <a v-on:click="ctx.setHourly()" class="dropdown-item">
                  Hours
                </a>
                <a v-on:click="ctx.setDaily()" class="dropdown-item">
                  Days
                </a>
                <a v-on:click="ctx.setWeekly()" class="dropdown-item">
                  Weeks
                </a>
                <a v-on:click="ctx.setMonthly()" class="dropdown-item">
                  Months
                </a>
              </div>
            </div>
          </div>
          <br><br>
        </div>
      `
    }
  },
  data() {
    return {
      coinName: '',
      navInfo: [],
      fullVisible: false,
      coinChart: null,
      showBar: true,
      coinHistoryDisplay: 10,
      coinCMC: {},
      loadedReqs: 0,
      coin: 'BTC',
      coinList: [],
      limit: 30,
      mode: '',
      showCMC: false,
      centerClass: 'col-sm-8',
      recentCoins: [],
      singleURL: 'https://01mu.bitnamiapp.com/crypto/coin/',
      recentIcons: [],
      coinInfo: {'icon' : '', 'open': 0, 'close': 0, 'high': 0, 'low': 0,
        'change': 0},
      commas: commas,
      isSmall: false,
      chartType: 'Price',
      typeTogge: false,
    }
  },
  created() {
    this.coin = this.$route.params.id.toUpperCase()
    this.navbar = getNavbar('coins')

    if(screen.width <= 600) this.isSmall = true

    if(localStorage.getItem('chart_limit') == undefined) this.limit = 30
    else this.limit = localStorage.getItem('chart_limit')

    if(localStorage.getItem('chart_type') == undefined)
      this.chartType = 'Price'
    else
      this.chartType = localStorage.getItem('chart_type')

    navbarInfo(this.navInfo)
    this.update()
  },
  methods: {
    toggleType(type) {
      if (type == 'volume') {
        localStorage.setItem('chart_type', 'Volume')
        this.chartType = 'Volume'
      } else {
        localStorage.setItem('chart_type', 'Price')
        this.chartType = 'Price'
      }

      document.getElementById("chartContainer").innerHTML =
        '<canvas id="coinChart"></canvas>';

      this.typeToggle = true

      this.update()
    },
    setMinute() {
      const url = 'https://min-api.cryptocompare.com/data/histominute' +
        '?fsym=' + this.coin + '&tsym=USD&limit=' + this.limit +
        '&aggregate=1&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Minutes)')
      localStorage.setItem('chart_mode', 'minute')
      this.mode = 'Minutes'
    },
    setHourly() {
      const url = 'https://min-api.cryptocompare.com/data/histohour?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=1&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Hours)')
      localStorage.setItem('chart_mode', 'hour')
      this.mode = 'Hours'
    },
    setDaily() {
      const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=1&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' (Days)')
      localStorage.setItem('chart_mode', 'day')
      this.mode = 'Days'
    },
    setWeekly() {
      const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=7&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Weeks)')
      localStorage.setItem('chart_mode', 'week')
      this.mode = 'Weeks'
    },
    setMonthly() {
      const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
        this.coin + '&tsym=USD&limit=' + this.limit + '&aggregate=30&e=CCCAGG'

      this.upaux(url, '(' + this.limit + ' Months)')
      localStorage.setItem('chart_mode', 'month')
      this.mode = 'Months'
    },
    initChart(dataset, type) {
      const single = this
      const ctx = document.getElementById('coinChart').getContext('2d')

      var ds = dataset.prices
      var chType = 'candlestick'
      var dataLabel = 'Price'

      if (this.chartType == 'Volume') {
        ds = dataset.volume
        chType = 'bar'
        dataLabel = 'Volume'
      }

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
            ticks: {
                display: false
            },
            gridLines: {
              drawBorder: false,
              display: true
            }
          }]
        }
      }

      const ch = new Chart(ctx, {
        type: chType,
        data: {
          labels: dataset.labels,
          datasets: [{
            backgroundColor: "#b2d8eb",
            label: single.coin + ' ' + dataLabel + ' ' + type,
            data: ds,
          }]
        },
        options: options
      })

      if(screen.width <= 600) ch.canvas.parentNode.style.height = '400px'
      else ch.canvas.parentNode.style.height = '500px'

      this.coinChart = ch
    },
    setChart(dataset, type) {
      if(this.coinChart == null) {
        this.initChart(dataset, type)
      } else {
        if (this.typeToggle) {
          this.initChart(dataset, type)
          this.typeToggle = false
        } else {
          var ds = dataset.prices
          var chType = 'candlestick'
          var dataLabel = 'Price'

          if (this.chartType == 'Volume') {
            ds = dataset.volume
            chType = 'bar'
            dataLabel = 'Volume'
          }

          this.coinChart.data.datasets[0].data = ds
          this.coinChart.data.datasets[0].label =
            this.coin + ' ' + dataLabel + ' ' + type

          this.coinChart.type = chType
          this.coinChart.data.labels = dataset.labels
          this.coinChart.update()
        }
      }

      if(screen.width <= 600) $('html, body').animate({ scrollTop: 0 }, 'fast')
    },
    upaux(url, type) {
      const ctx = this

      $.getJSON(url, (json) => {
        const response = json['Response']
        var dataset = []

        dataset.prices = []
        dataset.volume = []
        dataset.labels = []

        var volumeSum = 0
        var coinInfo = {'highest': 0, 'lowest': Number.MAX_SAFE_INTEGER,
            'minvol': 0, 'maxvol': 0, 'avgvol': 0}

        if (response == 'Error')  {
            ctx.coin = 'Error'
            return
        }

        document.title  = 'Crypto | ' + ctx.coin

        for (i in json['Data']) {
          var element = json['Data'][i]
          var point = {}

          volumeSum += element.volumeto

          point['t'] = luxon.DateTime.fromSeconds(element.time).valueOf()
          point['o'] = element.open
          point['h'] = element.high
          point['l'] = element.low
          point['c'] = element.close

          dataset.prices.push(point)
          dataset.volume.push(element.volumeto)
          dataset.labels.push(getTimeString(element.time))

          coinInfo['maxvol'] = Math.max(element.volumeto, coinInfo['maxvol'])
          coinInfo['minvol'] = Math.min(element.volumeto, coinInfo['maxvol'])

          coinInfo['highest'] = Math.max(element.high, coinInfo['highest'])
          coinInfo['lowest'] = Math.min(element.low, coinInfo['lowest'])
        }

        ctx.coinInfo['open'] = json['Data'][0].high
        ctx.coinInfo['close'] = json['Data'][json['Data'].length - 1].high
        ctx.coinInfo['avgvol'] =
          '$' + commas((volumeSum / json['Data'].length).toFixed(2))

        ctx.setCoinInfo(coinInfo)

        ctx.setChart(dataset, type)
        ctx.updateCoinHistory()
        ctx.setRecentCoins()
        ctx.showBar = false
        ctx.loadInc()
        //ctx.fullVisible = true
      })
    },
    setCoinInfo(ci) {
      const current = this.coinInfo['close']
      const previous = this.coinInfo['open']

      if (current >= previous) this.coinInfo['color'] =  'color: green;'
      else this.coinInfo['color'] = 'color: red;'

      this.coinInfo['change'] = this.getChange(current, previous)
      this.coinInfo['high'] = '$' + commas(ci.highest.toFixed(3))
      this.coinInfo['low'] = '$' + commas(ci.lowest.toFixed(3))
      this.coinInfo['minvol'] = '$' + commas(ci.minvol.toFixed(2))
      this.coinInfo['maxvol'] = '$' + commas(ci.maxvol.toFixed(2))
      this.coinInfo['open'] = '$' + commas(this.coinInfo['open'].toFixed(3))
      this.coinInfo['close'] = '$' + commas(this.coinInfo['close'].toFixed(3))
      this.coinInfo['symbol'] = this.coin
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
          'graphics/crypto/' + element + '.png'

        ctx.recentIcons.push(icon)
      })

      this.coinList = []

      for (i in this.recentCoins) {
        var put = {'symbol': this.recentCoins[i], 'icon': this.recentIcons[i]}

        if (this.coin == put.symbol) put.selected = 'recentcoinsel'
        else put.selected = 'recentcoin'

        this.coinList.push(put)
      }

    },
    updateCoinHistory() {
      var i = 1
      var oldHis = JSON.parse(localStorage.getItem('coin_history'))
      var toStr = []

      if (oldHis == undefined) {
          locallStorage.setItem('coin_history', JSON.stringify([this.coin]))
      } else {
        oldHis = JSON.parse(localStorage.getItem('coin_history'))

        if (!oldHis.includes(this.coin)) oldHis.push(this.coin)
        if (oldHis.length > this.coinHistoryDisplay)
            for (i = 1; i < oldHis.length; i++) toStr[i - 1] = oldHis[i]
        else toStr = oldHis

        localStorage.setItem('coin_history', JSON.stringify(toStr))
      }
    },
    loadInc() {
      if (++this.loadedReqs == 2) this.fullVisible = true
    },
    update(url, type) {
      localStorage.setItem('chart_limit', this.limit)

      this.coinName = ''
      this.loadedReqs = 0
      this.coinInfo['icon'] = 'https://01mu.bitnamiapp.com/' +
        'graphics/crypto/' + this.coin + '.png'

      document.querySelector("link[rel*='icon']").href = this.coinInfo['icon']


      if (!this.typeToggle) {
        console.log(1)
        $.getJSON(this.singleURL + this.coin, (json) => {
          if (json.length == 0) {
            this.centerClass = 'col-sm-10'
            this.showCMC = false
          } else {
            this.coinName = json[0].name + ' | '
            this.centerClass = 'col-sm-8'
            this.showCMC = true
            this.coinCMC = json[0]
          }

          this.loadInc()
        })
      }

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
        if (screen.width <= 600)
          $('html, body').animate({ scrollTop: 0 }, 'fast')
      }
    }
  }
}
