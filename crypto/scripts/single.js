const Single = {
    template: `
    <comp :destination="navbar"></comp>
    <loadingbar :showbar="showBar"></loadingbar>
    <div class="hm">
        <div class="row">
            <div class="col-sm-10">
                <div class="singleinfo">
                    <img height="20" width="20"
                    onerror="this.style.display='none'"
                    v-bind:src="this.coinInfo['icon']"/>&nbsp;
                    <b>{{ coin }}</b>
                </div>
                <schart></schart>
                <div style="margin: 16px;"></div>

                <div class="d-none d-sm-block">
                    <div class="input-group">
                        <button class="btn btn-outline-primary" v-on:click="setMinute()">
                        Minutes</button>&nbsp;
                        <button class="btn btn-outline-primary" v-on:click="setHourly()">
                        Hours</button>&nbsp;
                        <button class="btn btn-outline-primary" v-on:click="setDaily()">
                        Days</button>&nbsp;
                        <button class="btn btn-outline-primary" v-on:click="setWeekly()">
                        Weeks</button>&nbsp;
                        <button class="btn btn-outline-primary" v-on:click="setMonthly()">
                        Months</button>&nbsp;
                        <input v-on:keyup.enter="update()"
                            placeholder="Span" v-model="limit" class="form-control">&nbsp;
                        <button class="btn btn-outline-primary" v-on:click="update()">
                            Set span
                        </button>
                    </div>
                </div>

                <div class="d-block d-sm-none">
                    <div style="text-align: center;">
                    <button class="btn btn-outline-primary" v-on:click="setMinute()">
                    Minutes</button>&nbsp;
                    <button class="btn btn-outline-primary" v-on:click="setHourly()">
                    Hours</button>&nbsp;
                    <button class="btn btn-outline-primary" v-on:click="setDaily()">
                    Days</button>&nbsp;<div style="margin: 16px;"></div>
                    <button class="btn btn-outline-primary" v-on:click="setWeekly()">
                    Weeks</button>&nbsp;
                    <button class="btn btn-outline-primary" v-on:click="setMonthly()">
                    Months</button>&nbsp;
                    </div>
                    <div style="margin: 16px;"></div>
                    <div class="input-group">
                        <input v-on:keyup.enter="update()"
                            placeholder="Span" v-model="limit" class="form-control">&nbsp;
                        <button class="btn btn-outline-primary" v-on:click="update()">
                            Set span
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-sm-2">
                <div class="singleinfo"><b>Info</b></div>
                <div class="singleinfo">
                        <img src="nav/cmc.png" height="16" width="16">
                        Open: {{ coinInfo.open }}
                </div>
                <div class="singleinfo">
                        <img src="nav/cmc.png" height="16" width="16">
                        Close: {{ coinInfo.close }}
                </div>
                <div class="singleinfo">
                        <img src="nav/cmc.png" height="16" width="16">
                        Change: {{ coinInfo.change }}
                </div>
                <div class="singleinfo">
                        <img src="nav/cmc.png" height="16" width="16">
                        High: {{ coinInfo.high }}
                </div>
                <div class="singleinfo">
                        <img src="nav/cmc.png" height="16" width="16">
                        Low: {{ coinInfo.low }}
                </div>
                <div class="singleinfo"><b>Recent Coins</b></div>
                <template v-for="(coin, index) in recentCoins">
                    <div class="singleinfo">
                        <a :href="'index.html#/single/' + recentCoins[index]">
                            <img height="20" width="20"
                                style="cursor: pointer;"
                                v-bind:src="recentIcons[index]"/>
                        </a>&nbsp;
                        <a :href="'index.html#/single/' + recentCoins[index]">
                            {{ recentCoins[index] }}
                        </a>
                    </div>
                </template>
           </div>
        </div>
    </div>
    `,
    data() {
        return {
        coinChart: null,
        showBar: true,
        coinHistoryDisplay: 6,
        visible: false,
        coin: 'BTC',
        limit: 30,
        lastMode: '',
        recentCoins: [],
        recentIcons: [],
        coinInfo: {'icon' : '', 'open': 0, 'close': 0, 'high': 0, 'low': 0,
            'change': 0}
        }
    },
    components: {
        optbuttons: {
            props: ['hm'],
            template:
            `
                <button class="btn btn-outline-primary" v-on:click="setMinute()">
                Minutes</button>&nbsp;
                <button class="btn btn-outline-primary" v-on:click="setHourly()">
                Hours</button>&nbsp;
                <button class="btn btn-outline-primary" v-on:click="setDaily()">
                Days</button>&nbsp;
                <button class="btn btn-outline-primary" v-on:click="setWeekly()">
                Weeks</button>&nbsp;
                <button class="btn btn-outline-primary" v-on:click="setMonthly()">
                Months</button>&nbsp;
            `
        },
        schart: {
            template:
            `<div style="display: block;"><canvas id="coinChart"></canvas></div>`
        }
    },
    methods: {
        setMinute: function() {
            var url = 'https://min-api.cryptocompare.com/data/histominute' +
                '?fsym=' + this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=1&e=CCCAGG';

            this.upaux(url, '(' + this.limit + ' Minutes)');
            localStorage.setItem('chart_mode', 'minute');
        },
        setHourly: function() {
            var url = 'https://min-api.cryptocompare.com/data/histohour?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=1&e=CCCAGG';

            this.upaux(url, '(' + this.limit + ' Hours)');
            localStorage.setItem('chart_mode', 'hour');
        },
        setDaily: function() {
            var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=1&e=CCCAGG';

            this.upaux(url, '(' + this.limit + ' (Days)');
            localStorage.setItem('chart_mode', 'day');
        },
        setWeekly: function() {
            var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=7&e=CCCAGG';

            this.upaux(url, '(' + this.limit + ' Weeks)');
            localStorage.setItem('chart_mode', 'week');
        },
        setMonthly: function() {
            var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=30&e=CCCAGG';

            this.upaux(url, '(' + this.limit + ' Months)');
            localStorage.setItem('chart_mode', 'month');
        },
        setChart: function(dataset, type) {
            if(this.coinChart == null) {
                const single = this;
                var ctx = document.getElementById('coinChart').getContext('2d');

                var options = {
                    elements: {
                        point:{
                            radius: 0
                        }
                    },
                    maintainAspectRatio: false ,
                    tooltips: {
                        mode: 'x-axis'
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10
                            },
                            gridLines: {
                                display:false
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display:false
                            }
                        }]
                    }
                };

                var ch = new Chart(ctx, {
                    type: 'candlestick',
                    data: {
                        datasets: [{
                            label: single.coin + ' ' + type,
                            data: dataset
                        }]
                    },
                    options: options
                });

                if(screen.width <= 600) {
                    ch.canvas.parentNode.style.height = '400px';
                } else {
                    ch.canvas.parentNode.style.height = '500px';
                }

                this.coinChart = ch;
            } else {
                this.coinChart.data.datasets[0].label = this.coin + ' ' + type;
                this.coinChart.data.datasets[0].data = dataset;
                this.coinChart.update();
            }
        },
        upaux: function(url, type) {
            const single = this;

            $.getJSON(url, function (json) {
                var dataset = [];
                var response = json['Response'];

                if(response == 'Error')  {
                    single.coin = 'Error';
                    return;
                }

                var highest = 0;
                var lowest = Number.MAX_SAFE_INTEGER;

                for(var i = 0; i < json['Data'].length; i++) {
                    var element = json['Data'][i];
                    var point = {};

                    point['t'] = luxon.DateTime.fromSeconds(element.time)
                        .valueOf();

                    point['o'] = element.open;
                    point['h'] = element.high;
                    point['l'] = element.low;
                    point['c'] = element.close;

                    dataset.push(point);

                    if(i === 0) {
                        single.coinInfo['open'] = element.high
                    }

                    if(i === json['Data'].length - 1) {
                        single.coinInfo['close'] = element.high
                    }

                    if(element.high > highest) {
                        highest = element.high;
                    }

                    if(element.high < lowest) {
                        lowest = element.high;
                    }
                }

                single.setCoinInfo(highest, lowest);
                single.setChart(dataset, type);
                single.updateCoinHistory();
                single.setRecentCoins();
                single.showBar = false;
            });
        },
        setCoinInfo: function(highest, lowest) {
            const single = this;

            single.coinInfo['change'] = single.getChange(
                single.coinInfo['close'],
                single.coinInfo['open']);

            single.coinInfo['high'] = '$' + commas(highest.toFixed(2));
            single.coinInfo['low'] = '$' + commas(lowest.toFixed(2));

            single.coinInfo['open'] = '$' + commas(single.coinInfo['open']
                .toFixed(2));

            single.coinInfo['close'] = '$' + commas(single.coinInfo['close']
                .toFixed(2));
        },
        getChange: function(current, previous) {
            if(current === previous || previous === 0) {
                return 0;
            }

            var v = (Math.abs(current - previous) / previous) * 100;

            if(current < previous) {
                v *= -1;
            }

            return v.toFixed(2) + '%';
        },
        setRecentCoins: function() {
            this.recentCoins = JSON.parse(localStorage.getItem('coin_history'))
                .reverse();

            this.recentIcons = [];
            const single = this;

            this.recentCoins.forEach(function(element) {
                var icon = 'https://smallfolio.bitnamiapp.com/' +
                    'crypto_icons/color/' + element.toLowerCase() +
                    '.png';

                single.recentIcons.push(icon);
            });
        },
        updateCoinHistory: function() {
            var oldHis = JSON.parse(localStorage.getItem('coin_history'));
            const single = this;

            if(oldHis == undefined) {
                var newHis = [this.coin];

                localStorage.setItem('coin_history', JSON.stringify(newHis));
            } else {
                var toStr = [];

                oldHis = JSON.parse(localStorage.getItem('coin_history'));

                if(!oldHis.includes(this.coin)) {
                    oldHis.push(this.coin);
                }

                if(oldHis.length > single.coinHistoryDisplay) {
                    for(var i = 1; i < oldHis.length; i++) {
                        toStr[i - 1] = oldHis[i];
                    }
                } else {
                    toStr = oldHis;
                }

                localStorage.setItem('coin_history', JSON.stringify(toStr));
            }
        },
        update: function(url, type) {
            //this.coin = this.$route.params.id;

            localStorage.setItem('chart_limit', this.limit);

            this.coinInfo['icon'] =
                'https://smallfolio.bitnamiapp.com/' +
                'crypto_icons/color/' + this.coin.toLowerCase() +
                '.png';

            switch(localStorage.getItem('chart_mode')) {
                case 'minute':
                    this.setMinute(); break;
                case 'hour':
                    this.setHourly(); break;
                case 'day':
                    this.setDaily(); break;
                case 'week':
                    this.setWeekly(); break;
                case 'month':
                    this.setMonthly(); break;
                default:
                    this.setDaily(); break;
            }
        }
    },
    created() {
        this.coin = this.$route.params.id;

        this.navbar = getNavbar('coins');
        if(localStorage.getItem('chart_limit') == undefined) {
            this.limit = 30;
        } else {
            this.limit = localStorage.getItem('chart_limit');
        }

        this.update();

        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {
                if(!isEmpty(toParams)) {
                    this.coin = this.$route.params.id;
                    this.update();
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                }
            }
        )
    }
}
