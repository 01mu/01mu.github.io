const Coins = {
    template: `
    <comp :destination="navbar" :info="navInfo"></comp>
    <loadingbar :showbar="showBar"></loadingbar>
    <div v-if="fullVisible" class="bigger">
        <div class="flex coinheader">
            <div class="wrapper5 overflow">#</div>
            <div class="wrapper25 overflow">Coin</div>
            <div class="wrapper10 overflow">USD Price</div>
            <div class="wrapper10 d-none d-sm-block overflow">BTC Price</div>
            <div class="wrapper15 d-none d-sm-block overflow">Market Cap</div>
            <div class="wrapper15 d-none d-sm-block overflow">24 Hour Volume</div>
            <div class="wrapper5 d-none d-sm-block overflow">1H Δ</div>
            <div class="wrapper5 d-none d-sm-block overflow">24H Δ</div>
            <div class="wrapper5 d-none d-sm-block overflow">7D Δ</div>
        </div>
            <template v-for="(coin, index) in coins">
                <div class="flex" style="margin-top: 16px; margin-bottom: 16px;">
                    <div class="wrapper5 overflow">{{ coin.rank }}</div>
                    <div class="wrapper25 overflow">
                        <a :href="'index.html#/single/' + coin.symbol">
                            <img height="20" width="20"
                                style="cursor: pointer;"
                                v-on:click="head.showSingle(coin.symbol)"
                                v-bind:src="coin.url"/>&nbsp;
                        </a>
                        <a :href="'index.html#/single/' + coin.symbol">
                            {{ coin.name }} ({{ coin.symbol }})
                        </a>
                    </div>
                    <div class="wrapper10 overflow">{{ coin.price_usd }}</div>
                    <div class="wrapper10 d-none d-sm-block overflow">{{ coin.price_btc }}</div>
                    <div class="wrapper15 d-none d-sm-block overflow">{{ coin.market_cap }} ({{ coin.market_cap_percent }})</div>
                    <div class="wrapper15 d-none d-sm-block overflow">{{ coin.volume_24h }} ({{ coin.volume_24h_percent }})</div>
                    <div class="wrapper5 d-none d-sm-block overflow">{{ coin.change_1h }}</div>
                    <div class="wrapper5 d-none d-sm-block overflow">{{ coin.change_24h }}</div>
                    <div class="wrapper5 d-none d-sm-block overflow">{{ coin.change_7d }}</div>
                </div>
            </template>
        <span style="margin: 16px">
            <button class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
                {{ loadingText }}
            </button>
        </span>
    </div>
    `,
    data() {
        return {
            navInfo: [],
            fullVisible: false,
            showBar: true,
            nav: 'coins',
            url: 'https://01mu.bitnamiapp.com/crypto/coins/',
            coins: [],
            page: 0,
            lastUpdated: '',
            loadingText: 'Load more',
            visible: false,
            isInit: false,
        }
    },
    methods: {
        init: function() {
            if(this.isInit) {
                return;
            }

            const coins = this;

            $.getJSON(this.url + this.page, function (json) {
                coins.coins = json.coins;
                coins.lastUpdated = 'Last updated ' +
                    since(json.last_update_coins.input_value);

                coins.formatCoins(coins.coins);
                coins.showBar = false;
                coins.fullVisible = true;
            });

            this.isInit = true;
        },
        formatCoins: function(coins) {
            coins.map(function(element) {
                element.url = 'https://01mu.bitnamiapp.com/' +
                    'graphics/crypto/' + element.symbol.toLowerCase() +
                    '.png';

                element.price_usd = '$' + commas(element.price_usd.toFixed(2));
                element.price_btc = element.price_btc.toFixed(5);
                element.change_1h = element.change_1h.toFixed(2) + '%';
                element.change_24h = element.change_24h.toFixed(2) + '%';
                element.change_7d = element.change_7d.toFixed(2) + '%';
                //element.rank = '#' + element.rank;

                element.market_cap = '$' + numWord(element.market_cap);
                element.market_cap_percent =
                    element.market_cap_percent.toFixed(2) + '%';

                element.volume_24h = '$' + numWord(element.volume_24h);
                element.volume_24h_percent =
                    element.volume_24h_percent.toFixed(2) + '%';
            });
        },
        loadMore: function() {
            this.loadingText = 'Loading...';

            const coins = this;

            $.getJSON(this.url + ++this.page, function (json) {
                coins.loadingText = 'Load more';

                coins.formatCoins(json.coins);
                coins.coins = coins.coins.concat(json.coins);
            });
        }
    },
    created() {
        this.init();
        navbarInfo(this.navInfo)
        this.navbar = getNavbar('coins');
        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {

            }
        )
    }
}
