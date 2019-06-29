Vue.component('performers', {
    props: ['performer'],
    template: '<div class="flex perfthing"> \
    <div class="wrapper50"> \
    <img height="20" width="20" \
    onerror="this.style.display=\'none\'" \
    v-bind:src="performer.url"/> \
    {{ performer.symbol }} \
    </div>\
    <div class="wrapper50"> \
    {{ performer.change.toFixed(2) }}% \
    </div> \
    </div>'
})

Vue.component('coins', {
    props: ['coin'],
    template: '<div class="flex coinpad"> \
        <div class="wrapper5">{{ coin.rank }}</div> \
        <div class="wrapper15 overflow">\
        <img height="20" width="20" \
        onerror="this.style.display=\'none\'" \
        v-bind:src="coin.url" \
        /> {{ coin.name }} \
        </div> \
        <div class="wrapper10">{{ coin.price_usd }}</div> \
        <div class="wrapper10">{{ coin.price_btc }}</div> \
        <div class="wrapper9">{{ coin.change_1h }}</div> \
        <div class="wrapper9">{{ coin.change_24h }}</div> \
        <div class="wrapper9">{{ coin.change_7d }}</div> \
        <div class="wrapper10">{{ coin.market_cap }}</div> \
        <div class="wrapper6p5">{{ coin.market_cap_percent }}</div> \
        <div class="wrapper10">{{ coin.volume_24h }}</div> \
        <div class="wrapper6p5">{{ coin.volume_24h_percent }}</div> \
        </div>'
})

Vue.component('headthing', {
  props: ['head'],
  template: '<li class="headthing"> \
        <a style="color:black;">{{ head.value }}</a></li>'
})
