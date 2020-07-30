Vue.component('case-data', {
   props: ['place', 'dest', 'show_l', 'show_r'],
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
        <div class="wrapper25">{{commas(place[show_l])}}</div>
        <div class="wrapper25">{{commas(place[show_r])}}</div>
   </div>
   `
});

Vue.component('case-table', {
    props: ['case_list', 'sort_option', 'opt', 'col', 'show_l', 'show_r', 'picked'],
    template:
    `
    <span>
        <div class="box">
            <form>
                <label class="radio-inline">
                    <input type="radio" id="one" value="Total"
                        v-model="picked"
                        v-on:click="opt.setType('total')">
                        Total Confirmed / Total Deaths
                </label>
                <label class="radio-inline">
                    <input type="radio" id="two" value="New"
                        v-model="picked"
                        v-on:click="opt.setType('new')">
                        New Confirmed / New Deaths
                </label>
            </form>
        </div>
        <div class="smargin"></div>
        <div class="flex">
            <div class="wrapper50">
                <a  v-bind:class="sort_option['loc']"
                    v-on:click="opt.sort('loc')">{{col}}</a>
                <div class="smargin"></div>
            </div>
            <div class="wrapper25">
                <a  v-bind:class="sort_option[show_l[1]]"
                    v-on:click="opt.sort(show_l[1])">{{show_l[0]}}</a>
                <div class="smargin"></div>
            </div>
            <div class="wrapper25">
                <a  v-bind:class="sort_option[show_r[1]]"
                    v-on:click="opt.sort(show_r[1])">{{show_r[0]}}</a>
                <div class="smargin"></div>
            </div>
        </div>
        <case-data v-for="place in case_list"
            v-bind:dest="col.toLowerCase()"
            v-bind:show_l="show_l[1]"
            v-bind:show_r="show_r[1]"
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
        show_l: ['Confirmed', 'confirmed'],
        show_r: ['Deaths', 'deaths'],
        picked: 'Total',
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
        setType: function(type) {
            if(type == 'new') {
                this.picked = 'New';
                this.show_l = ['New Confirmed', 'new_confirmed'];
                this.show_r = ['New Deaths', 'new_deaths'];
                this.sortToggle = 1;
                this.sort('new_confirmed');
            } else {
                this.picked = 'Total';
                this.show_l = ['Confirmed', 'confirmed'];
                this.show_r = ['Deaths', 'deaths'];
                this.sortToggle = 1;
                this.sort('confirmed');
            }
        },
        sort: function(type) {
            if(!this.sortToggle) z = (a, b) => (a[type] > b[type]) ? 1 : -1;
            else z = (a, b) => (a[type] < b[type]) ? 1 : -1;

            this.sortOption[type] = 'selected';

            ['loc', 'confirmed', 'deaths', 'new_confirmed', 'new_deaths']
            .forEach(function(p) {
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
        show_l: ['Confirmed', 'confirmed'],
        show_r: ['Deaths', 'deaths'],
        picked: 'Total',
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
        setType: function(type) {
            if(type == 'new') {
                this.picked = 'New';
                this.show_l = ['New Confirmed', 'new_confirmed'];
                this.show_r = ['New Deaths', 'new_deaths'];
                this.sortToggle = 1;
                this.sort('new_confirmed');
            } else {
                this.picked = 'Total';
                this.show_l = ['Confirmed', 'confirmed'];
                this.show_r = ['Deaths', 'deaths'];
                this.sortToggle = 1;
                this.sort('confirmed');
            }
        },
        sort: function(type) {
            if(!this.sortToggle) z = (a, b) => (a[type] > b[type]) ? 1 : -1;
            else z = (a, b) => (a[type] < b[type]) ? 1 : -1;

            this.sortOption[type] = 'selected';

            ['loc', 'confirmed', 'deaths', 'new_confirmed', 'new_deaths']
            .forEach(function(p) {
                if(p != type) states.sortOption[p] = 'not_selected';
            });

            this.sortToggle ^= 1;
            this.states.sort(z);
        },
    }
});
