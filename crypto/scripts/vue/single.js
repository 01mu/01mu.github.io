var single = new Vue({
    el: '#single',
    data: {
        coinHistoryDisplay: 6,
        visible: false,
        coin: 'BTC',
        limit: 30,
        lastMode: '',
        recentCoins: [],
        recentIcons: [],
        coinInfo: {'icon' : '', 'open': 0, 'close': 0, 'high': 0, 'low': 0,
            'change': 0}
    },
    methods: {
        setMinute: function() {
            var url = 'https://min-api.cryptocompare.com/data/histominute' +
                '?fsym=' + this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=1&e=CCCAGG';

            this.upaux(url, '(Minute)');
            localStorage.setItem('chart_mode', 'minute');
        },
        setHourly: function() {
            var url = 'https://min-api.cryptocompare.com/data/histohour?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=1&e=CCCAGG';

            this.upaux(url, '(Hour)');
            localStorage.setItem('chart_mode', 'hour');
        },
        setDaily: function() {
            var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=1&e=CCCAGG';

            this.upaux(url, '(Day)');
            localStorage.setItem('chart_mode', 'day');
        },
        setWeekly: function() {
            var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=7&e=CCCAGG';

            this.upaux(url, '(Week)');
            localStorage.setItem('chart_mode', 'week');
        },
        setMonthly: function() {
            var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
                '&aggregate=30&e=CCCAGG';

            this.upaux(url, '(Month)');
            localStorage.setItem('chart_mode', 'month');
        },
        setChart: function(dataset, type) {
            document.getElementById('coinChart').outerHTML =
                '<canvas id="coinChart"></canvas>';

            var ctx = document.getElementById('coinChart').getContext('2d');

            var options = {
                scales: {
                    xAxes: [{
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

            new Chart(ctx, {
                type: 'candlestick',
                data: {
                    datasets: [{
                        label: single.coin + ' ' + type,
                        data: dataset
                    }]
                },
                options: options
            });
        },
        upaux: function(url, type) {
            $.getJSON(url, function (json) {
                var dataset = [];
                var response = json['Response'];

                if(response == 'Error')  {
                    single.coin = 'Error';
                } else {
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
                }
            });
        },
        setCoinInfo: function(highest, lowest) {
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

            this.recentCoins.forEach(function(element) {
                var icon = 'https://smallfolio.bitnamiapp.com/' +
                    'crypto_icons/color/' + element.toLowerCase() +
                    '.png';

                single.recentIcons.push(icon);
            });
        },
        updateCoinHistory: function() {
            var oldHis = JSON.parse(localStorage.getItem('coin_history'));

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
            localStorage.setItem('chart_limit', this.limit);

            single.coinInfo['icon'] =
                'https://smallfolio.bitnamiapp.com/' +
                'crypto_icons/color/' + single.coin.toLowerCase() +
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
    created: function() {
        if(localStorage.getItem('chart_limit') == undefined) {
            this.limit = 30;
        } else {
            this.limit = localStorage.getItem('chart_limit');
        }
    }
});
