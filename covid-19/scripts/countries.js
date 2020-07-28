Vue.component('case-data', {
   props: ['place', 'dest'],
   template:
   `
   <div class="flex">
        <div class="wrapper50">
            <img height="20" width="30"
                v-bind:src="place.url"/>
            <a :href="'index.html#/' + dest + '/' + place[dest]">
                {{place.loc}}
            </a>
        </div>
        <div class="wrapper25">{{commas(place.confirmed)}}</div>
        <div class="wrapper25">{{commas(place.deaths)}}</div>
   </div>
   `
});

Vue.component('case-table', {
    props: ['case_list', 'sort_option', 'opt', 'col'],
    template:
    `
    <span>
        <div class="flex">
            <div class="wrapper50">
                <a  v-bind:class="sort_option['loc']"
                    v-on:click="opt.sort('loc')">{{col}}</a>
                <div class="smargin"></div>
            </div>
            <div class="wrapper25">
                <a  v-bind:class="sort_option['confirmed']"
                    v-on:click="opt.sort('confirmed')">Confirmed</a>
                <div class="smargin"></div>
            </div>
            <div class="wrapper25">
                <a  v-bind:class="sort_option['deaths']"
                    v-on:click="opt.sort('deaths')">Deaths</a>
                <div class="smargin"></div>
            </div>
        </div>
        <case-data v-for="place in case_list"
            v-bind:dest="col.toLowerCase()"
            v-bind:place="place">
            </case-data>
    </span>
    `
});

const countries = new Vue({
    el: '#countries',
    data: {
        nav: 'countries',
        url: 'https://smallfolio.bitnamiapp.com/covid-19/countries',
        visible: false,
        isInit: false,
        countries: [],
        sortOption: {},
        sortToggle: 0
    },
    methods: {
        init: function() {
            if(this.isInit) {
                this.visible = true;
                return;
            }

            $.getJSON(this.url, function (json) {
                countries.countries = json;
                countries.format();
                countries.visible = true;
            });

            this.sortOption['confirmed'] = 'selected';
            this.isInit = true;
        },
        format: function() {
            this.countries.map(function(element) {
                element.loc = element.country;
                element.url = 'https://smallfolio.bitnamiapp.com/' +
                    'flags/' + countryCode(element.country) + '.PNG';
            });
        },
        sort: function(type) {
            if(!this.sortToggle) z = (a, b) => (a[type] > b[type]) ? 1 : -1;
            else z = (a, b) => (a[type] < b[type]) ? 1 : -1;

            this.sortOption[type] = 'selected';

            ['loc', 'confirmed', 'deaths'].forEach(function(p) {
                if(p != type) countries.sortOption[p] = 'not_selected';
            });

            this.sortToggle ^= 1;
            this.countries.sort(z);
        },
    }
});

const states = new Vue({
    el: '#states',
    data: {
        nav: 'states',
        url: 'https://smallfolio.bitnamiapp.com/covid-19/states',
        visible: false,
        isInit: false,
        states: [],
        sortOption: {},
        sortToggle: 0
    },
    methods: {
        init: function() {
            if(this.isInit) {
                this.visible = true;
                return;
            }

            $.getJSON(this.url, function (json) {
                states.states = json;
                states.format();
                states.visible = true;
            });

            this.sortOption['confirmed'] = 'selected';
            this.isInit = true;
        },
        format: function() {
            this.states.map(function(element) {
                element.loc = element.state;
                element.url = 'https://smallfolio.bitnamiapp.com/' +
                    'state-flags/' +
                    replaceAll(element.state.toLowerCase(), " ", "-") + '.png';
            });
        },
        sort: function(type) {
            if(!this.sortToggle) z = (a, b) => (a[type] > b[type]) ? 1 : -1;
            else z = (a, b) => (a[type] < b[type]) ? 1 : -1;

            this.sortOption[type] = 'selected';

            ['loc', 'confirmed', 'deaths'].forEach(function(p) {
                if(p != type) states.sortOption[p] = 'not_selected';
            });

            this.sortToggle ^= 1;
            this.states.sort(z);
        },
    }
});
