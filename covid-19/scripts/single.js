Vue.component('single-display', {
    props: ['data', 'place', 'icon'],
    template:
    `
    <span>
        <div class="boldtitle">
            <img height="40" width="60" :src="icon"/>
            <div class="smargin"></div>
            {{place}}
            <div class="smargin"></div>
        </div>
        <div class="col-sm-6">
            <div class="box">
            New Confirmed Cases<br>{{commas(data[data.length-1].new_confirmed)}}
            ({{data[data.length-1].new_confirmed_per.toFixed(2)}}%)
            <div class="smargin"></div>
            New Confirmed Deaths<br>{{commas(data[data.length-1].new_deaths)}}
            ({{data[data.length-1].new_deaths_per.toFixed(2)}}%)
            <div class="smargin"></div>
            New Confirmed Recoveries<br>{{commas(data[data.length-1].new_recovered)}}
            ({{data[data.length-1].new_recovered_per.toFixed(2)}}%)
            </div>
        </div>
        <div class="col-sm-6">
            <div class="box">
            Total Confirmed Cases<br>{{commas(data[data.length-1].confirmed)}}
            ({{data[data.length-1].confirmed_per.toFixed(2)}}%)
            <div class="smargin"></div>
            Total Confirmed Deaths<br>{{commas(data[data.length-1].deaths)}}
            ({{data[data.length-1].deaths_per.toFixed(2)}}%)
            <div class="smargin"></div>
            Total Confirmed Recoveries<br>{{commas(data[data.length-1].recovered)}}
            ({{data[data.length-1].recovered_per.toFixed(2)}}%)
            </div>
        </div>
    </span>
    `
});

const single = new Vue({
    el: '#single',
    data: {
        nav: 'single',
        url: 'https://smallfolio.bitnamiapp.com/covid-19/',
        place: '',
        type: '',
        data: [],
        icon: '',
        visible: false
    },
    methods: {
        update: function() {
            $.getJSON(this.url + this.type + '/' + this.place + '/0',
            function (json) {
                if(json.length == 0) {
                    single.place = "Invalid location";
                    return;
                }

                single.data = json;
                single.visible = true;
                single.getIcon();
            });
        },
        getIcon: function() {
            if(single.type == 'country')
                single.icon = 'https://smallfolio.bitnamiapp.com/' +
                    'flags/' + countryCode(single.place) + '.PNG';
            else
                single.icon = 'https://smallfolio.bitnamiapp.com/' +
                    'state-flags/' +
                    replaceAll(single.place.toLowerCase(), " ", "-") + '.png';
        }
    }
});
