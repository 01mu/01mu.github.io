const Biz = {
    template: `
    <comp :destination="navbar" :info="navInfo"></comp>
    <loadingbar :showbar="showBar"></loadingbar>
    <div v-if="fullVisible" class="body">
        <div class="flex coinheader">
            <div class="bizl">Coin</div>
            <div class="wrapper33 d-none d-sm-block">24 Hour Change</div>
            <div class="bizr overflow">Name Mentions (24 Hours)</div>
        </div>
        <template v-for="(count, index) in bizCounts">
            <div class="flex" style="margin-top: 16px; margin-bottom: 16px;">
            <div class="bizl overflow">
                <a :href="'index.html#/single/' + count.symbol">
                    <img height="20" width="20"
                        style="cursor: pointer;"
                        v-on:click="head.showSingle(count.symbol)"
                        :src="count.url"/>
                </a>&nbsp;
                <a :href="'index.html#/single/' + count.symbol">
                    {{ count.name }}
                </a>
            </div>
            <div class="wrapper33 d-none d-sm-block">{{ count.name_diff }}</div>
            <div class="bizr">
                <span class="d-block d-sm-none">
                    {{ count.name_count }}&nbsp;({{ count.name_diff }})
                </span>
                <span class="d-none d-sm-block">{{ count.name_count }}</span>
            </div>
            </div>
        </template>
        <div v-if="noticeVisible" class="alert alert-danger" role="alert">
            <b>{{ notice }}</b>
        </div>
        <div class="input-group">
            <input v-on:keyup.enter="updateRank()"
                placeholder="Rank limit" v-model="rank" class="form-control">&nbsp;
            <button class="btn btn-outline-primary" v-on:click="updateRank()">
                Set rank limit
            </button>
        </div>
    </div>
    `,
    data() {
        return {
            navInfo: [],
            fullVisible: false,
            showBar: true,
            nav: 'mentions',
            url: 'https://smallfolio.bitnamiapp.com/crypto/biz/',
            rank: 50,
            bizCounts: [],
            lastUpdated: '',
            visible: false,
            noticeVisible: false,
            isInit: false,
            notice: '',
            st: 0
        }
    },
    components: {

    },
    methods: {
        showError (text) {
            const p = this;
            this.notice = text;
            this.noticeVisible = 1;
            clearInterval(this.timer);
            this.timer = setTimeout(function() { p.noticeVisible = 0; }, 1500);
        },
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

            this.st ^= 1;
            this.bizCounts.sort(z);
        },
        load: function() {
            var limit = localStorage.getItem('biz_rank');

            if(limit == null) {
                this.rank = 50;
            } else {
                this.rank = limit;
            }

            var url = this.url + this.rank + '/0';
            const biz = this;

            $.getJSON(url, function (json) {
                biz.formatCounts(json['biz']);
                biz.bizCounts = json['biz'];

                biz.lastUpdated =
                    'Last updated ' +
                    since(json.last_update_biz.input_value);
                biz.showBar = false;
                biz.fullVisible = true;
            });
        },
        updateRank: function() {
            if(this.rank <= 0 || this.rank > 500 || isNaN(this.rank)) {
                this.showError('Range: 1 to 500');
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

                if(element.name_count < element.name_count_prev) {
                    element.name_diff *= -1
                } else {
                    element.name_diff = '+' + element.name_diff
                }
            });
        },
        init: function() {
            if(!this.isInit) {
                this.load();
            }

            this.isInit = true;
        }
    },
    created() {
        this.init();
        navbarInfo(this.navInfo)
        this.navbar = getNavbar('mentions');
        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {

            }
        )
    }
}
