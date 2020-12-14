const nav_template = `
<nav class="navbar navbar-expand-lg navbar-light navborder"
    style="padding-bottom: 6px; padding-top: 6px; background-color: #ddded1;">

    <a class="navpad navbar-brand" href="#"><b>Quotes</b></a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <div  v-if="h.viewingAuthor" class="sborder"></div>
        <ul class="navbar-nav mr-auto">
            <li v-if="h.viewingAuthor" :class="h.nav['quotes']">
                <a style="display:block;"
                    :href="'index.html#/author/quotes/' + h.currentAuthor">
                    {{ h.currentAuthor }}'s Quotes
                </a>
            </li>
            <div class="sborder"></div>
            <li v-if="h.viewingAuthor" :class="h.nav['relations']">
                <a style="display:block;"
                    :href="'index.html#/author/relations/' + h.currentAuthor">
                    {{ h.currentAuthor }}'s Relations
                </a>
            </li>
            <div class="d-none d-sm-block">
                <li class="navpad nav-link"><a>&nbsp;</a></li>
            </div>
        </ul>
        <div  v-if="h.viewingAuthor" class="sborder"></div>
        <ul class="navbar-nav navbar-right">
            <li class="nav-item">
                <span class="form-inline">
                    <input class="form-control mr-sm-2"
                        v-model="h.authorQuery"
                        type="search"
                        v-on:keyup.enter="h.authorSearch()"
                        placeholder="Search for an author" aria-label="Search">
                    <div class="btn btn-outline-secondary my-2 my-sm-0 mbutton"
                        type="submit"
                        v-on:click="h.authorSearch()">
                        Search
                    </div>
                </span>
            </li>
            <div class="d-none d-sm-block">&nbsp;&nbsp;&nbsp;</div>
            <div class="sborder"></div>
            <li class="nav-item">
                <span class="form-inline">
                    <input class="form-control mr-sm-2"
                        v-model="h.quoteQuery"
                        type="search"
                        v-on:keyup.enter="h.quoteSearch()"
                        placeholder="Search for a quote" aria-label="Search">
                    <div class="btn btn-outline-secondary my-2 my-sm-0 mbutton"
                        type="submit"
                        v-on:click="h.quoteSearch()">
                        Search
                    </div>
                </span>
            </li>
        </ul>

    </div>
</nav>
`;

const bottom =
`
<div class="cent">
    <p>Quotes are from <a href="https://en.wikiquote.org"><b>Wikiquote</b></a>
    and author relations are from <a href="https://en.wikipedia.org">
    <b>Wikipedia</b></a></p>
</div>
`;

const loading_template =
`
<div v-if="h.showLoading" class="progress">
    <div style="background-color:#ddded1 !important; width: 100%;
    border-bottom: 1px solid #000000;"
    class="progress-bar progress-bar-striped progress-bar-animated"
    role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
    </div>
</div>
<div style="margin-bottom: 16px;"></div>
`;
