Vue.component('bizfooter', {
    props: ['lastupdated', 'rank', 'notice'],
    template:
    `
    <div class="smalltext">
        - {{ lastupdated }} <br>
        - Rank limit: <input v-on:keyup.enter="biz.updateRank()"
            placeholder="Rank limit" v-model="biz.rank"></input>
        <span class="smalllink" v-on:click="biz.updateRank()">Update</span>
        <b>{{ notice }}</b>
    </div>
    `
});

Vue.component('biztable', {
    props: ['bizcounts'],
    template:
    `
    <table>
        <thead>
            <tr>
                <th>Coin</th>
                <th>Symbol</th>
                <th class="overflow">24 Hour Mentions</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(count, index) in bizcounts">
                <tr class="portfoliorow">
                    <td class="overflow">
                        <img height="20" width="20"
                            onerror="this.style.display='none'"
                            style="cursor: pointer;"
                            v-on:click="head.showSingle(count.symbol)"
                            v-bind:src="count.url"/>
                        <a <a v-on:click="head.showSingle(count.symbol)">
                            {{ count.name }}
                        </a>
                    </td>
                    <td>
                        <a v-on:click="head.showSingle(count.symbol)">
                            {{ count.symbol }}
                        </a>
                    </td>
                    <td>{{ count.mention_count }}</td>
                </tr>
            </template>
        </tbody>
    </table>
    `
});
