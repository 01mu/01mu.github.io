var head = new Vue ({
    el: '#head',
    data: {
        vues: [portfolio, performers, coins, heatmap, biz],
        info: [],
        active: {}
    },
    methods: {
        toggle: function(show) {
            this.vues.forEach(function(e) {
                if(e != show) {
                    e.visible = false;
                }

                if(e == show) {
                    head.active[e.nav] = 'headthing active';
                } else {
                    head.active[e.nav] = 'headthing';
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
        },
        showBiz: function() {
            this.toggle(biz);
            biz.init();
        }
    },
    created: function() {
        var url = 'https://smallfolio.bitnamiapp.com/crypto/info';
        var active = {};

        this.vues.forEach(function(element) {
            active[element.nav] = 'headthing';
        });

        active['portfolio'] = 'headthing active';

        this.active = active;

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
