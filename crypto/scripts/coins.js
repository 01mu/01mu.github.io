var coins = new Vue({
    el: '#coins',
    data: {
        url: 'https://smallfolio.bitnamiapp.com/crypto/coins/',
        coins: [],
        page: 0,
        lastUpdated: '',
        loadingText: 'Load more',
        visible: false,
        isInit: false
    },
    methods: {
        init: function() {
            if(!this.isInit) {
                $.getJSON(this.url + this.page, function (json) {
                    coins.coins = json.coins;
                    coins.lastUpdated =
                        'Last updated ' +
                        since(json.last_update_coins.input_value);

                    coins.formatCoins(coins.coins);
                });
            }

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
                element.rank = '#' + element.rank;

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

            $.getJSON(this.url + ++this.page, function (json) {
                coins.loadingText = 'Load more';

                coins.formatCoins(json.coins);
                coins.coins = coins.coins.concat(json.coins);
            });
        }
    }
});
