var base = 'https://smallfolio.bitnamiapp.com/battles/';

Vue.component('stat-header', {
  props: ['stat'],
  template: '<li class="stat"><a @click="stats.changeChannel(stat.channel)"> \
    {{ stat.channel }}</a></li>'
})

var title = new Vue({
    el: '#title',
    methods: {
        goHome: function () {
            artists.visible = true;
            artistBattles.visible = false;
            battle.visible = false
            $("#yt").html('');
            artistBattles.battles = [];
        }
    }
})

var stats = new Vue({
    el: '#stats',
    data: {
        stats: [],
        visible: false
    },
    methods: {
        random: function() {
            $.getJSON(base + 'random', function (json) {
                battle.getBattle(json.battle[0].battle_id);
            });
        },
        changeChannel: function (channel) {
            artists.visible = true;
            artistBattles.visible = false;
            artistBattles.battles = [];
            battle.visible = false
            $("#yt").html('');

            artists.loadNewChannel(channel);
        }
    },
    created: function () {
        $.getJSON(base + 'stats', function (json) {
            json.stats.forEach(function(item) {
                stats.stats.push(item);

            });

            stats.visible = true;
        });
    }
})

var artists = new Vue({
    el: '#artists',
    data: {
        artists: [],
        counter: 0,
        loadingText: 'Load more',
        toLoad: 'total',
        visible: true
    },
    methods: {
        loadArtist: function (artist, channel) {
            artists.visible = false;
            artistBattles.getBattles(artist, channel);
        },
        loadNewChannel: function (channel) {
            artists.artists = [];
            artists.counter = 0;

            $.getJSON(base + 'artists/' + channel + '/' + artists.counter,
                function (json){

                json.artists.forEach(function(item) {
                    artists.artists.push(item);
                });

                artists.toLoad = channel;
                artists.loadingText = 'Load more';
            });
        },
        loadMore: function (event) {
            artists.counter++;
            artists.loadingText = 'Loading...'

            var end = 'artists/' + artists.toLoad + '/' + artists.counter;

            $.getJSON(base + end,
                function (json){

                json.artists.forEach(function(item) {
                    artists.artists.push(item);
                });

                artists.loadingText = 'load more'
            });
        }
    },
    created: function () {
        $.getJSON(base + 'artists/theurltv/0', function (json){
            json.artists.forEach(function(item) {
              artists.artists.push(item);
            });
        });
    }
})

var artistBattles = new Vue({
    el: '#artistBattles',
    data: {
        artist: '',
        channel: '',
        battles: [],
        visible: false,
        battle_count: '',
        views: '',
        average: '',
        percentage: ''
    },
    methods: {
        loadBattle: function(battleID) {
            battle.getBattle(battleID);
        },
        getBattles: function (artist, channel) {
            artistBattles.artist = artist;
            artistBattles.channel = channel;

            $.getJSON(base + 'artist/' + channel + '/' + artist,
                function (json) {

                var info = json.artist_info;

                artistBattles.battle_count = info.battle_count;
                artistBattles.views = info.battle_views;
                artistBattles.average = info.views_average;
                artistBattles.percentage = info.views_percentage;

                artistBattles.battles = json.artist_battles;
                artistBattles.visible = true;
            });
        }
    },
    created: function () {

    }
})

var battle = new Vue({
    el: '#battle',
    data: {
        battleID: 0,
        battle: [],
        visible: false
    },
    methods: {
        getBattle: function (battleID) {
            battle.visible = true;
            artists.visible = false;
            artistBattles.visible = false;

            value = "<div class=\"videoWrapper\"><iframe width='100%' \
                height='100%' \
                src='http://www.youtube.com/embed/" + battleID + "' \
                frameborder='0' allowFullScreen></iframe></div>";

            $("#yt").html(value);
        }
    },
    created: function () {

    }
})

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function since(date) {
    var seconds = Math.floor((new Date() /1000  - date));
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);

    if (interval > 1) {
        return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
        return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);

    if (interval > 1) {
        return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);

    if (interval > 1) {
        return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
}
