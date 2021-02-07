const Portfolio = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div v-if="fullVisible" class="body">
    <div class="centersm portfoliofigure">
      {{ value }}
      <h5>{{ btcValue }}</h5>
    </div>
    <table class="table">
      <thead class="thead">
        <tr>
          <th scope="col"><span class="figure">Symbol</span></th>
          <th scope="col"><span class="figure">Amount</span></th>
          <th class="d-none d-sm-table-cell" scope="col"><span class="figure">Percentage</span></th>
          <th class="d-none d-sm-table-cell" scope="col"><span class="figure">Value</span></th>
          <th scope="col"><span class="figure">Price</span></th>
          <th class="d-none d-sm-table-cell" scope="col"><span class="figure">Action</span></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(coin, index) in coinDisplay">
          <tr class="portfoliotr">
            <td>
              <a :href="'index.html#/single/' + coin.symbol">
                <img height="20" width="20" :src="coin.icon"
                  style="cursor: pointer;"/>
              </a>
              &nbsp;
              <a :href="'index.html#/single/' + coin.symbol">
                {{ coin.symbol }}
              </a>
              </td>
              <td
                v-on:click="displayXS(coin.symbol)">
                {{ coin.amount }}
              </td>
              <td class="d-none d-sm-table-cell">
                {{ coin.percentage }}
              </td>
              <td class="d-none d-sm-table-cell">
                {{ coin.value }}
              </td>
              <td
                v-on:click="displayXS(coin.symbol)">
                {{ coin.price }}
              </td>
              <td class="d-none d-sm-table-cell">
                <button class="btn btn-outline-success btn-sm"
                  v-on:click="setEdit(coin.symbol)">
                  Edit
                </button>&nbsp;
                <button class="btn btn-outline-danger btn-sm"
                  v-on:click="removeCoin(coin.symbol)">
                  Delete
                </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="portfoliobottom">
      <span class="d-none d-sm-block">
        <div v-if="noticeVisible" class="alert alert-danger" role="alert">
          <b>{{ notice }}</b>
        </div>
        <div class="input-group">
          <input v-on:keyup.enter="confirmCoin()"
            placeholder="Symbol" v-model="coinSymbol" class="form-control">
            &nbsp;
          <input v-on:keyup.enter="confirmCoin()"
            placeholder="Amount" v-model="coinAmount" class="form-control">
            &nbsp;
          <button class="btn btn-outline-primary" v-on:click="confirmCoin()">
            Add coin
          </button>
        </div>
        <span v-if="showEdit">
          <br>
          <div class="input-group">
            <input v-on:keyup.enter="makeEdit()"
              placeholder="New amount" v-model="newAmount"
              class="form-control">
              &nbsp;
            <button class="btn btn-outline-primary" v-on:click="makeEdit()">
              Edit {{ toEdit }}
            </button>
          </div>
        </span>
      </span>
      <div class="d-block d-sm-none mbottom">
        <div v-if="noticeVisible" class="alert alert-danger" role="alert">
          <b>{{ notice }}</b>
        </div>
        <div class="flex">
          <div class="wrapper50">
            <input class="form-control" v-on:keyup.enter="confirmCoin()"
              placeholder="Symbol" v-model="coinSymbol"/>
          </div>&nbsp;
          <div class="wrapper50">
            <input class="form-control" v-on:keyup.enter="confirmCoin()"
              placeholder="Amount" v-model="coinAmount"/>
          </div>
        </div>
        <div style="margin-top: 8px;"></div>
        <button class="btn btn-block btn-outline-primary"
          v-on:click="confirmCoin()">
          Add coin
        </button>
        <div v-if="showEdit" class="box">
          <input class="form-control" v-on:keyup.enter="makeEdit()"
            placeholder="New amount" v-model="newAmount"><br>
          <button class="btn btn-block btn-outline-primary"
            style="background-color:white" v-on:click="makeEdit()">
            Edit {{ toEdit }}
          </button>
        </div>
      </div>
      <div v-if="xsVisible" class="d-block d-sm-none">
        <div class="flex">
          <div class="wrapper50">
            <button class="btn btn-block btn-outline-success"
              v-on:click="setEdit(toEdit)">
              Edit {{ toEdit }}
            </button>
          </div>&nbsp;
          <div class="wrapper50">
            <button class="btn btn-block btn-outline-danger"
              v-on:click="removeCoin(toDelete)">
              Delete {{ toDelete }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      navInfo: [],
      fullVisible: false,
      showBar: true,
      noticeVisible: false,
      value: '',
      btcValue: '',
      coinDisplay: [],
      coinSymbol: '',
      coinAmount: '',
      priceSymbol: '$',
      notice: '',
      showEdit: false,
      toEdit: '',
      toDelete: '',
      xsVisible: false,
      newAmount: '',
      loaded: false,
      timer: null,
    }
  },
  created() {
    const ctx = this
    this.coinTable = new Map()
    this.loaded = localStorage.getItem('loaded')
    navbarInfo(this.navInfo)

    if (!this.loaded) {
      localStorage.setItem('loaded', 1)
      localStorage.setItem('portfolio',
        JSON.stringify({'BTC': 0, 'ETH': 0, 'XRP': 0}))
    }

    this.navbar = getNavbar('portfolio')
    this.updateValue()

    this.timer = setInterval(function() { ctx.updateValue() }, 60000)
  },
  unmounted() {
    clearInterval(this.timer)
  },
  methods: {
    displayXS(symbol) {
      if (screen.width <= 600) {
        if(this.xsVisible && symbol === this.toEdit) this.hideEditDiv()
        else this.xsVisible = true

        this.toEdit = symbol
        this.toDelete = symbol

        $('html, body').animate({scrollTop:$(document).height()}, 'slow')
      }
    },
    confirmCoin() {
      const symbol = this.coinSymbol
      const amount = this.coinAmount
      const ctx = this
      const url = 'https://min-api.cryptocompare.com/data/price?fsym='
        + this.coinSymbol.toUpperCase() + '&tsyms=BTC'

      if (!symbol || !amount || amount < 0 || isNaN(amount)) {
        this.showError("Invalid input")
        return
      }

      $.getJSON(url, (json) => {
        if (json.BTC) ctx.addCoin()
        else ctx.showError("Invalid symbol")
      })
    },
    addCoin() {
      const symbol = this.coinSymbol.toUpperCase()
      const amount = parseFloat(this.coinAmount, 10)
      var add = {symbol: amount}

      if (!this.coinTable.size) {
        add = this.coinTable

        if (add[symbol]) add[symbol] = parseFloat(add[symbol], 10) + amount
        else add[symbol] = amount
      }

      localStorage.setItem('portfolio', JSON.stringify(add))
      this.updateValue()
    },
    setEdit(symbol) {
      if(this.showEdit && symbol === this.toEdit) this.showEdit = false
      else this.showEdit = true

      $('html, body').animate({scrollTop:$(document).height()}, 'slow')

      this.toEdit = symbol
      this.toDelete = symbol
    },
    makeEdit() {
      const amount = parseFloat(this.newAmount, 10)

      if(amount < 0 || isNaN(amount)) {
        this.showError("Invalid input")
        return
      }

      this.coinTable[this.toEdit] = this.newAmount
      this.update(this.coinTable)
      this.hideEditDiv()
    },
    removeCoin(symbol) {
      delete this.coinTable[symbol]
      this.update(this.coinTable)
      this.hideEditDiv()
    },
    showError(text) {
      const ctx = this
      this.notice = text
      this.noticeVisible = 1
      clearInterval(this.timer)
      this.timer = setTimeout(function() { ctx.noticeVisible = 0 }, 1500)
    },
    update(a) {
      localStorage.setItem('portfolio', JSON.stringify(a))
      this.updateValue()
    },
    getSymbols() {
      var symbols = []
      if (this.coinTable) symbols = Object.keys(this.coinTable)
      return symbols
    },
    updateValue() {
      const ctx = this
      this.coinTable = localStorage.getItem('portfolio')

      if (this.coinTable == null) this.coinTable = new Map()
      else this.coinTable = JSON.parse(this.coinTable)

      if (isEmpty(this.coinTable) && !this.loaded) {
        ctx.showBar = false
        return
      }

      const symbols = this.getSymbols()
      const url = 'https://min-api.cryptocompare.com/data/pricemulti' +
        '?fsyms=' + symbols.join(',') + '&tsyms=USD,BTC'

      $.getJSON(url, (json) => {
        var totalValue = 0
        var btcTotal = 0
        const storagePortoflio = ctx.coinTable

        var newDisplay = []

        symbols.forEach(function(element) {
          var amount = parseFloat(storagePortoflio[element], 10)
          var price = json[element].USD

          if(element === 'BTC') btcTotal += amount
          else btcTotal += amount * json[element].BTC

          totalValue += price * amount
        })

        ctx.value = totalValue.toFixed(2)

        symbols.forEach(function(element) {
          var coin = {}
          const amount = storagePortoflio[element]
          const price = (json[element].USD).toFixed(2)
          const value = (price * amount).toFixed(2)
          var per = (value / ctx.value * 100).toFixed(2)
          const icon = 'https://01mu.bitnamiapp.com/' +
            'graphics/crypto/' + element + '.png'

          if(per === 'NaN') per = '- '

          coin['symbol'] = element
          coin['amount'] = parseFloat(amount, 10).toFixed(4)
          coin['percentage'] = per
          coin['icon'] = icon
          coin['price'] = commas(ctx.priceSymbol + price)
          coin['value'] = commas(ctx.priceSymbol + value)

          newDisplay.push(coin)
        })

        const totalString = commas(ctx.priceSymbol + totalValue.toFixed(2))

        ctx.formatPortfolioDisplay(newDisplay)
        ctx.setFavIcon(newDisplay, ctx)
        ctx.coinDisplay = newDisplay
        ctx.showBar = false
        ctx.fullVisible = true
        ctx.btcValue = btcTotal.toFixed(10) + ' BTC'
        ctx.value = totalString
        document.title = 'Crypto | ' + totalString
      })
    },
    formatPortfolioDisplay(newDisplay) {
      newDisplay.sort((a, b) => { return b.percentage - a.percentage })
      newDisplay.map((e) => { e.percentage = e.percentage + '%' })
    },
    setFavIcon(newDisplay, ctx) {
      if (Object.keys(ctx.coinTable).length)
        document.querySelector("link[rel*='icon']").href = newDisplay[0]['icon']
    },
    hideEditDiv() {
      this.xsVisible = false
      this.showEdit = false
      this.notice = ''
    },
  },
}
