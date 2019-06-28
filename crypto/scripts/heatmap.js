var heatmap = new Vue({
    el: '#heatmap',
    data: {
        url: 'https://smallfolio.bitnamiapp.com/crypto/heatmap/',
        heatmap: [],
        page: 0,
        dates: [],
        lastUpdated: '',
        loadingText: 'Load more',
        visible: false,
        isInit: false
    },
    methods: {
        init: function() {
            if(!this.isInit) {
                $.getJSON(this.url + this.page, function (json) {
                    json['heat_map'][0].forEach(function(element) {
                        var date = new Date(element.time * 1000);
                        date = (date.getMonth() + 1) + '/' + date.getDate();

                        heatmap.dates.push(date);
                    });

                    heatmap.formatHM(json['heat_map']);
                    heatmap.setColors(json['heat_map']);
                    heatmap.heatmap = json['heat_map'];
                    heatmap.lastUpdated =
                        'Last updated ' +
                        since(json.last_update_heat_map.input_value);
                });
            }5

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
                case(diff >= 3): color = '#4dff88;'; break;
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

                heatmap.formatHM(json['heat_map']);
                heatmap.setColors(json['heat_map']);
                heatmap.heatmap = heatmap.heatmap.concat(json['heat_map']);
            });
        }
    }
});