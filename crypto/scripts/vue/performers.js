var performers = new Vue({
    el: '#performers',
    data: {
        nav: 'performers',
        url: 'https://smallfolio.bitnamiapp.com/crypto/performers/',
        performers: [],
        performerTypes: ['change_1h_asc', 'change_1h_desc',
            'change_24h_asc', 'change_24h_desc',
            'change_7d_asc', 'change_7d_desc'],
        rank: 0,
        page: 0,
        visible: false,
        lastUpdated: '',
        loadingText: 'Load more',
        isInit: false,
        notice: ''
    },
    methods: {
        load: function() {
            var limit = localStorage.getItem('performers_rank');

            if(limit == null) {
                this.rank = 50;
            } else {
                this.rank = limit;
            }

            $.getJSON(this.url + this.rank + '/' + this.page,
                function (json) {

                performers.formatPerformers(json);
                performers.performers = json;
                performers.lastUpdated =
                    'Last updated ' +
                    since(json.last_update_coins.input_value);
            });
        },
        updateRank: function() {
            if(this.rank <= 0 || this.rank > 500 || isNaN(this.rank)) {
                this.notice = 'Range: 1 to 500';
            } else {
                localStorage.setItem('performers_rank', this.rank);

                this.page = 0;
                this.load();
            }
        },
        init: function() {
            if(!this.isInit) {
                this.load();
            }

            this.isInit = true;
        },
        formatPerformers: function(json) {
            this.performerTypes.forEach(function(p) {
                json[p].map(function(element) {
                    element.url = 'https://smallfolio.bitnamiapp.com/' +
                        'crypto_icons/color/' + element.symbol.toLowerCase() +
                        '.png';
                });
            });
        },
        loadMore: function() {
            var url = this.url + this.rank + '/' + ++this.page;

            this.loadingText = 'Loading...';

            $.getJSON(url, function (json) {
                performers.formatPerformers(json);

                performers.performerTypes.forEach(function(p) {
                    performers.performers[p] = performers.performers[p]
                        .concat(json[p]);
                });

                performers.loadingText = 'Load more';
            });
        }
    }
})
