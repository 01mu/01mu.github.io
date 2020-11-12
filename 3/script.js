function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

<!-- top bar -->
const topbar = {
    template:
    `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Crypto</a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Portfolio <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle active " href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Mentions
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">/biz/</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <div style="margin-bottom: 16px"></div>
    `,
}

Vue.createApp(topbar).mount('#topbar')

<!-- portfolio -->
const Portfolio = {
    template: `
    <span>
        <span>
            <h1>{{ value }}</h1>
            <h5>{{ btcValue }}</h5>
        </span>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Symbol</th>
                    <th scope="col">Amount</th>
                    <th class="d-none d-sm-table-cell" scope="col">Percentage</th>
                    <th class="d-none d-sm-table-cell" scope="col">Value</th>
                    <th scope="col">Price</th>
                    <th class="d-none d-sm-table-cell" scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(coin, index) in coinDisplay">
                    <tr :class="{'r0': index % 2 === 0, 'r1': index % 2 !== 0 }"
                        v-on:click="displayXS(coin.symbol)">
                        <td>
                            <a >
                                <img height="20" width="20"
                                    v-bind:src="coin.icon"
                                    style="cursor: pointer;"/>
                            </a>
                            &nbsp;
                            <a >
                                {{ coin.symbol }}
                            </a>
                        </td>
                        <td>{{ coin.amount }}</td>
                        <td class="d-none d-sm-table-cell">{{ coin.percentage }}</td>
                        <td class="d-none d-sm-table-cell">{{ coin.value }}</td>
                        <td>{{ coin.price }}</td>
                        <td class="d-none d-sm-table-cell">
                            <button class="button-green"
                                v-on:click="setEdit(coin.symbol)">
                                Edit
                            </button>&nbsp;
                            <button class="button-red"
                                v-on:click="removeCoin(coin.symbol)">
                                Delete
                            </button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>


        <span class="d-none d-sm-block">
            <input v-on:keyup.enter="confirmCoin()"
                placeholder="Symbol" v-model="coinSymbol"/>&nbsp;
            <input v-on:keyup.enter="confirmCoin()"
                placeholder="Amount" v-model="coinAmount"/>&nbsp;
            <button class="button-blue" v-on:click="confirmCoin()">
                Add coin
            </button>

            <span v-if="showEdit">
                <br><br>
                <input v-on:keyup.enter="makeEdit()"
                    placeholder="New amount" v-model="newAmount">&nbsp;
                <button class="button-blue" v-on:click="makeEdit()">
                    Edit {{ toEdit }}
                </button>
            </span>
            &nbsp;
        </span>

        <span class="d-block d-sm-none">
            <input v-on:keyup.enter="confirmCoin()"
                placeholder="Symbol" v-model="coinSymbol"/>&nbsp;
            <input v-on:keyup.DDe;enter="confirmCoin()"
                placeholder="Amount" v-model="coinAmount"/>&nbsp;
            <button class="button-blue" v-on:click="confirmCoin()">
                Add coin
            </button>

            <span v-if="showEdit">
                <br><br>
                <input v-on:keyup.enter="makeEdit()"
                    placeholder="New amount" v-model="newAmount">&nbsp;
                <button class="button-blue" v-on:click="makeEdit()">
                    Edit {{ toEdit }}
                </button>
            </span>
            <br><br>
        </span>

        <span v-if="xsVisible" class="d-block d-sm-none">
            <button class="button-green"
                v-on:click="setEdit(toEdit)">
                Edit {{ toEdit }}
            </button>&nbsp;
            <button class="button-red"
                v-on:click="removeCoin(toDelete)">
                Delete {{ toDelete }}
            </button>
        </span>
        <b>{{ notice }}</b>
    </span>
    `,
    methods: {
        displayXS: function(a) {
            if(screen.width <= 600) {
                window.scrollTo(0, document.body.scrollHeight);

                if(this.xsVisible && a === this.toEdit) {
                    this.xsVisible = false;
                    this.showEdit = false;
                    this.notice = '';
                } else {
                    this.xsVisible = true;
                }

                this.toEdit = a;
                this.toDelete = a;
            }
        },
        addCoin: function() {
            var symbol = this.coinSymbol.toUpperCase();
            var amount = parseFloat(this.coinAmount, 10);

           if(this.coinTable.size == 0) {
                var add = {};

                add[symbol] = amount;
                localStorage.setItem('portfolio', JSON.stringify(add));
            } else {
                var a = JSON.parse(this.coinTable);

                if(a[symbol]) {
                    a[symbol] = parseFloat(a[symbol], 10) + amount;

                } else {
                    a[symbol] = amount;
                }

                localStorage.setItem('portfolio', JSON.stringify(a));
            }

            this.updateValue();
        },
        update: function(a) {
            localStorage.setItem('portfolio', JSON.stringify(a));
            this.updateValue();
        },
        setEdit: function(symbol) {
            if(this.showEdit && symbol === this.toEdit) {
                this.showEdit = false;
            } else {
                this.showEdit = true;
            }

            this.toEdit = symbol;
            this.toDelete = symbol;
        },
        makeEdit: function() {
            var a = JSON.parse(this.coinTable);
            var amount = parseFloat(this.newAmount, 10);

            if(amount < 0 || isNaN(amount)) {
                portfolio.notice = 'Invalid input';
                return;
            }

            a[this.toEdit] = this.newAmount;
            this.update(a);
            this.xsVisible = false;
            this.showEdit = false;
            this.notice = '';
        },
        removeCoin: function(symbol) {
            var a = JSON.parse(this.coinTable);
            delete a[symbol];
            this.update(a);
            this.xsVisible = false;
            this.showEdit = false;
            this.notice = '';
        },
        confirmCoin: function() {
            var url = 'https://min-api.cryptocompare.com/data/price?fsym='
                + this.coinSymbol.toUpperCase() + '&tsyms=BTC';

            var symbol = this.coinSymbol;
            var amount = this.coinAmount;

            if(!symbol || !amount || amount < 0 || isNaN(amount)) {
                this.notice = 'Invalid input';
                return;
            }

            var portfolio = this;

            $.getJSON(url, function (json) {
                if(json.BTC) {
                    portfolio.addCoin();
                } else {
                    portfolio.notice = 'Invalid symbol';
                }
            });
        },
        getSymbols () {
            var symbols = [];

            if(this.coinTable) {
                symbols = Object.keys(JSON.parse(this.coinTable));
            }

            return symbols;
        },
        updateValue () {
            const portfolio = this;
            this.coinTable = localStorage.getItem('portfolio');

            if(this.coinTable.size == 0) {
                return;
            }

            var symbols = this.getSymbols();
            var url = 'https://min-api.cryptocompare.com/data/pricemulti' +
                '?fsyms=' + symbols.join(',') + '&tsyms=USD,BTC'

            $.getJSON(url, function (json) {
                var totalValue = 0;
                var btcTotal = 0;
                var p = JSON.parse(portfolio.coinTable);

                var newDisplay = [];

                symbols.forEach(function(element) {
                    var amount = parseFloat(p[element], 10);
                    var price = json[element].USD;

                    if(element === 'BTC') {
                        btcTotal += amount;
                    } else {
                        btcTotal += amount * json[element].BTC;
                    }

                    totalValue += price * amount;
                });

                portfolio.value = totalValue.toFixed(2);

                symbols.forEach(function(element) {
                    var show = {};

                    var amount = p[element];
                    var price = (json[element].USD).toFixed(2);
                    var value = (price * amount).toFixed(2);

                    var per = (value / portfolio.value * 100).toFixed(2);

                    if(per === 'NaN') {
                        per = '- '
                    }

                    var icon = 'https://smallfolio.bitnamiapp.com/' +
                        'crypto_icons/color/' + element.toLowerCase()  + '.png';

                    show['symbol'] = element;
                    show['amount'] = parseFloat(amount, 10).toFixed(4);
                    show['percentage'] = per;
                    show['icon'] = icon;
                    show['price'] = commas(portfolio.priceSymbol + price);
                    show['value'] = commas(portfolio.priceSymbol + value);

                    newDisplay.push(show);
                });

                portfolio.value = document.title =
                    commas(portfolio.priceSymbol + totalValue.toFixed(2));

                portfolio.btcValue = btcTotal.toFixed(10) + ' BTC';

                newDisplay.sort(function (a, b) {
                    return b.percentage - a.percentage;
                });

                newDisplay.map(function(element) {
                    element.percentage = element.percentage + '%';
                });

                /*if(Object.keys(JSON.parse(portfolio.coinTable)).length) {
                    document.querySelector("link[rel*='icon']").href =
                        newDisplay[0]['icon'];
                }*/

                portfolio.coinDisplay = newDisplay;
            });
        },
    },
    data() {
        return {
            nav: 'portfolio',
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
            newAmount: 0,
            visible: false,
        };
    },
    created() {
        const portfolio = this;
        this.coinTable = new Map();
        portfolio.updateValue();
        setInterval(function() { portfolio.updateValue(); }, 60000);
    },
}

const About = {
    template: '<div>User {{ $route.params.id }}</div>',
    methods: {
        a() {
            console.log(1);
        }
    },
    created() {
        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {
                this.a();
            }
        )
    }
}

const routes = [
  { path: '/', component: Portfolio },
  { path: '/portfolio', component: Portfolio },
  { path: '/about', component: About },
  { path: '/about/:id', component: About },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

const app = Vue.createApp({})
app.use(router)
app.mount('#app')
