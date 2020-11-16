function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function since(date) {
    var seconds = Math.floor((new Date() /1000  - date));
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);

    if (interval > 1) {
        return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
        return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);

    if (interval > 1) {
        return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);

    if (interval > 1) {
        return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
}


function numWord(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " billion"
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " million"
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + " thousand"
    : Math.abs(Number(labelValue));
}


<!-- top bar -->
const topbar = {
    template:
    `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#"><b>Crypto</b></a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="index.html#/portfolio">Portfolio <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="index.html#/performers">Performers <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="index.html#/coins">Coins <span class="sr-only">(current)</span></a>
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
    <div class="body">
        <div class="centersm">
            <h1>{{ value }}</h1>
            <h5>{{ btcValue }}</h5>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Symbol</th>
                    <th scope="col">Amount</th>
                    <th class="d-none d-sm-table-cell" scope="col">Percentage</th>
                    <th class="d-none d-sm-table-cell" scope="col">Value</th>
                    <th scope="col">Price</th>
                    <th class="d-none d-sm-table-cell" scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(coin, index) in coinDisplay">
                    <tr :class="{'r0': index % 2 === 0, 'r1': index % 2 !== 0 }"
                        v-on:click="displayXS(coin.symbol)">
                        <td style="padding-top: 20px; padding-bottom: 20px;">
                            <a>
                                <img height="20" width="20"
                                    v-bind:src="coin.icon"
                                    style="cursor: pointer;"/>
                            </a> &nbsp;
                            <a >
                                {{ coin.symbol }}
                            </a>
                        </td>
                        <td style="padding-top: 20px; padding-bottom: 20px;">
                            {{ coin.amount }}
                        </td>
                        <td style="padding-top: 20px; padding-bottom: 20px;"
                            class="d-none d-sm-table-cell">
                            {{ coin.percentage }}
                        </td>
                        <td style="padding-top: 20px; padding-bottom: 20px;"
                            class="d-none d-sm-table-cell">
                            {{ coin.value }}
                        </td>
                        <td style="padding-top: 20px; padding-bottom: 20px;">
                            {{ coin.price }}
                        </td>
                        <td class="d-none d-sm-table-cell">
                            <button class="btn btn-outline-success"
                                v-on:click="setEdit(coin.symbol)">
                                Edit
                            </button>&nbsp;
                            <button class="btn btn-outline-danger"
                                v-on:click="removeCoin(coin.symbol)">
                                Delete
                            </button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>

        <span class="d-none d-sm-block">
            <div v-if="noticeVisible" class="alert alert-danger" role="alert">
                <b>{{ notice }}</b>
            </div>
            <div class="input-group">
                <input v-on:keyup.enter="confirmCoin()"
                    placeholder="Symbol" v-model="coinSymbol" class="form-control">&nbsp;
                <input v-on:keyup.enter="confirmCoin()"
                    placeholder="Amount" v-model="coinAmount" class="form-control">&nbsp;
                <button class="btn btn-outline-primary" v-on:click="confirmCoin()">
                    Add coin
                </button>
            </div>

            <span v-if="showEdit">
            <br>
            <div class="input-group">
                <input v-on:keyup.enter="makeEdit()"
                    placeholder="New amount" v-model="newAmount" class="form-control">&nbsp;
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
            <input class="form-control" v-on:keyup.enter="confirmCoin()"
                placeholder="Symbol" v-model="coinSymbol"/>
            <input class="form-control" v-on:keyup.enter="confirmCoin()"
                placeholder="Amount" v-model="coinAmount"/><br>
            <button class="btn btn-block btn-outline-primary" v-on:click="confirmCoin()">
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

        <span v-if="xsVisible" class="d-block d-sm-none">
            <div class="flex">
                <div class="wrapper50" style="padding-right: 8px;">
                    <button class="btn btn-block btn-outline-success"
                        v-on:click="setEdit(toEdit)">
                        Edit {{ toEdit }}
                    </button>
                    <div style="padding-right: 4px;"></div>
                </div>
                <div class="wrapper50" style="padding-left: 4px;">
                    <button class="btn btn-block btn-outline-danger"
                        v-on:click="removeCoin(toDelete)">
                        Delete {{ toDelete }}
                    </button>
                </div>
            </div>
        </span>
    </div>
    `,
    methods: {
        displayXS: function(symbol) {
            if(screen.width <= 600) {
                if(this.xsVisible && symbol === this.toEdit) {
                    this.xsVisible = false;
                    this.showEdit = false;
                    this.notice = '';
                } else {
                    this.xsVisible = true;
                }

                this.toEdit = symbol;
                this.toDelete = symbol;

                window.scrollTo(0, document.body.scrollHeight);
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
                portfolio.noticeVisible = 1;
                return;
            }

            a[this.toEdit] = this.newAmount;
            this.update(a);
            this.xsVisible = false;
            this.showEdit = false;
        },
        removeCoin: function(symbol) {
            var a = JSON.parse(this.coinTable);
            delete a[symbol];
            this.update(a);
            this.xsVisible = false;
            this.showEdit = false;
        },
        showError (text) {
            const p = this;
            this.notice = text;
            this.noticeVisible = 1;
            clearInterval(this.timer);
            this.timer = setTimeout(function() { p.noticeVisible = 0; }, 1500);
        },
        confirmCoin: function() {
            var symbol = this.coinSymbol;
            var amount = this.coinAmount;
            var portfolio = this;
            var url = 'https://min-api.cryptocompare.com/data/price?fsym='
                + this.coinSymbol.toUpperCase() + '&tsyms=BTC';

            if(!symbol || !amount || amount < 0 || isNaN(amount)) {
                this.showError("Invalid input");
                return;
            }

            $.getJSON(url, function (json) {
                if(json.BTC) {
                    portfolio.addCoin();
                } else {
                    portfolio.showError("Invalid symbol");
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

            if(this.coinTable == null) {
                this.coinTable = new Map();
            }

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
            noticeVisible: false,
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
            newAmount: '',
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

const Coins = {
    template: `
    <div class="bigger">
        <div class="flex coinheader">
            <div class="wrapper5">#</div>
            <div class="wrapper20">Coin</div>
            <div class="wrapper10">USD Price</div>
            <div class="wrapper15 hidden-xs">BTC Price</div>
            <div class="wrapper10 hidden-xs">Market Cap</div>
            <div class="wrapper10 hidden-xs">%</div>
            <div class="wrapper10 hidden-xs">24 Hour Vol.</div>
            <div class="wrapper10 hidden-xs">%</div>
            <div class="wrapper5 hidden-xs">1H Δ</div>
            <div class="wrapper5 hidden-xs">24H Δ</div>
            <div class="wrapper5 hidden-xs">7D Δ</div>
        </div>
            <template v-for="(coin, index) in coins">
                <div class="flex" style="margin-top: 16px; margin-bottom: 16px;">
                    <div class="wrapper5">{{ coin.rank }}</div>
                    <div class="wrapper20 overflow">
                        <a :href="'index.html#/single/' + coin.symbol">
                            <img height="20" width="20"
                                style="cursor: pointer;"
                                v-on:click="head.showSingle(coin.symbol)"
                                v-bind:src="coin.url"/>&nbsp;
                        </a>
                        <a :href="'index.html#/single/' + coin.symbol">
                            {{ coin.name }} ({{ coin.symbol }})
                        </a>
                    </div>
                    <div class="wrapper10">{{ coin.price_usd }}</div>
                    <div class="wrapper15 hidden-xs">{{ coin.price_btc }}</div>
                    $<div class="wrapper10 hidden-xs overflow">{{ coin.market_cap }}</div>
                    <div class="wrapper10 hidden-xs">{{ coin.market_cap_percent }}</div>
                    $<div class="wrapper10 hidden-xs overflow">{{ coin.volume_24h }}</div>
                    <div class="wrapper10 hidden-xs">{{ coin.volume_24h_percent }}</div>
                    <div class="wrapper5 hidden-xs">{{ coin.change_1h }}</div>
                    <div class="wrapper5 hidden-xs">{{ coin.change_24h }}</div>
                    <div class="wrapper5 hidden-xs">{{ coin.change_7d }}</div>
                </div>
            </template>
        <span style="margin: 16px">
            <button class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
                {{ loadingText }}
            </button>
        </span>
    </div>
    `,
    data() {
        return {
            nav: 'coins',
            url: 'https://smallfolio.bitnamiapp.com/crypto/coins/',
            coins: [],
            page: 0,
            lastUpdated: '',
            loadingText: 'Load more',
            visible: false,
            isInit: false,
        }
    },
    methods: {
        init: function() {
            if(this.isInit) {
                return;
            }

            const coins = this;

            $.getJSON(this.url + this.page, function (json) {
                coins.coins = json.coins;
                coins.lastUpdated = 'Last updated ' +
                    since(json.last_update_coins.input_value);

                coins.formatCoins(coins.coins);
            });

            this.isInit = true;
        },
        formatCoins: function(coins) {
            coins.map(function(element) {
                element.url = 'https://smallfolio.bitnamiapp.com/' +
                    'crypto_icons/color/' + element.symbol.toLowerCase() +
                    '.png';

                element.price_usd = '$' + commas(element.price_usd.toFixed(2));
                element.price_btc = element.price_btc.toFixed(5);
                element.change_1h = element.change_1h.toFixed(2) + '%';
                element.change_24h = element.change_24h.toFixed(2) + '%';
                element.change_7d = element.change_7d.toFixed(2) + '%';
                //element.rank = '#' + element.rank;

                element.market_cap = numWord(element.market_cap);
                element.market_cap_percent =
                    element.market_cap_percent.toFixed(2) + '%';

                element.volume_24h = numWord(element.volume_24h);
                element.volume_24h_percent =
                    element.volume_24h_percent.toFixed(2) + '%';
            });
        },
        loadMore: function() {
            this.loadingText = 'Loading...';

            const coins = this;

            $.getJSON(this.url + ++this.page, function (json) {
                coins.loadingText = 'Load more';

                coins.formatCoins(json.coins);
                coins.coins = coins.coins.concat(json.coins);
            });
        }
    },
    created() {
        this.init();

        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {

            }
        )
    }
}

const Performers = {
    template: `
    <div class="bigger row">
        <div class="col-sm-4">
            <div class="perfheader">1 Hour Change</div>
            <div class="flex">
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_1h_desc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_1h_asc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="perfheader">24 Hour Change</div>
            <div class="flex">
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_24h_desc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
                <div class="wrapper50">
                    <performers  v-for="(p, index) in performers['change_24h_asc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="perfheader">7 Day Change</div>
            <div class="flex">
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_7d_desc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_7d_asc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
            </div>
        </div>
    </div>
    <div class="bigger">
        <div v-if="noticeVisible" class="alert alert-danger" role="alert">
            <b>{{ notice }}</b>
        </div>
        <div class="input-group">
            <input v-on:keyup.enter="updateRank()"
                placeholder="Rank limit" v-model="rank" class="form-control"></input>&nbsp;
            <button class="btn btn-outline-primary" v-on:click="updateRank()">
                Set rank limit
            </button>
        </div>
        <span style="margin: 16px">
            <button class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
                {{ loadingText }}
            </button>
        </span>
    </div>
    `,
    data() {
        return {
            nav: 'performers',
            url: 'https://smallfolio.bitnamiapp.com/crypto/performers/',
            performers: [],
            performerTypes: ['change_1h_asc', 'change_1h_desc',
                'change_24h_asc', 'change_24h_desc',
                'change_7d_asc', 'change_7d_desc'],
            rank: 0,
            page: 0,
            visible: false,
            lastUpdated: '',
            loadingText: 'Load more',
            isInit: false,
            noticeVisible: false,
            notice: ''
        }
    },
    components: {
        performers: {
            props: ['performer', 'index'],
            template:
            `
            <div class="flex" style="margin-top: 16px; margin-bottom: 16px;">
                <div class="wrapper50 overflow">
                    <a :href="'index.html#/single/' + performer.symbol">
                        <img height="20" width="20"
                            style="cursor: pointer;"
                            v-on:click="head.showSingle(performer.symbol)"
                            v-bind:src="performer.url"/>
                    </a>
                    &nbsp;
                    <a :href="'index.html#/single/' + performer.symbol">
                        {{ performer.symbol }}
                    </a>
                </div>
                <div class="wrapper50 overflow">
                    {{ performer.change.toFixed(2) }}%
                </div>
            </div>
            `
        }
    },
    methods: {
        showError (text) {
            const p = this;
            this.notice = text;
            this.noticeVisible = 1;
            clearInterval(this.timer);
            this.timer = setTimeout(function() { p.noticeVisible = 0; }, 1500);
        },
        load: function() {
            var limit = localStorage.getItem('performers_rank');

            if(limit == null) {
                this.rank = 50;
            } else {
                this.rank = limit;
            }

            const performers = this;

            $.getJSON(this.url + this.rank + '/' + this.page,
                function (json) {

                performers.formatPerformers(json);
                performers.performers = json;
                performers.lastUpdated =
                    'Last updated ' +
                    since(json.last_update_coins.input_value);
            });
        },
        updateRank: function() {
            if(this.rank <= 0 || this.rank > 500 || isNaN(this.rank)) {
                this.showError("Invalid range: 1 to 500");
            } else {
                localStorage.setItem('performers_rank', this.rank);

                this.page = 0;
                this.load();
            }
        },
        init: function() {
            if(!this.isInit) {
                this.load();
            }

            this.isInit = true;
        },
        formatPerformers: function(json) {
            this.performerTypes.forEach(function(p) {
                json[p].map(function(element) {
                    element.url = 'https://smallfolio.bitnamiapp.com/' +
                        'crypto_icons/color/' + element.symbol.toLowerCase() +
                        '.png';
                });
            });
        },
        loadMore: function() {
            var url = this.url + this.rank + '/' + ++this.page;

            this.loadingText = 'Loading...';
            const performers = this;

            $.getJSON(url, function (json) {
                performers.formatPerformers(json);

                performers.performerTypes.forEach(function(p) {
                    performers.performers[p] = performers.performers[p]
                        .concat(json[p]);
                });

                performers.loadingText = 'Load more';
            });
        }
    },
    created() {
        this.init();

        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {

            }
        )
    }
}

const routes = [
  { path: '/', component: Portfolio },
  { path: '/portfolio', component: Portfolio },
  { path: '/coins', component: Coins },
  { path: '/performers', component: Performers },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

const app = Vue.createApp({})
app.use(router)
app.mount('#app')

