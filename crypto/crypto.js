Vue.component('perfo', {
  props: ['performer'],
  template: '<div class="flex perfthing"> \
        <div class="wrapper50"> \
        <img height="20" width="20" v-bind:src="performer.url"/> \
        {{ performer.symbol }} \
        </div>\
        <div class="wrapper50"> \
        {{ performer.change.toFixed(2) }}% \
        </div> \
        </div>'
})

Vue.component('coinlist', {
  props: ['coin'],
  template:
    '<div class="flex coinpad"> \
    <div class="wrapper5">{{ coin.rank }}</div> \
    <div class="wrapper15 overflow">\
    <img height="20" width="20" v-bind:src="coin.url"/> {{ coin.name }}</div> \
    <div class="wrapper10">{{ coin.price_usd }}</div> \
    <div class="wrapper10">{{ coin.price_btc }}</div> \
    <div class="wrapper9">{{ coin.change_1h }}</div> \
    <div class="wrapper9">{{ coin.change_24h }}</div> \
    <div class="wrapper9">{{ coin.change_7d }}</div> \
    <div class="wrapper10">{{ coin.market_cap }}</div> \
    <div class="wrapper6p5">{{ coin.market_cap_percent }}</div> \
    <div class="wrapper10">{{ coin.volume_24h }}</div> \
    <div class="wrapper6p5">{{ coin.volume_24h_percent }}</div> \
    </div>'
})


var head = new Vue ({
    el: '#head',
    methods: {
        showPerformers: function() {
            performers.visible = true;
            coins.visible = portfolio.visible = false;
        },
        showPortfolio: function() {
            coins.visible = performers.visible = false;
            portfolio.visible = true;
        },
        showCoins: function() {
            coins.visible = true;
            performers.visible = portfolio.visible = false;
        }
    }
});

var coins = new Vue({
    el: '#coins',
    data: {
        coins: [],
        page: 0,
        lastUpdated: 0,
        loadingText: 'Load more',
        visible: false
    },
    methods: {
        loadMore: function() {
            var url = 'https://smallfolio.bitnamiapp.com/crypto/coins/';

            this.page++;
            this.loadingText = 'Loading...'

            $.getJSON(url + coins.page, function (json) {
                coins.formatCoins(json.coins);
                coins.coins = coins.coins.concat(json.coins);
                coins.lastUpdated = json.last_update_coins.input_value;
                coins.loadingText = 'Load more'
            });
        },
        formatCoins: function(coins) {
            coins.map(function(element) {
                element.url = 'https://smallfolio.bitnamiapp.com/dl_icon/' +
                    element.symbol + '.png';

                element.price_usd = '$' + commas(element.price_usd.toFixed(2));
                element.price_btc = element.price_btc.toFixed(5) + '₿';
                element.change_1h = element.change_1h.toFixed(2) + '%';
                element.change_24h = element.change_24h.toFixed(2) + '%';
                element.change_7d = element.change_7d.toFixed(2) + '%';

                element.market_cap = numWord(element.market_cap);
                element.market_cap_percent =
                    element.market_cap_percent.toFixed(2) + '%';

                element.volume_24h = numWord(element.volume_24h);
                element.volume_24h_percent =
                    element.volume_24h_percent.toFixed(2) + '%';
            });
        }
    },
    created: function() {
        var url = 'https://smallfolio.bitnamiapp.com/crypto/coins/';

        $.getJSON(url + this.page, function (json) {
            coins.coins = json.coins;
            coins.lastUpdated = json.last_update_coins.input_value;
            coins.formatCoins(coins.coins);
        });
    }
});

var performers = new Vue({
    el: '#performers',
    data: {
        change1hAsc: [],
        change1hDesc: [],
        change24hAsc: [],
        change24hDesc: [],
        change7dAsc: [],
        change7dDesc: [],
        rankLimit: 100,
        page: 0,
        visible: false,
        loadingText: 'Load more'
    },
    methods: {
        loadMore: function() {
            var url = 'https://smallfolio.bitnamiapp.com/crypto/performers/';

            this.page++;
            this.loadingText = 'Loading...'

            $.getJSON(url + this.rankLimit + '/' + this.page, function (json) {
                var asd = [json.change_1h_asc, json.change_1h_desc,
                    json.change_24h_asc, json.change_24h_desc,
                    json.change_7d_asc, json.change_7d_desc];

                asd.forEach(function(per) {
                    per.map(function(element) {
                        element.url = 'https://smallfolio.bitnamiapp.com/dl_icon/' +
                            element.symbol + '.png';
                    });
                });

                performers.change1hAsc =
                    performers.change1hAsc.concat(json.change_1h_asc);
                performers.change1hDesc =
                    performers.change1hDesc.concat(json.change_1h_desc);
                performers.change24hAsc =
                    performers.change24hAsc.concat(json.change_24h_asc);
                performers.change24hDesc =
                    performers.change24hDesc.concat(json.change_24h_desc);
                performers.change7dAsc =
                    performers.change7dAsc.concat(json.change_7d_asc);
                performers.change7dDesc =
                    performers.change7dDesc.concat(json.change_7d_desc);

                performers.loadingText = 'Load more'
            });
        }
    },
    created: function() {
        var url = 'https://smallfolio.bitnamiapp.com/crypto/performers/';

        $.getJSON(url + this.rankLimit + '/' + this.page, function (json) {
            performers.change1hAsc = json.change_1h_asc;
            performers.change1hDesc = json.change_1h_desc;
            performers.change24hAsc = json.change_24h_asc;
            performers.change24hDesc = json.change_24h_desc;
            performers.change7dAsc = json.change_7d_asc;
            performers.change7dDesc = json.change_7d_desc;

            var asd = [performers.change1hAsc, performers.change1hDesc,
                performers.change24hAsc, performers.change24hDesc,
                performers.change7dAsc, performers.change7dDesc];

            asd.forEach(function(per) {
                per.map(function(element) {
                    element.url = 'https://smallfolio.bitnamiapp.com/dl_icon/' +
                        element.symbol + '.png';
                });
            });
        });
    }
})

