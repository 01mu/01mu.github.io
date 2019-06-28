var head = new Vue ({
    el: '#head',
    data: {
        info: []
    },
    methods: {
        toggle: function(show) {
            var vues = [performers, coins, portfolio, heatmap];

            vues.forEach(function(e) {
                if(e != show) {
                    e.visible = false;
                }
            });

            show.visible = true;
        },
        showPerformers: function() {
            this.toggle(performers);
            performers.init();
        },
        showPortfolio: function() {
            this.toggle(portfolio);
        },
        showCoins: function() {
            this.toggle(coins);
            coins.init();
        },
        showHeatMap: function() {
            this.toggle(heatmap);
            heatmap.init();
        }
    },
    created: function() {
        var url = 'https://smallfolio.bitnamiapp.com/crypto/info';

        $.getJSON(url, function (json) {
            var info = {};

            json.forEach(function(element) {
                info[element.input_key] = element.input_value;
            });

            info.total_coins = 'Coins: ' + commas(parseFloat(info.total_coins));

            info.total_markets = 'Markets: ' +
                commas(parseFloat(info.total_markets));

            info.total_market_cap = 'Market Cap: $' +
                numWord(parseFloat(info.total_market_cap).toFixed(2));

            info.total_volume_24h = '24 Hour Volume: $' +
                numWord(parseFloat(info.total_volume_24h).toFixed(2));

            head.info.push({'value': info.total_coins});
            head.info.push({'value': info.total_markets});
            head.info.push({'value': info.total_market_cap});
            head.info.push({'value': info.total_volume_24h});
        });
    }
});