const router = new VueRouter({
    routes: [],
});

var head = new Vue ({router,
    el: '#head',
    data: {
        vues: [single, portfolio, performers, coins, heatmap, biz],
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
            this.$router.push('/performers').catch(err => {})
        },
        showPortfolio: function() {
            this.$router.push('/portfolio').catch(err => {})
        },
        showCoins: function() {
            console.log(1)
            this.$router.push('/coins').catch(err => {})
        },
        showHeatMap: function() {
            this.$router.push('/heatmap').catch(err => {})
        },
        showBiz: function() {
            this.$router.push('/biz').catch(err => {})
        },
        showSingle: function(coin) {
            $('html, body').animate({ scrollTop: 0 }, 'fast');

            if(coin != undefined) {
                this.toggle(single);
                single.coin = coin;
                this.$router.push('/single/' + coin).catch(err => {})
            }
        },
        setRoute: function() {
            var split = this.$router.history.current.path.split('/');

            switch(split[1]) {
                case 'portfolio':
                    this.toggle(portfolio);
                    this.showPortfolio();
                    break;
                case 'performers':
                    this.toggle(performers);
                    this.showPerformers();
                    performers.init();
                    break;
                case 'coins':
                    this.toggle(coins);
                    this.showCoins();
                    coins.init();
                    break;
                case 'heatmap':
                    this.toggle(heatmap);
                    this.showHeatMap();
                    heatmap.init();
                    break;
                case 'biz':
                    this.toggle(biz);
                    this.showBiz();
                    biz.init();
                    break;
                case 'single':
                    this.showSingle(split[2]);
                    single.update();
                    break;
                default:
                    this.toggle(portfolio);
                    break;
            };
        }
    },
    watch: {
        '$route' (to, from) {
            this.setRoute();
        }
    },
    created: function() {
        var split = this.$router.history.current.path.split('/');

        var url = 'https://smallfolio.bitnamiapp.com/crypto/info';
        var active = {};

        this.vues.forEach(function(element) {
            active[element.nav] = 'headthing';
        });

        active[split[1]] = 'headthing active';

        this.active = active;
        this.setRoute();

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

            //head.info.push({'value': info.total_coins});
            //head.info.push({'value': info.total_markets});
            head.info.push({'value': info.total_market_cap});
            head.info.push({'value': info.total_volume_24h});
        });
    }
});
