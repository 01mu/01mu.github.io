const HeatMap = {
    template: `
    <comp :destination="navbar" :info="navInfo"></comp>
    <loadingbar :showbar="showBar"></loadingbar>
    <div v-if="fullVisible">
    <table class="heatmap">
        <thead>
            <tr>
                <th></th>
                <template v-for="(date, index) in dates">
                        <th v-if="small && index > 16">{{ date.date }}</th>
                        <th v-else-if="!small">{{ date.date }}</th>
                </template>
            </tr>
        </thead>
        <tbody class="table">
            <template v-for="(hm, index) in heatmap">
                <tr>
                    <td style="text-align:center;">
                        <a :href="'index.html#/single/' + hm[0].symbol">
                            <img height="20" width="20"
                                style="cursor: pointer;"
                                v-bind:src="hm[0].icon"/>
                            </a>

                    </td>
                    <template v-for="(coin, index) in hm">
                        <td v-if="small && index > 16" v-bind:style="coin.color">
                            {{ coin.difference }}
                        </td>
                        <td v-else-if="!small" v-bind:style="coin.color">
                            {{ coin.difference }}
                        </td>
                    </template>
                </tr>
            </template>
            <tr class="ave" v-if="showAve">
                <td class="ave"><b>μ</b></td>
                <template v-for="(ave, index) in averages">
                        <td v-if="small && index > 16" style="background-color: #b3e0ff;">
                            {{ ave }}
                        </td>
                        <td v-else-if="!small" style="background-color: #b3e0ff;">
                            {{ ave }}
                        </td>
                </template>
            </tr>
        </tbody>
    </table>
    <div style="margin: 16px">
        <button class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
            {{ loadingText }}
        </button>
    </div>
    </div>
    `,
    data() {
        return {
            navInfo: [],
            fullVisible: false,
            showBar: true,
            nav: 'heatmap',
            url: 'https://smallfolio.bitnamiapp.com/crypto/heatmap/',
            heatmap: [],
            page: 0,
            dates: [],
            lastUpdated: '',
            loadingText: 'Load more',
            visible: false,
            isInit: false,
            small: false,
            averages: [],
            showAve: false,
            hide: 'd-none d-sm-block'
        }
    },
    components: {

    },
    methods: {
        init: function() {
            if(this.isInit) {
                return;
            }

            const heatmap = this;

            $.getJSON(this.url + this.page, function (json) {
                json['heat_map'][0].forEach(function(element) {
                    date = new Date(element.time * 1000);
                    d = (date.getMonth() + 1) + '/' + date.getDate();
                    heatmap.dates.push({'date': d, 'style': 'hidden-xs'});
                });

                heatmap.getAverages(json['heat_map']);
                heatmap.formatHM(json['heat_map']);
                heatmap.setColors(json['heat_map']);
                heatmap.heatmap = json['heat_map'];

                heatmap.lastUpdated =
                    'Last updated ' +
                    since(json.last_update_heat_map.input_value);
                heatmap.showBar = false;
                heatmap.fullVisible = true;
            });

            this.isInit = true;
        },
        formatHM: function(hm) {
            hm.forEach(function(coin) {
                coin[0].icon = 'https://smallfolio.bitnamiapp.com/' +
                    'crypto_icons/color/' + coin[0].symbol.toLowerCase() +
                    '.png';
            });

            hm.forEach(function(coin) {
                coin.forEach(function(element) {
                    element.difference = element.difference.toFixed(2);
                });
            });
        },
        getColor: function(diff) {
            switch(true) {
                case(diff < 0 && diff > -.5): color = '#ffc2b3;'; break;
                case(diff <= -.5 && diff > -1): color = '#ffad99;'; break;
                case(diff <= -1 && diff > -2): color = '#ff9980;'; break;
                case(diff <= -2 && diff > -3): color = '#ff8566;'; break;
                case(diff <= -3): color = '#ff704d;'; break;
                case(diff >= 0 && diff < .5): color = '#b3ffcc;'; break;
                case(diff >= .5 && diff < 1): color = '#99ffbb;'; break;
                case(diff >= 1 && diff < 2): color = '#80ffaa;'; break;
                case(diff >= 2 && diff < 3): color = '#66ff99;'; break;
                default: color = '#4dff88;';
            }

            return 'background-color:' + color;
        },
        setColors: function(hm) {
            const heatmap = this;

            hm.forEach(function(coin) {
                coin.forEach(function(element) {
                    var difference = element.difference;
                    element.color = heatmap.getColor(difference);
                });
            });
        },
        loadMore: function() {
            this.loadingText = 'Loading...';
            const heatmap = this;

            $.getJSON(this.url + ++this.page, function (json) {
                heatmap.loadingText = 'Load more';
                heatmap.getAverages(json['heat_map']);
                heatmap.formatHM(json['heat_map']);
                heatmap.setColors(json['heat_map']);
                heatmap.heatmap = heatmap.heatmap.concat(json['heat_map']);
            });
        },
        getAverages: function(hm) {
            var totals = [];

            for(var i = 0; i < 21; i++) {
                totals[i] = 0;
            }

            hm.forEach(function(coin) {
                for(var i = 0; i < coin.length; i++) {
                    totals[i] += coin[i].difference;
                }
            });

            for(var i = 0; i < 21; i++) {
                totals[i] = (totals[i] / 21).toFixed(2);
            }

            this.averages = totals;
            this.showAve = true;
        }
    },
    created() {
        if(screen.width <= 600) {
            this.small = true;
        }

        this.init();
        this.navbar = getNavbar('heatmap');
        navbarInfo(this.navInfo)

        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {

            }
        )
    }
}
