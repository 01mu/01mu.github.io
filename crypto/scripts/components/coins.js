Vue.component('coins', {
    props: ['coin'],
    template:
    `
    <div class="flex coinpad">
        <div class="wrapper5s">{{ coin.rank }}</div>
        <div class="wrapper15s overflow">
            <img height="20" width="20"
            onerror="this.style.display='none'"
            style="cursor: pointer;"
            v-on:click="head.showSingle(coin.symbol)"
            v-bind:src="coin.url"/>
            <a v-on:click="head.showSingle(coin.symbol)">
                {{ coin.name }} ({{ coin.symbol }})
            </a>
        </div>
        <div class="wrapper10s">{{ coin.price_usd }}</div>
        <div class="wrapper10 hidden-xs">{{ coin.price_btc }}</div>
        <div class="wrapper9 hidden-xs">{{ coin.change_1h }}</div>
        <div class="wrapper9 hidden-xs">{{ coin.change_24h }}</div>
        <div class="wrapper9 hidden-xs">{{ coin.change_7d }}</div>
        <div class="wrapper10 hidden-xs">{{ coin.market_cap }}</div>
        <div class="wrapper6p5 hidden-xs">{{ coin.market_cap_percent }}</div>
        <div class="wrapper10 hidden-xs">{{ coin.volume_24h }}</div>
        <div class="wrapper6p5 hidden-xs">{{ coin.volume_24h_percent }}</div>
    </div>
    `
});

Vue.component('cointable', {
    props: ['coins'],
    template:
    `
    <span>
        <div class="flex coinheader">
            <div class="wrapper5s">#</div>
            <div class="wrapper15s">Coin</div>
            <div class="wrapper10s">USD Price</div>
            <div class="wrapper10 hidden-xs">BTC Price</div>
            <div class="wrapper9 hidden-xs">1 Hour Δ</div>
            <div class="wrapper9 hidden-xs">24 Hour Δ</div>
            <div class="wrapper9 hidden-xs">7 Day Δ</div>
            <div class="wrapper10 hidden-xs">Market Cap</div>
            <div class="wrapper6p5 hidden-xs">%</div>
            <div class="wrapper10 hidden-xs">24 Hour Volume</div>
            <div class="wrapper6p5 hidden-xs">%</div>
        </div>
        <coins v-for="coin in coins" v-bind:coin="coin"></coins>
    </span>
    `
});

Vue.component('coinlm', {
    props: ['lastupdated', 'loadingtext'],
    template:
    `
    <span>
        <div class="smalltext">
            - {{ lastupdated }}
        </div>
        <div class="loadmore" v-on:click="coins.loadMore()">
            {{ loadingtext }}
        </div>
    </span>
    `
});