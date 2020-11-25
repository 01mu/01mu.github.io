const Portfolio = {
    template: `
    <comp :destination="navbar" :info="navInfo"></comp>
    <loadingbar :showbar="showBar"></loadingbar>
    <div v-if="fullVisible" class="body">
        <div class="centersm">
            <h1>{{ value }}</h1>
            <h5>{{ btcValue }}</h5>
        </div>
        <table class="table">
            <thead class="thead">
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
                    <tr>
                        <td style="padding-top: 20px; padding-bottom: 20px;">
                        <a :href="'index.html#/single/' + coin.symbol">
                            <img height="20" width="20"
                                v-bind:src="coin.icon"
                                style="cursor: pointer;"/>
                        </a>
                        &nbsp;
                        <a :href="'index.html#/single/' + coin.symbol">
                            {{ coin.symbol }}
                        </a>
                        </td>
                        <td style="padding-top: 20px; padding-bottom: 20px;"
                            v-on:click="displayXS(coin.symbol)">
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
                        <td style="padding-top: 20px; padding-bottom: 20px;"
                            v-on:click="displayXS(coin.symbol)">
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

        <div class="portfoliobottom">

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

                $('html, body').animate({scrollTop:$(document).height()},
                    'slow');
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

            $('html, body').animate({scrollTop:$(document).height()},
                'slow');

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

            if(isEmpty(this.coinTable)) {
                portfolio.showBar = false;
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

                if(Object.keys(JSON.parse(portfolio.coinTable)).length) {
                    document.querySelector("link[rel*='icon']").href =
                        newDisplay[0]['icon'];
                }

                portfolio.coinDisplay = newDisplay;
                portfolio.showBar = false;
                portfolio.fullVisible = true;
            });
        },
    },
    data() {
        return {
            navInfo: [],
            fullVisible: false,
            showBar: true,
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

        navbarInfo(this.navInfo)

        if(localStorage.getItem('loaded') == null) {
            localStorage.setItem('loaded', 1);
            localStorage.setItem('portfolio',
                JSON.stringify({'BTC': 0, 'ETH': 0, 'XRP': 0}));
        }

        this.navbar = getNavbar('portfolio');

        portfolio.updateValue();
        setInterval(function() { portfolio.updateValue(); }, 60000);
    },
}
