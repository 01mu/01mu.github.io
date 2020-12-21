Vue.component('relationbody', {
    props: ['q'],
    template:
    `
    <div class="row">
        <div class="col-sm-4">
            <template v-for="(relation, index) in q.relations[0]">
                <div class="quote"
                    v-on:click="head.showAuthorQuotes(relation.relation)">
                    <center>{{ relation.relation }}</center>
                </div><br>
            </template>
        </div>
        <div class="col-sm-4">
            <template v-for="(relation, index) in q.relations[1]">
                <div class="quote"
                    v-on:click="head.showAuthorQuotes(relation.relation)">
                    <center>{{ relation.relation }}</center>
                </div><br>
            </template>
        </div>
        <div class="col-sm-4">
            <template v-for="(relation, index) in q.relations[2]">
                <div class="quote"
                    v-on:click="head.showAuthorQuotes(relation.relation)">
                    <center>{{ relation.relation }}</center>
                </div><br>
            </template>
        </div>
    </div>
    `
});
