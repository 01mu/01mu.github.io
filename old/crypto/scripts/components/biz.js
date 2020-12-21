Vue.component('bizfooter', {
    props: ['lastupdated', 'rank', 'notice'],
    template:
    `
    <div class="smalltext">
        {{ lastupdated }} <br>
        Rank limit: <input v-on:keyup.enter="biz.updateRank()"
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
                <th class="overflow" v-on:click="biz.sort('change')">
                    <a>24 Hour Change</a></th>
                <th class="overflow" v-on:click="biz.sort('name')">
                    <a>Name Mentions (24 Hours)</a></th>
                <!--<th class="overflow" v-on:click="biz.sort('symbol')">
                    <a>Symbol Mentions (24 Hours)</a></th>
                <th class="overflow" v-on:click="biz.sort('total')">
                    <a>Total Mentions (24 Hours)</a></th>-->
            </tr>
        </thead>
        <tbody>
            <template v-for="(count, index) in bizcounts">
                <tr class="portfoliorow">
                    <td class="overflow">
                        <a :href="'index.html#/single/' + count.symbol">
                            <img height="20" width="20"
                                style="cursor: pointer;"
                                v-on:click="head.showSingle(count.symbol)"
                                :src="count.url"/>
                        </a>
                        <a :href="'index.html#/single/' + count.symbol">
                            {{ count.name }}
                        </a>
                    </td>
                    <td>{{ count.name_diff }}</td>
                    <td>{{ count.name_count }}</td>
                    <!--<td>{{ count.symbol_count }}</td>
                    <td>{{ count.total }}</td>-->
                </tr>
            </template>
        </tbody>
    </table>
    `
});
