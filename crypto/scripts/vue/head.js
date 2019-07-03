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
            this.toggle(performers);
            this.$router.push('/performers');
        },
        showPortfolio: function() {
            $('.navbar-collapse').collapse('hide');

            this.toggle(portfolio);
            this.$router.push('/portfolio');
        },
        showCoins: function() {
            this.toggle(coins);
            this.$router.push('/coins');
        },
        showHeatMap: function() {
            this.toggle(heatmap);
            this.$router.push('/heatmap');
        },
        showBiz: function() {
            this.toggle(biz);
            this.$router.push('/biz');
        },
        showSingle: function(coin) {
            $('.navbar-collapse').collapse('hide');
            $('html, body').animate({ scrollTop: 0 }, 'fast');

            if(coin != undefined) {
                this.toggle(single);
                single.coin = coin;
                this.$router.push('/single/' + coin);
            }
        },
        setRoute: function() {
            var head = this;
            var split = this.$router.history.current.path.split('/');

            switch(split[1]) {
                case 'portfolio':
                    head.showPortfolio();
                    break;
                case 'performers':
                    head.showPerformers();
                    performers.init();
                    break;
                case 'coins':
                    coins.init();
                    head.showCoins();
                    break;
                case 'heatmap':
                    head.showHeatMap();
                    heatmap.init();
                    break;
                case 'biz':
                    head.showBiz();
                    biz.init();
                    break;
                case 'single':
                    head.showSingle(split[2]);
                    single.update();
                    break;
                default:
                    head.showPortfolio();
                    break;
            };
        },
        ass: function() {console.log('as')}
    },
    watch: {
        '$route' (to, from) {
            this.setRoute();
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

        window.onkeydown = function (e) {
            var code = e.keyCode ? e.keyCode : e.which;

            switch(code) {
                case 32: console.log('space');break;
                case 37: console.log('left');break;
                case 38: console.log('up'); break;
                case 39: console.log('right');break;
                case 40: console.log('down');break;
                default: break;
            }
        };
    }
});
