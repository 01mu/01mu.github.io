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
                    </label><br>
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
        picked: 'TC',
        visible: false,
        chart: null,
        chartLoaded: false
    },
    methods: {
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
            dataset = [[], []];

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
            $.getJSON(this.url + this.type + '/' + this.place + '/0',
                function (json) {

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
