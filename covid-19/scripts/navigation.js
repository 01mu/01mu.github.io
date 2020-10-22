Vue.component('navbar', {
    props: ['active'],
    template:
    `
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container-fluid">
             <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#app-navbar-collapse">
                        <span class="sr-only">Toggle Navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand titletext" style="color: black;">
                        <a style="color:black; text-decoration: none;"
                            href="index.html#/today">
                            <b>COVID-19</b>
                        </a>
                    </a>
            </div>
            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav" style="color:black;">
                    <li v-bind:class="active['today']">
                        <a class="linkCol" style="color:black;"
                            href="index.html#/today">
                        Today
                        </a>
                    </li>
                    <li v-bind:class="active['countries']">
                        <a class="linkCol" style="color:black;"
                            href="index.html#/countries">
                        World
                        </a>
                    </li>
                    <li v-bind:class="active['states']">
                        <a class="linkCol" style="color:black;"
                            href="index.html#/states">
                        United States
                        </a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">

                </ul>
            </div>
        </div>
    </nav>
    `
});

const router = new VueRouter({
    routes: [],
});

const head = new Vue({router,
    el: '#head',
    data: {
        vues: [today, countries, states, single],
        info: [],
        active: {}
    },
    methods: {
        toggle: function(show) {
            var head = this;

            this.vues.forEach(function(e) {
                if(e != show) {
                    e.visible = false;
                }


                if(show != single) {
                    if(e == show) {
                        head.active[e.nav] = 'nav_selection active';
                    } else {
                        head.active[e.nav] = 'nav_selection';
                    }
                } else {
                    if(head.active[e.nav] == 'nav_selection active') {
                       head.active[e.nav] = 'nav_selection active';
                    }

                    single.visible = true;
                }
            });
        },
        setSingle: function(split, type) {
            single.resetIcon();
            single.place = split[2].replaceAll("%20", " ");
            single.type = type;
            this.toggle(single);
            single.update();
        },
        setRoute: function() {
            var split = this.$router.history.current.path.split('/');

            switch(split[1]) {
                case 'today':
                    this.toggle(today);
                    today.init();
                    break;
                case 'countries':
                    this.toggle(countries);
                    countries.init();
                    break;
                case 'states':
                    this.toggle(states);
                    states.init();
                    break;
                case 'country':
                    this.setSingle(split, 'country');
                    break;
                case 'state':
                    this.setSingle(split, 'us');
                    break;
                default:
                    this.toggle(today);
                    today.init();
                    break;
            };

            countries.countries = [...countries.hold];
            states.states = [...states.hold];
        }
    },
    watch: {
        '$route' (to, from) {
            this.setRoute();
        }
    },
    created: function() {
        var active = {};

        this.vues.forEach(function(element) {
            active[element.nav] = 'nav_selection';
        });

        this.active = active;
        this.setRoute();
    }
});
