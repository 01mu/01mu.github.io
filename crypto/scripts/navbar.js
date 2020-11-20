const topbar = {
    template:
    `
    <nav class="navbar navbar-expand-lg navbar-light bg-light navborder">
    <a class="navbar-brand" href="#"><b>Crypto</b></a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link active"
                href="index.html#/portfolio">
                <img src="nav/portfolio.png" height="16" width="16">
                Portfolio <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active"
            href="index.html#/performers">
            <img src="nav/performers.png" height="16" width="16">
            Performers <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active"
            href="index.html#/coins">
            <img src="nav/coins.png" height="16" width="16">
            Coins <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active"
            href="index.html#/heatmap">
            <img src="nav/hm.png" height="16" width="16">
            Heat Map <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item dropdown">

        <a class="nav-link dropdown-toggle active"
        href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img src="nav/mentions.png" height="16" width="16">
            Mentions
        </a>

            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="index.html#/biz">/biz/</a>
            </div>
          </li>
        </ul>
        <ul class="navbar-nav navbar-right">
            <cmcinfo v-for="p in info" :info="p"></cmcinfo>
        </ul>
      </div>
    </nav>
    <div style="margin-bottom: 16px"></div>
    `,
    data() {
        return {
            links: {},
            url: 'https://smallfolio.bitnamiapp.com/crypto/info',
            info: [],
            active: {}
        }
    },
    components: {
        cmcinfo: {
            props: ['info'],
            template:
            `
            <li class="nav-item">
                <a style="color:black;">
                    <img src="nav/cmc.png" height="16" width="16">
                    {{ info.value }}&nbsp;&nbsp;
                </a>
            </li>
            `
        }
    },
    methods: {
        cf: function(text, val) {
            return text + commas(parseFloat(val));
        },
        nf(text, val) {
            return text + numWord(parseFloat(val).toFixed(2));
        }
    },
    updated() {
        //console.log(1)
    },
    created() {
        const top = this;
        var i = {};

        $.getJSON(this.url, function (json) {
            json.forEach(function(element) {
                i[element.input_key] = element.input_value;
            });

            //i.total_coins = head.cf('Coins: ', i.total_coins);
            //i.total_markets = head.cf('Markets: ', i.total_markets);
            i.tmc = top.nf('Market Cap: $', i.total_market_cap);
            i.tv = top.nf('24 Hour Volume: $', i.total_volume_24h);

            //head.info.push({'value': i.total_coins});
            //head.info.push({'value': i.total_markets});
            top.info.push({'value': i.tmc});
            top.info.push({'value': i.tv});
        });
    }
}

Vue.createApp(topbar).mount('#topbar')
