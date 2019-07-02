var single = new Vue({
    el: '#single',
    data: {
        visible: false,
        coin: 'BTC',
        limit: 30,
        lastMode: ''
    },
    methods: {
        setMinute: function() {
            var url = 'https://min-api.cryptocompare.com/data/histominute?fsym=' +
                this.coin + '&tsym=USD&limit=' + this.limit +
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

                json['Data'].forEach(function(element) {
                    var point = {};

                    point['t'] = luxon.DateTime.fromSeconds(element.time)
                        .valueOf();

                    point['o'] = element.open;
                    point['h'] = element.high;
                    point['l'] = element.low;
                    point['c'] = element.close;

                    dataset.push(point);
                });

                single.setChart(dataset, type);
            });
        },
        update: function(url, type) {
            localStorage.setItem('chart_limit', this.limit);

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
