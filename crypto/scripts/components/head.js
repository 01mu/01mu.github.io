Vue.component('cmcinfo', {
    props: ['info'],
    template:
    `
    <li class="headthing">
        <a style="color:black;">
            <img src="nav/cmc.png" height="16" width="16">
            {{ info.value }}
        </a>
    </li>
    `
});

Vue.component('navbar', {
    props: ['active', 'info'],
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
                    <a  class="navbar-brand titletext" style="color: black;">
                        Crypto
                    </a>
            </div>
            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav" style="color:black;">
                    <li v-bind:class="active['portfolio']">
                        <a  class="linkCol" style="color:black;"
                            href="index.html#/portfolio">
                            <img src="nav/portfolio.png" height="16" width="16">
                            Portfolio
                        </a>
                    </li>
                    <li v-bind:class="active['performers']">
                        <a  class="linkCol" style="color:black;"
                            href="index.html#/performers">
                            <img src="nav/performers.png" height="16" width="16">
                            Performers
                        </a>
                    </li>
                    <li v-bind:class="active['coins']">
                        <a  class="linkCol" style="color:black;"
                            href="index.html#/coins">
                            <img src="nav/coins.png" height="16" width="16">
                            Coins
                        </a>
                    </li>
                    <li v-bind:class="active['heatmap']">
                        <a  class="linkCol" style="color:black;"
                            href="index.html#/heatmap">
                            <img src="nav/hm.png" height="16" width="16">
                            Heat Map
                        </a>
                    </li>
                    <li v-bind:class="active['mentions']">
                        <a  class="dropdown-toggle headthing"
                            style="color:black;"
                            data-toggle="dropdown" href="#">
                            <img src="nav/mentions.png" height="16" width="16">
                            Mentions
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <a  class="linkCol"
                                    href="index.html#/biz">
                                    /biz/
                                </a>
                            </li>
                            <!--<li>
                                <a class="linkCol">/r/CryptoCurrency</a>
                            </li>-->
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <cmcinfo v-for="p in info" :info="p"></cmcinfo>
                </ul>
            </div>
        </div>
    </nav>
    `
});
