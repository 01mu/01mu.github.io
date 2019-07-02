Vue.component('heatmaptable', {
    props: ['dates', 'hmtable', 'averages', 'showave', 'hide'],
    template:
    `
    <table>
        <thead>
            <tr>
                <th></th>
                <template v-for="(date, index) in dates">
                        <th v-if="index < 16" v-bind:class="hide">
                            {{ date.date }}
                        </th>
                        <th v-else>
                            {{ date.date }}
                        </th>
                </template>
            </tr>
        </thead>
        <tbody>
            <template v-for="(hm, index) in hmtable">
                <tr>
                    <td style="text-align:center;">
                        <img height="20" width="20"
                            onerror="this.style.display='none'"
                            v-bind:title="hm[0].symbol"
                            v-on:click="head.showSingle(hm[0].symbol)"
                            style="cursor: pointer;"
                            v-bind:src="hm[0].icon"/>
                    </td>
                    <template v-for="(coin, index) in hm">
                            <td v-if="index < 16" v-bind:class="hide"
                                v-bind:style="coin.color">
                                {{ coin.difference }}
                            </td>
                            <td v-else
                                v-bind:style="coin.color">
                                {{ coin.difference }}
                            </td>
                    </template>
                </tr>
            </template>
            <tr class="ave" v-if="showave">
                <td class="ave"><b>μ</b></td>
                <template v-for="(ave, index) in averages">
                    <td v-if="index < 16"
                        v-bind:class="heatmap.hide"
                        style="background-color: #b3e0ff;">
                            {{ ave }}
                        </td>
                    <td v-else
                        style="background-color: #b3e0ff;">
                            {{ ave }}
                        </td>
                </template
            </tr>
        </tbody>
    </table>
    `
});

Vue.component('heatmaplm', {
    props: ['lastupdated', 'loadingtext'],
    template:
    `
    <span>
        <div class="smalltext">
            {{ lastupdated }}
        </div>
        <div class="loadmore" v-on:click="heatmap.loadMore()">
            {{ loadingtext }}
        </div>
    </span>
    `
});
