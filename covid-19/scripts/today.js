Vue.component('today-data', {
   props: ['name', 'a', 'b', 'flag', 'dest'],
   template:
   `
   <div class="flex">
        <div class="wrapper33">
            <a :href="'index.html#/' + dest + '/' + name">
                <img height="20" width="30"
                    style="cursor: pointer;"
                    v-bind:title="name"
                    v-bind:src="flag"/>
            </a>
        </div>
        <div class="wrapper33">{{commas(a)}}</div>
        <div class="wrapper33">
            {{Number.parseFloat(b).toFixed(2)}}%
        </div>
   </div>
   `
});

Vue.component('today-display', {
    props: ['global_stats', 'us_stats', 'global_confirmed', 'global_deaths',
        'us_confirmed', 'us_deaths', 'last_update'],
    template:
    `
    <span>
        <div class="col-sm-6">
            <center>
                <div class="box">
                <b>World</b>
                <div class="smargin"></div>
                <img height="40" width="60"
                    src="https://smallfolio.bitnamiapp.com/flags/GLOBAL.PNG"/>
                <div class="smargin"></div>
                {{commas(global_stats.new_confirmed)}} New Confirmed Cases<br>
                {{commas(global_stats.new_deaths)}} New Deaths
                <div class="smargin"></div>
                {{commas(global_stats.confirmed)}} Total Confirmed Cases<br>
                {{commas(global_stats.deaths)}} Total Deaths<br>
                </div>
                <div class="box">
                    <b>New Confirmed Cases (World)</b>
                    <div class="smargin"></div>
                    <today-data     v-for="place in global_confirmed"
                                    v-bind:a="place.new_confirmed"
                                    v-bind:b="place.new_confirmed_per"
                                    v-bind:name="place.country"
                                    v-bind:dest="'country'"
                                    v-bind:flag="place.url"></today-data>
                </div>
                <div class="box">
                    <b>New Deaths (World)</b>
                    <div class="smargin"></div>
                    <today-data     v-for="place in global_deaths"
                                    v-bind:a="place.new_deaths"
                                    v-bind:b="place.new_deaths_per"
                                    v-bind:name="place.country"
                                    v-bind:dest="'country'"
                                    v-bind:flag="place.url"></today-data>
                </div>
            </center>
        </div>
        <div class="col-sm-6">
            <center>
                <div class="box">
                <b>United States</b>
                <div class="smargin"></div>
                <img height="40" width="60"
                    src="https://smallfolio.bitnamiapp.com/flags/US.PNG"/>
                <div class="smargin"></div>
                {{commas(us_stats.new_confirmed)}} New Confirmed Cases<br>
                {{commas(us_stats.new_deaths)}} New Deaths
                <div class="smargin"></div>
                {{commas(us_stats.confirmed)}} Total Confirmed Cases<br>
                {{commas(us_stats.deaths)}} Total Deaths<br>
                </div>
                <div class="box">
                    <b>New Confirmed Cases (US)</b>
                    <div class="smargin"></div>
                    <today-data     v-for="place in us_confirmed"
                                    v-bind:a="place.new_confirmed"
                                    v-bind:b="place.new_confirmed_per"
                                    v-bind:name="place.state"
                                    v-bind:dest="'state'"
                                    v-bind:flag="place.url"></today-data>
                </div>
                <div class="box">
                    <b>New Deaths (US)</b>
                    <div class="smargin"></div>
                    <today-data     v-for="place in us_deaths"
                                    v-bind:a="place.new_deaths"
                                    v-bind:b="place.new_deaths_per"
                                    v-bind:name="place.state"
                                    v-bind:dest="'state'"
                                    v-bind:flag="place.url"></today-data>
                </div>
            </center>
        </div>
    </span>
    `
});

const today = new Vue({
    el: '#today',
    data: {
        nav: 'today',
        url: 'https://smallfolio.bitnamiapp.com/covid-19/today',
        //url: 'http://127.0.0.1:8000/today/',
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
