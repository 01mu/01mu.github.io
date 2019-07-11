Vue.component('authorsearch', {
    props: ['a'],
    template:
    `
    <span>
        <template v-for="(author, index) in a.searchResults">
            <div class="quote"
                v-on:click="head.showAuthorQuotes(author.author)">
                <center>{{ author.author }}</center>
            </div><br>
        </template>
    </span>
    `
});
