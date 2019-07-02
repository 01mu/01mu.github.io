Vue.component('singlechart', {
    template:
    `
    <canvas id="coinChart"></canvas>
    `
});

Vue.component('chartfooter', {
    props: ['chart'],
    template:
    `
    <div class="smalltext">
        <a style="text-decoration: underline;" v-on:click="single.setMinute()">
            Minute</a>&nbsp;
        <a style="text-decoration: underline;" v-on:click="single.setHourly()">
            Hour</a>&nbsp;
        <a style="text-decoration: underline;" v-on:click="single.setDaily()">
            Day</a>&nbsp;
        <a style="text-decoration: underline;" v-on:click="single.setWeekly()">
            Week</a>&nbsp;
        <a style="text-decoration: underline;" v-on:click="single.setMonthly()">
            Month</a>&nbsp; |
        Result limit <input v-on:keyup.enter="single.update()"
            placeholder="Result limit" v-model="chart.limit"></input>
        <span class="smalllink" v-on:click="single.update()">Update</span>
    </div>
    `
});
