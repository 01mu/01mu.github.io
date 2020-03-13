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
        setRoute: function() {
            var split = this.$router.history.current.path.split('/');

            switch(split[1]) {
                case 'portfolio':
                    this.toggle(portfolio);
                    break;
                case 'performers':
                    this.toggle(performers);
                    performers.init();
                    break;
                case 'coins':
                    this.toggle(coins);
                    coins.init();
                    break;
                case 'heatmap':
                    this.toggle(heatmap);
                    heatmap.init();
                    break;
                case 'biz':
                    this.toggle(biz);
                    biz.init();
                    break;
                case 'single':
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    single.coin = split[2];
                    this.toggle(single);
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
