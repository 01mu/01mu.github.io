Vue.component('country-data', {
   props: ['country'],
   template:
   `
   <div class="flex">
        <div class="wrapper20">
            <img height="20" width="30"
                style="cursor: pointer;"
                v-bind:src="country.url"/>
        {{country.country}}</div>
        <div class="wrapper20">{{country.confirmed}}</div>
        <div class="wrapper20">{{country.deaths}}</div>
        <div class="wrapper20">{{country.new_confirmed}}</div>
        <div class="wrapper20">{{country.new_deaths}}</div>
   </div>
   `
});

Vue.component('country-table', {
    props: ['countries_list'],
    template:
    `
    <span>
        <div class="flex">
            <div class="wrapper20">Country</div>
            <div class="wrapper20"
                v-on:click="countries.sort('confirmed')">Confirmed</div>
            <div class="wrapper20"
                v-on:click="countries.sort('deaths')">Deaths</div>
            <div class="wrapper20"
                v-on:click="countries.sort('new_confirmed')">New Confirmed</div>
            <div class="wrapper20"
                v-on:click="countries.sort('new_deaths')">New Deaths</div>
        </div>
        <country-data v-for="country in countries_list" v-bind:country="country">
            </country-data>
    </span>
    `
});

const countries = new Vue({
    el: '#countries',
    data: {
        nav: 'countries',
        //url: 'https://smallfolio.bitnamiapp.com/covid-19/countries',
        url: 'http://127.0.0.1:8000/countries/',
        visible: false,
        isInit: false,
        countries: [],
        sortToggle: 0
    },
    methods: {
        init: function() {
            if(this.isInit) return;

            $.getJSON(this.url, function (json) {
                countries.countries = json;
                countries.visible = true;

                countries.format();
                console.log(countries.countries);
            });

            this.isInit = true;
        },
        format: function() {
            this.countries.map(function(element) {
                element.url = 'https://smallfolio.bitnamiapp.com/' +
                    'flags/' + countryCode(element.country) + '.PNG';
            });
        },
        sort: function(type) {
            switch(type) {
                case 'confirmed':
                    if(!this.sortToggle)
                        z = (a, b) => (a.confirmed > b.confirmed) ? 1 : -1;
                    else
                        z = (a, b) => (a.confirmed < b.confirmed) ? 1 : -1;
                    break;
                case 'deaths':
                    if(!this.sortToggle)
                        z = (a, b) => (a.deaths > b.deaths) ? 1 : -1;
                    else
                        z = (a, b) => (a.deaths < b.deaths) ? 1 : -1;
                    break;
                case 'new_confirmed':
                    if(!this.sortToggle)
                        z = (a, b) => (a.new_confirmed > b.new_confirmed) ? 1 : -1;
                    else
                        z = (a, b) => (a.new_confirmed < b.new_confirmed) ? 1 : -1;
                    break;
                default:
                    if(!this.sortToggle)
                        z = (a, b) => (a.new_deaths > b.new_deaths) ? 1 : -1;
                    else
                        z = (a, b) => (a.new_deaths < b.new_deaths) ? 1 : -1;
                    break;
                }

            this.sortToggle ^= 1;
            this.countries.sort(z);
        },
    }
});
