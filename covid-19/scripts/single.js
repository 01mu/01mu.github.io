Vue.component('singlechart', {
    props: ['picked', 'single', 'chart_loaded'],
    template:
    `
    <div>
        <canvas id="chart"></canvas>
        <div class="col-sm-12">
            <div class="box" v-if="chart_loaded" v-cloak>
                <form>
                    <label class="radio-inline">
                        <input type="radio" value="TC"
                            v-model="picked"
                            v-on:click="single.generateChart('confirmed')">
                            Total Confirmed
                    </label>
                    <label class="radio-inline">
                        <input type="radio" id="one" value="TD"
                            v-model="picked"
                            v-on:click="single.generateChart('deaths')">
                            Total Deaths
                    </label>
                    <label class="radio-inline">
                        <input type="radio" id="two" value="NC"
                            v-model="picked"
                            v-on:click="single.generateChart('new_confirmed')">
                            New Confirmed
                    </label>
                    <label class="radio-inline">
                        <input type="radio" id="two" value="ND"
                            v-model="picked"
                            v-on:click="single.generateChart('new_deaths')">
                            New Deaths
                    </label>
                </form>
            </div>
        </div>
    </div>
    `
});

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
            <b>New Confirmed Cases</b><br>{{commas(data[data.length-1].new_confirmed)}}
            ({{data[data.length-1].new_confirmed_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>New Confirmed Deaths</b><br>{{commas(data[data.length-1].new_deaths)}}
            ({{data[data.length-1].new_deaths_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>New Confirmed Recoveries</b><br>{{commas(data[data.length-1].new_recovered)}}
            ({{data[data.length-1].new_recovered_per.toFixed(2)}}%)
            </div>
        </div>
        <div class="col-sm-6">
            <div class="box">
            <b>Total Confirmed Cases</b><br>{{commas(data[data.length-1].confirmed)}}
            ({{data[data.length-1].confirmed_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>Total Confirmed Deaths</b><br>{{commas(data[data.length-1].deaths)}}
            ({{data[data.length-1].deaths_per.toFixed(2)}}%)
            <div class="smargin"></div>
            <b>Total Confirmed Recoveries</b><br>{{commas(data[data.length-1].recovered)}}
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
        //url: 'http:/127.0.0.1:8000/',
        url: 'https://smallfolio.bitnamiapp.com/covid-19/',
        place: '',
        type: '',
        data: [{'new_confirmed': 0, 'new_confirmed_per': 0,
            'new_deaths': 0, 'new_deaths_per': 0,
            'new_recovered': 0, 'new_recovered_per': 0,
            'confirmed': 0, 'confirmed_per': 0,
            'deaths': 0, 'deaths_per': 0,
            'recovered': 0, 'recovered_per': 0}],
        icon: '',
        picked: 'TC',
        visible: false,
        chart: null,
        chartLoaded: false
    },
    methods: {
        resetIcon: function() {
            this.icon = 'https://smallfolio.bitnamiapp.com/state-flags/' +
                'grand-princess.png';
        },
        initChart: function() {
            document.getElementById('chart').outerHTML =
                '<canvas id="chart"></canvas>';

            var ctx = document.getElementById('chart');

            var options = {
                elements: {
                    point:{
                        radius: 0
                    }
                },
                maintainAspectRatio: false ,
                tooltips: {
                    mode: 'x-axis'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10
                        },
                        gridLines: {
                            display:false
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display:false
                        }
                    }]
                }
            };

            single.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        backgroundColor: "#d9edff",
                        fill: true,
                        label: 'COVID-19',
                        data: []
                    }]
                },
                options: options
            });

            single.chartLoaded = true;
        },
        generateChart: function(type) {
            var label = '';
            var dataset = [[], []];

            this.data.forEach(function(p) {
                dataset[0].push(getTimeString(p['timestamp']));
                dataset[1].push(p[type]);
            });

            switch(type) {
                case 'confirmed':
                    label = 'Total Confirmed';
                    break;
                case 'deaths':
                    label = 'Total Deaths';
                    break;
                case 'new_confirmed':
                    label = 'New Confirmed';
                    break;
                default:
                    label = 'New Deaths';
            };

            if(screen.width <= 600) {
                this.chart.canvas.parentNode.style.height = '400px';
            } else {
                this.chart.canvas.parentNode.style.height = '500px';
            }

            this.chart.data.labels = dataset[0];
            this.chart.data.datasets[0].label = label;
            this.chart.data.datasets[0].data = dataset[1];
            this.chart.update();
        },
        update: function() {
            var url = this.url + this.type + '/' + this.place + '/0';

            $.getJSON(url, function (json) {
                if(json.length == 0) {
                    single.place = "Invalid location";
                    return;
                }

                single.data = json;
                single.getIcon();

                if(single.place != 'Global') {
                    single.initChart();
                    single.generateChart('confirmed');
                }

                single.data.forEach(function(e) {
                    if(e.new_confirmed < 0) {
                        e.new_confirmed = 0;
                    }

                    if(e.new_deaths < 0) {
                        e.new_deaths = 0;
                    }
                });
            });
        },
        getIcon: function() {
            if(single.type == 'country') {
                single.icon = 'https://smallfolio.bitnamiapp.com/' +
                    'flags/' + countryCode(single.place) + '.PNG';
            } else {
                single.icon = 'https://smallfolio.bitnamiapp.com/' +
                    'state-flags/' +
                    replaceAll(single.place.toLowerCase(), " ", "-") + '.png';
            }
        }
    }
});
