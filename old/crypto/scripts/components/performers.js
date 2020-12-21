Vue.component('performers', {
    props: ['performer', 'index'],
    template:
    `
    <div :class="{'flex r0 perfthing': index % 2 === 0, 'flex r1 perfthing': index % 2 !== 0 }">
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
});

Vue.component('performerstable', {
    props:['performers'],
    template:
    `
    <div class="row">
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
    `
});

Vue.component('performersfooter', {
    props:['lastupdated', 'notice', 'loadingtext', 'rank'],
    template:
    `
    <span>
        <div class="smalltext">
            {{ lastupdated }}<br>
            Rank limit: <input v-on:keyup.enter="performers.updateRank()"
                placeholder="Rank limit" v-model="performers.rank"></input>
            <span class="smalllink" v-on:click="performers.updateRank()">
                Update
            </span>
            <b>{{ notice }}</b>
        </div>
        <div class="loadmore" v-on:click="performers.loadMore">
            {{ loadingtext }}
        </div>
    </span>
    `
});
