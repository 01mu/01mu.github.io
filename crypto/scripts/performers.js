const Performers = {
    template: `
    <comp :destination="navbar" :info="navInfo"></comp>
    <loadingbar :showbar="showBar"></loadingbar>
    <div v-if="fullVisible" style="margin-left: 8px; margin-right: 8px;">

    <div class="bigger row fm">
        <div class="col-sm-4">
            <div class="perfheader">1 Hour Change</div>
            <div class="flex">
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_1h_desc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_1h_asc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="perfheader">24 Hour Change</div>
            <div class="flex">
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_24h_desc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
                <div class="wrapper50">
                    <performers  v-for="(p, index) in performers['change_24h_asc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="perfheader">7 Day Change</div>
            <div class="flex">
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_7d_desc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
                <div class="wrapper50">
                    <performers v-for="(p, index) in performers['change_7d_asc']"
                        v-bind:performer="p" v-bind:index="index"></performers>
                </div>
            </div>
        </div>
    </div>
    <div class="bigger">
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
        <span style="margin: 16px">
            <button class="btn btn-block btn-outline-primary" v-on:click="loadMore()">
                {{ loadingText }}
            </button>
        </span>
    </div>

    </div>
    `,
    data() {
        return {
            navInfo: [],
            fullVisible: false,
            showBar: true,
            nav: 'performers',
            url: 'https://01mu.bitnamiapp.com/crypto/performers/',
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
            noticeVisible: false,
            notice: ''
        }
    },
    components: {
        performers: {
            props: ['performer', 'index'],
            template:
            `
            <div class="flex" style="margin-top: 16px; margin-bottom: 16px;">
                <div class="wrapper50 overflow">
                    <a :href="'index.html#/single/' + performer.symbol">
                        <img height="20" width="20"
                            style="cursor: pointer;"
                            v-on:click="head.showSingle(performer.symbol)"
                            v-bind:src="performer.url"/>
                    </a>
                    &nbsp;
                    <a :href="'index.html#/single/' + performer.symbol">
                        {{ performer.symbol }}
                    </a>
                </div>
                <div class="wrapper50 overflow">
                    {{ performer.change.toFixed(2) }}%
                </div>
            </div>
            `
        }
    },
    methods: {
        showError (text) {
            const p = this;
            this.notice = text;
            this.noticeVisible = 1;
            clearInterval(this.timer);
            this.timer = setTimeout(function() { p.noticeVisible = 0; }, 1500);
        },
        load: function() {
            var limit = localStorage.getItem('performers_rank');

            if(limit == null) {
                this.rank = 10;
            } else {
                this.rank = limit;
            }

            const performers = this;

            $.getJSON(this.url + this.rank + '/' + this.page,
                function (json) {

                performers.formatPerformers(json);
                performers.performers = json;
                performers.lastUpdated =
                    'Last updated ' +
                    since(json.last_update_coins.input_value);
                performers.showBar = false;
                performers.fullVisible = true;
            });
        },
        updateRank: function() {
            if(this.rank <= 0 || this.rank > 500 || isNaN(this.rank)) {
                this.showError("Invalid range: 1 to 500");
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
                    element.url = 'https://01mu.bitnamiapp.com/' +
                        'graphics/crypto/' + element.symbol.toLowerCase() +
                        '.png';
                });
            });
        },
        loadMore: function() {
            var url = this.url + this.rank + '/' + ++this.page;

            this.loadingText = 'Loading...';
            const performers = this;

            $.getJSON(url, function (json) {
                performers.formatPerformers(json);

                performers.performerTypes.forEach(function(p) {
                    performers.performers[p] = performers.performers[p]
                        .concat(json[p]);
                });

                performers.loadingText = 'Load more';
            });
        }
    },
    created() {
        this.init();

        navbarInfo(this.navInfo)
        this.navbar = getNavbar('performers');

        this.$watch(() => this.$route.params,
            (toParams, previousParams) => {

            }
        )
    }
}
