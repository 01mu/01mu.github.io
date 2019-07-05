Vue.component('portfolioheader', {
   props: ['usdvalue', 'btcvalue'],
   template:
    `
    <span>
        <h1>{{ usdvalue }}</h1>
        <h5>{{ btcvalue }}</h5>
    </span
    `
});

Vue.component('portfoliotable', {
    props: ['coins'],
    template:
    `
    <table>
        <thead>
            <tr>
                <th scope="col">Symbol</th>
                <th scope="col">Amount</th>
                <th class="hidden-xs" scope="col">Percentage</th>
                <th class="hidden-xs" scope="col">Value</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(coin, index) in coins">
                <tr class="portfoliorow">
                    <td>
                        <img height="20" width="20"
                            onerror="this.style.display='none'"
                            v-bind:src="coin.icon"
                            style="cursor: pointer;"
                            v-on:click="head.showSingle(coin.symbol)"/>
                        &nbsp;
                        <a v-on:click="head.showSingle(coin.symbol)">
                            {{ coin.symbol }}
                        </a>
                    </td>
                    <td>{{ coin.amount }}</td>
                    <td class="hidden-xs">{{ coin.percentage }}</td>
                    <td class="hidden-xs">{{ coin.value }}</td>
                    <td>{{ coin.price }}</td>
                    <td>
                        <button class="button-green"
                            v-on:click="portfolio.setEdit(coin.symbol)">
                            Edit
                        </button>
                        <button class="button-red"
                            v-on:click="portfolio.removeCoin(coin.symbol)">
                            X
                        </button>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    `
});

Vue.component('portfoliofooter', {
    props: ['showedit', 'notice', 'portfolio'],
    template:
    `
    <span>
        <br>
        <input v-on:keyup.enter="portfolio.confirmCoin()"
            placeholder="Symbol" v-model="portfolio.coinSymbol"></input>
        <input v-on:keyup.enter="portfolio.confirmCoin()"
            placeholder="Amount" v-model="portfolio.coinAmount"></input>
        <button class="button-blue" v-on:click="portfolio.confirmCoin()">
            Add coin
        </button>
        <span v-if="showedit">
            <input v-on:keyup.enter="portfolio.makeEdit()"
                placeholder="New amount" v-model="portfolio.newAmount">
            <button class="button-blue" v-on:click="makeEdit()">
                Edit {{ portfolio.toEdit }}
            </button>
        </span>
        <b>{{ notice }}</b>
    </span>
    `
});
