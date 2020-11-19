const router = new VueRouter({
    routes: [],
});

var head = new Vue ({router,
    el: '#head',
    data: {
        url: 'https://smallfolio.bitnamiapp.com/crypto/info',
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
        },
        cf: function(text, val) {
            return text + commas(parseFloat(val));
        },
        nf(text, val) {
            return text + numWord(parseFloat(val).toFixed(2));
        }
    },
    watch: {
        '$route' (to, from) {
            this.setRoute();
        }
    },
    created: function() {
        var i = {};
        var active = {};

        this.vues.forEach(function(element) {
            active[element.nav] = 'headthing';
        });

        this.active = active;
        this.setRoute();

        $.getJSON(this.url, function (json) {
            json.forEach(function(element) {
                i[element.input_key] = element.input_value;
            });

            //i.total_coins = head.cf('Coins: ', i.total_coins);
            //i.total_markets = head.cf('Markets: ', i.total_markets);
            i.tmc = head.nf('Market Cap: $', i.total_market_cap);
            i.tv = head.nf('24 Hour Volume: $', i.total_volume_24h);

            //head.info.push({'value': i.total_coins});
            //head.info.push({'value': i.total_markets});
            head.info.push({'value': i.tmc});
            head.info.push({'value': i.tv});
        });
    }
});