var portfolio = new Vue({
    el: '#portfolio',
    data: {
        value: '',
        btcValue: '',

        coinDisplay: [],
        coinTable: {},

        coinSymbol: '',
        coinAmount: '',
        priceSymbol: '$',

        notice: '',

        showEdit: false,
        toEdit: '',
        newAmount: 0,

        visible: true
    },
    methods: {
        update: function(a) {
            localStorage.setItem('portfolio', JSON.stringify(a));
            this.coinTable = localStorage.getItem('portfolio');
            this.updateValue();
        },
        setEdit: function(symbol) {
            if(this.showEdit && symbol === this.toEdit) {
                this.showEdit = false;
            } else {
                this.showEdit = true;
            }

            this.toEdit = symbol;
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
        },
        removeCoin: function(symbol) {
            var a = JSON.parse(this.coinTable);
            delete a[symbol];
            this.update(a);
        },
        confirmCoin: function() {
            var url = 'https://min-api.cryptocompare.com/data/price?fsym='
                + portfolio.coinSymbol.toUpperCase() + '&tsyms=BTC';

            var symbol = portfolio.coinSymbol;
            var amount = portfolio.coinAmount;

            if(!symbol || !amount || amount < 0 || isNaN(amount)) {
                portfolio.notice = 'Invalid input';
                return;
            }

            $.getJSON(url, function (json) {
                if(json.BTC) {
                    portfolio.addCoin();
                } else {
                    portfolio.notice = 'Invalid symbol';
                }
            });
        },
        updateValue: function() {
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

                portfolio.value =  totalValue.toFixed(2);

                symbols.forEach(function(element) {
                    var show = {};

                    var amount = p[element];
                    var price = (json[element].USD).toFixed(2);
                    var value = (price * amount).toFixed(2);
                    var per = (value / portfolio.value * 100).toFixed(3);

                    var icon = 'https://smallfolio.bitnamiapp.com/dl_icon/' +
                        element + '.png';

                    show['symbol'] = element;
                    show['amount'] = commas(amount);
                    show['percentage'] = per;
                    show['icon'] = icon;
                    show['price'] = commas(portfolio.priceSymbol + price);
                    show['value'] = commas(portfolio.priceSymbol + value);

                    newDisplay.push(show);
                });

                portfolio.value = document.title =
                    commas(portfolio.priceSymbol + totalValue.toFixed(2));

                portfolio.btcValue = btcTotal.toFixed(10) + '₿';

                newDisplay.sort(function (a, b) {
                    return b.percentage - a.percentage;
                });

                newDisplay.map(function(element) {
                    element.percentage = element.percentage + '%';
                });

                document.querySelector("link[rel*='icon']").href =
                    newDisplay[0]['icon'];

                portfolio.coinDisplay = newDisplay;
            });
        },
        getSymbols: function () {
            var symbols = [];

            if(this.coinTable) {
                symbols = Object.keys(JSON.parse(this.coinTable));
            }

            return symbols;
        },
        addCoin: function () {
            var symbol = this.coinSymbol.toUpperCase();
            var amount = parseFloat(this.coinAmount, 10);

            if(this.coinTable === null) {
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

            this.coinTable = localStorage.getItem('portfolio');
            this.updateValue();
        }
    },
    created: function() {
        this.coinTable = localStorage.getItem('portfolio');
        this.updateValue();

        setInterval(function() { portfolio.updateValue(); }, 60000);
    }
})

function numWord(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? Math.abs(Number(labelValue)) / 1.0e+9 + " billion"
    // Six Zeroes for Millions
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? Math.abs(Number(labelValue)) / 1.0e+6 + " million"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? Math.abs(Number(labelValue)) / 1.0e+3 + " thousand"

    : Math.abs(Number(labelValue));
}

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
