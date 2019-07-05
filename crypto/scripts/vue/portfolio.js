var portfolio = new Vue({
    el: '#portfolio',
    data: {
        nav: 'portfolio',
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
                    var per = (value / portfolio.value * 100).toFixed(2);

                    var icon = 'https://smallfolio.bitnamiapp.com/' +
                    'crypto_icons/color/' + element.toLowerCase()  + '.png';

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
});
