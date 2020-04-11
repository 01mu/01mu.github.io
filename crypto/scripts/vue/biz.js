var biz = new Vue({
    el: '#biz',
    data: {
        nav: 'mentions',
        url: 'https://smallfolio.bitnamiapp.com/crypto/biz/',
        rank: 50,
        bizCounts: [],
        lastUpdated: '',
        visible: false,
        isInit: false,
        notice: ''
    },
    methods: {
        load: function() {
            var limit = localStorage.getItem('biz_rank');

            if(limit == null) {
                this.rank = 50;
            } else {
                this.rank = limit;
            }

            var url = this.url + this.rank + '/0';

            $.getJSON(url, function (json) {
                biz.formatCounts(json['biz']);
                biz.bizCounts = json['biz'];

                biz.lastUpdated =
                    'Last updated ' +
                    since(json.last_update_biz_counts.input_value);
            });
        },
        updateRank: function() {
            if(this.rank <= 0 || this.rank > 500 || isNaN(this.rank)) {
                this.notice = 'Range: 1 to 500';
            } else {
                localStorage.setItem('biz_rank', this.rank);

                this.page = 0;
                this.load();
            }
        },
        formatCounts: function(counts) {
            counts.map(function(element) {
                element.url = 'https://smallfolio.bitnamiapp.com/' +
                    'crypto_icons/color/' + element.symbol.toLowerCase() +
                    '.png';

                if(element.change_24h > 0) {
                    element.change_24h = '+' + element.change_24h
                }
            });
        },
        init: function() {
            if(!this.isInit) {
                this.load();
            }

            this.isInit = true;
        }
    }
});
