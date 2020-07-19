Vue.component('navbar', {
    props: ['active'],
    template:
    `
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand titletext" style="color: black;">
                    COVID-19
                </a>
            </div>
            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav" style="color:black;">
                    <li v-bind:class="active['countries']">
                        <a class="linkCol" style="color:black;"
                            href="index.html#/countries">
                        Countries
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
        vues: [countries],
        info: [],
        active: {}
    },
    methods: {
        toggle: function(show) {
            var head = this;

            this.vues.forEach(function(e) {
                if(e != show) e.visible = false;

                if(e == show) head.active[e.nav] = 'nav_selection active';
                else head.active[e.nav] = 'nav_selection';
            });

            //show.visible = true;
        },
        setRoute: function() {
            var split = this.$router.history.current.path.split('/');

            switch(split[1]) {
                case 'countries':
                    this.toggle(countries);
                    countries.init();
                    break;
                default:
                    this.toggle(countries);
                    countries.init();
                    break;
            };
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
