const single = new Vue({
    el: '#single',
    data: {
        nav: 'single',
        url: 'https://smallfolio.bitnamiapp.com/covid-19/',
        place: '',
        type: '',
        visible: false,
        isInit: false
    },
    methods: {
        update: function() {
            if(this.isInit) {
                this.visible = true;
                return;
            }

            $.getJSON(this.url + this.type + '/' + this.place + '/0',
            function (json) {
                console.log(json)
            });

            this.isInit = true;
        }
    }
});
