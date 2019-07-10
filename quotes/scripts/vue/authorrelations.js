var authorrelations = new Vue({
    el: '#authorrelations',
    data: {
        chosenAuthor: '',
        visible: true,
        relations: [],
        loadingText: 'Load more',
        counter: 0
    },
    methods: {
        initQuotesArr: function() {
            var a = [];

            for(var i = 0; i < 3; i++) {
                a[i] = [];
            }

            this.relations = a;
        },
        setRelationsArr: function(url) {
            $.getJSON(url, function(json) {
                var flag = 0;

                for(var i = 0; i < json.length; i++) {
                    authorrelations.relations[flag++].push(json[i]);

                    if(flag == 3) {
                        flag = 0;
                    }
                }

                if(json.length < 50) {
                    authorrelations.loadingText = 'Load more';
                }
            });
        },
        loadMore: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/' +
                'relations/' + this.chosenAuthor + '/' + ++this.counter;

            this.loadingText = 'Loading...';
            this.setRelationsArr(url);
        },
        showAuthorRelations: function() {
            var url = 'https://smallfolio.bitnamiapp.com/quotes/' +
                'relations/' + this.chosenAuthor + '/0';

            this.initQuotesArr();
            this.setRelationsArr(url);
        }
    }
});
