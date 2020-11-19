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
        notice: '',
        st: 0
    },
    methods: {
        sort: function(type) {
            switch(type) {
                case 'name':
                    if(!biz.st)
                        z = (a, b) => (a.name_count > b.name_count) ? 1 : -1;
                    else
                        z = (a, b) => (a.name_count < b.name_count) ? 1 : -1;
                    break;
                default:
                    if(!biz.st)
                        z = (a, b) => (a.name_diff > b.name_diff) ? 1 : -1;
                    else
                        z = (a, b) => (a.name_diff < b.name_diff) ? 1 : -1;
                    break;
                }

            biz.st ^= 1;
            biz.bizCounts.sort(z);
        },
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
                    since(json.last_update_biz.input_value);
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

                element.name_diff =
                    Math.abs(element.name_count - element.name_count_prev);

                if(element.name_count < element.name_count_prev)
                    element.name_diff *= -1
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
