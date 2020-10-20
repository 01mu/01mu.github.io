Vue.component('today-data', {
   props: ['name', 'a', 'b', 'flag', 'dest'],
   template:
   `
   <div class="flex">
        <div class="wrapper33">
            <a :href="'index.html#/' + dest + '/' + name">
                <img height="20" width="30" style="cursor: pointer;"
                    v-bind:title="name"
                    v-bind:src="flag"/>
            </a>
        </div>
        <div class="wrapper33">{{commas(a)}}</div>
        <div class="wrapper33">{{Number.parseFloat(b).toFixed(2)}}%</div>
   </div>
   `
});

Vue.component('today-margin', {
    props: ['url', 'data_confirmed', 'data_deaths', 'stats', 'loc', 'dest'],
    template:
    `
    <div class="col-sm-6">
        <center>
            <div class="box">
            <b>{{loc}}</b>
            <div class="smargin"></div>
            <img height="40" width="60" v-bind:src="url"/>
            <div class="smargin"></div>
            {{commas(stats.new_confirmed)}} New Confirmed Cases<br>
            {{commas(stats.new_deaths)}} New Deaths
            <div class="smargin"></div>
            {{commas(stats.confirmed)}} Total Confirmed Cases<br>
            {{commas(stats.deaths)}} Total Deaths<br>
            </div>
            <div class="box">
                <b>New Confirmed Cases<br>({{loc}})</b>
                <div class="smargin"></div>
                <today-data     v-for="place in data_confirmed"
                                v-bind:a="place.new_confirmed"
                                v-bind:b="place.new_confirmed_per"
                                v-bind:name="place[dest]"
                                v-bind:dest="dest"
                                v-bind:flag="place.url"></today-data>
            </div>
            <div class="box">
                <b>New Deaths<br>({{loc}})</b>
                <div class="smargin"></div>
                <today-data     v-for="place in data_deaths"
                                v-bind:a="place.new_deaths"
                                v-bind:b="place.new_deaths_per"
                                v-bind:name="place[dest]"
                                v-bind:dest="dest"
                                v-bind:flag="place.url"></today-data>
            </div>
        </center>
    </div>
    `
});

Vue.component('today-display', {
    props: ['global_stats', 'us_stats', 'global_confirmed', 'global_deaths',
        'us_confirmed', 'us_deaths', 'last_update'],
    template:
    `
    <span>
        <today-margin :loc="'World'"
            :dest="'country'"
            :data_confirmed="global_confirmed"
            :data_deaths="global_deaths"
            :stats="global_stats"
            :url="'https://smallfolio.bitnamiapp.com/flags/GLOBAL.PNG'">
        </today-margin>
        <today-margin :loc="'United States'"
            :dest="'state'"
            :data_confirmed="us_confirmed"
            :data_deaths="us_deaths"
            :stats="us_stats"
            :url="'https://smallfolio.bitnamiapp.com/flags/US.PNG'">
        </today-margin>
        <bottom></bottom>
    </span>
    `
});

const today = new Vue({
    el: '#today',
    data: {
        nav: 'today',
        url: 'https://smallfolio.bitnamiapp.com/covid-19/today',
        globalStats: [],
        usStats: [],
        globalConfirmed: [],
        globalDeaths: [],
        usConfirmed: [],
        usDeaths: [],
        lastUpdate: [],
        visible: false,
        isInit: false
    },
    methods: {
        init: function() {
            if(this.isInit) {
                this.visible = true;
                return;
            }

            $.getJSON(this.url, function (json) {
                today.globalStats = json.individual.global;
                today.usStats = json.individual.united_states;
                today.globalConfirmed = json.global.confirmed;
                today.globalDeaths = json.global.deaths;
                today.usConfirmed = json.united_states.confirmed;
                today.usDeaths = json.united_states.deaths;
                today.lastUpdate['global'] = json.global.last_update;
                today.lastUpdate['us'] = json.united_states.last_update;
                today.formatCountries();
                today.visible = true;
            });

            this.isInit = true;
        },
        formatCountries: function() {
            [this.globalConfirmed, this.globalDeaths].map(function(a) {
                a.map(function(element) {
                    element.url = 'https://smallfolio.bitnamiapp.com/' +
                        'flags/' + countryCode(element.country) + '.PNG';
                });
            });

            [this.usConfirmed, this.usDeaths].map(function(a) {
                a.map(function(element) {
                    element.url = 'https://smallfolio.bitnamiapp.com/' +
                    'state-flags/' +
                    replaceAll(element.state.toLowerCase(), " ", "-") + '.png';
                });
            });
        },
    }
});
