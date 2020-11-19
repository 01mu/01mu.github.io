Vue.component('singlechart', {
    template:
    `
    <div>
        <canvas id="coinChart"></canvas>
    </div>
    `
});

Vue.component('chartfooter', {
    props: ['chart'],
    template:
    `
    <div class="smalltext">
        <a style="text-decoration: underline" v-on:click="single.setMinute()">
            Minutes</a>&nbsp;
        <a style="text-decoration: underline" v-on:click="single.setHourly()">
            Hours</a>&nbsp;
        <a style="text-decoration: underline" v-on:click="single.setDaily()">
            Days</a>&nbsp;
        <a style="text-decoration: underline" v-on:click="single.setWeekly()">
            Weeks</a>&nbsp;
        <a style="text-decoration: underline" v-on:click="single.setMonthly()">
            Months</a><br>
        Result limit: <input v-on:keyup.enter="single.update()"
            placeholder="Result limit" v-model="chart.limit"></input>
        <span class="smalllink" v-on:click="single.update()">Update</span>
    </div>
    `
});

Vue.component('recentcoins', {
    props: ['urls', 'coins'],
    template:
    `
    <table>
        <tbody>
            <template v-for="(coin, index) in coins">
                <tr class="portfoliorow">
                    <td>
                        <a :href="'index.html#/single/' + coins[index]">
                            <img height="20" width="20"
                                style="cursor: pointer;"
                                v-bind:src="urls[index]"/>
                        </a>
                        <a :href="'index.html#/single/' + coins[index]">
                            {{ coins[index] }}
                        </a>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    `
});

Vue.component('chartcoininfo', {
   props: ['info'],
   template:
   `
    <table>
        <tbody>
            <tr class="portfoliorow">
                <td>
                    <img src="nav/cmc.png" height="16" width="16">
                    Open: {{ info.coinInfo.open }}
                </td>
            <tr>
            <tr class="portfoliorow">
                <td>
                    <img src="nav/cmc.png" height="16" width="16">
                    Close: {{ info.coinInfo.close }}
                </td>
            <tr>
            <tr class="portfoliorow">
                <td>
                    <img src="nav/cmc.png" height="16" width="16">
                    Change: {{ info.coinInfo.change }}
                </td>
            <tr>
            <tr class="portfoliorow">
                <td>
                    <img src="nav/cmc.png" height="16" width="16">
                    High: {{ info.coinInfo.high }}
                </td>
            <tr>
            <tr class="portfoliorow">
                <td>
                    <img src="nav/cmc.png" height="16" width="16">
                    Low: {{ info.coinInfo.low }}
                </td>
            <tr>
        </tbody>
   </table>
   `
});
