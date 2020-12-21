Vue.component('quotebody', {
    props: ['q'],
    template:
    `
    <div class="row">
        <div class="col-sm-4">
            <template v-for="(quote, index) in q.quotes[0]">
                <div class="quote">
                    <div v-html="quote.quote"
                        v-on:click="head.showAuthorQuotes(quote.author)">
                    </div>
                    <div style="margin-top: 10px; font-size: 18px;">
                        – <a v-bind:href=quote.wikipedia target="_blank">
                            {{ quote.author }}
                        </a><br>
                    </div>
                </div><br>
            </template>
        </div>
        <div class="col-sm-4">
            <template v-for="(quote, index) in q.quotes[1]">
                <div class="quote">
                    <div v-html="quote.quote"
                        v-on:click="head.showAuthorQuotes(quote.author)">
                    </div>
                    <div style="margin-top: 10px; font-size: 18px;">
                        – <a v-bind:href=quote.wikipedia target="_blank">
                            {{ quote.author }}
                        </a><br>
                    </div>
                </div><br>
            </template>
        </div>
        <div class="col-sm-4">
            <template v-for="(quote, index) in q.quotes[2]">
                <div class="quote">
                    <div v-html="quote.quote"
                        v-on:click="head.showAuthorQuotes(quote.author)">
                    </div>
                    <div style="margin-top: 10px; font-size: 18px;">
                        – <a v-bind:href=quote.wikipedia target="_blank">
                            {{ quote.author }}
                        </a><br>
                    </div>
                </div><br>
            </template>
        </div>
    </div>
    `
});

Vue.component('loadmore', {
    props: ['q'],
    template:
    `
        <div class="loadmore" v-on:click="q.loadMore()">
            {{ q.loadingText }}
        </div>
    `
});
