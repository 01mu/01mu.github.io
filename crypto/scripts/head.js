const router = new VueRouter({
    routes: [],
});

var head = new Vue ({router,
    el: '#head',
    data: {
        vues: [portfolio, performers, coins, heatmap, biz],
        info: [],
        active: {}
    },
    methods: {
        toggle: function(show) {
            var head = this;

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
            this.$router.push('/performers');
        },
        showPortfolio: function() {
            this.toggle(portfolio);
            this.$router.push('/portfolio');
        },
        showCoins: function() {
            this.toggle(coins);
            coins.init();
            this.$router.push('/coins');
        },
        showHeatMap: function() {
            this.toggle(heatmap);
            heatmap.init();
            this.$router.push('/heatmap');
        },
        showBiz: function() {
            this.toggle(biz);
            biz.init();
            this.$router.push('/biz');
        },
        doRoute: function() {
            var head = this;
            var split = this.$router.history.current.path.split('/');

            switch(split[1]) {
                case 'portfolio': head.showPortfolio(); break;
                case 'performers': head.showPerformers(); break;
                case 'coins': head.showCoins(); break;
                case 'heatmap': head.showHeatMap(); break;
                case 'biz': head.showBiz(); break;
                default: head.showPortfolio(); break;
            };
        }
    },
    watch: {
        '$route' (to, from) {
            this.doRoute();
        }
    },
    created: function() {
        var head = this;
        var split = this.$router.history.current.path.split('/');

        var url = 'https://smallfolio.bitnamiapp.com/crypto/info';
        var active = {};

        this.vues.forEach(function(element) {
            active[element.nav] = 'headthing';
        });

        active[split[1]] = 'headthing active';

        this.active = active;
        this.doRoute();

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
