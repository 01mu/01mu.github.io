Vue.component('navbar', {
    props: [''],
    template:
    `
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container-fluid">
            <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#app-navbar-collapse">
                        <span class="sr-only">Toggle Navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a  class="navbar-brand titletext" style="color: black;
                        cursor: pointer; font-size: 22px; "
                        v-on:click="head.showQuotesAll()">
                        Quotes
                    </a>
            </div>
            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <ul class="nav navbar-nav" style="color:black;">

                </ul>
                <div class="navbar-form navbar-right">
                    <input class="form-control" type="text"
                        placeholder="Search Quotes"
                        v-on:keyup.enter="head.quotesSearch()"
                        v-model="searchquotes.searchTerm">
                    <button class="btn btn-default"
                        v-on:click="head.quotesSearch()">
                        Search
                    </button>
                </div>
                <div class="navbar-form navbar-right">
                    <input class="form-control" type="text"
                        placeholder="Search Authors"
                        v-on:keyup.enter="head.authorSearch()"
                        v-model="authors.searchedAuthor">
                    <button class="btn btn-default"
                        v-on:click="head.authorSearch()">
                        Search
                    </button>
                </div>
            </div>
        </div>
    </nav>
    `
});

