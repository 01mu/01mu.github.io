var heatmap = new Vue({
    el: '#heatmap',
    data: {
        nav: 'heatmap',
        url: 'https://smallfolio.bitnamiapp.com/crypto/heatmap/',
        heatmap: [],
        page: 0,
        dates: [],
        lastUpdated: '',
        loadingText: 'Load more',
        visible: false,
        isInit: false,
        averages: [],
        showAve: false,
        hide: 'hidden-xs'
    },
    methods: {
        init: function() {
            if(this.isInit) {
                return;
            }

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
            hm.forEach(function(coin) {
                coin.forEach(function(element) {
                    var difference = element.difference;
                    element.color = heatmap.getColor(difference);
                });
            });
        },
        loadMore: function() {
            this.loadingText = 'Loading...';

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
    }
});
