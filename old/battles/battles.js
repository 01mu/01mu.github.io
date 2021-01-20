var base = 'https://smallfolio.bitnamiapp.com/battles/';

Vue.component('stat-header', {
  props: ['stat'],
  template: '<li class="stat"> \
    <a @click="artists.loadNewChannel(stat.channel)" style="color: black;"> \
    {{ stat.channel }}</a></li>'
})

var title = new Vue({
    el: '#title',
    methods: {
        goHome: function () {
            clearForHome();
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
        }
    },
    created: function () {
        $.getJSON(base + 'stats', function (json) {
            stats.stats = json.stats;
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
        loadNewChannel: function (channel) {
            var end = base + 'artists/' + channel + '/' + artists.counter;

            clearForHome();

            artists.artists = [];
            artists.counter = 0;

            $.getJSON(end, function (json) {
                json.artists.forEach(function(item) {
                    artists.artists.push(item);
                });

                artists.toLoad = channel;
                artists.loadingText = 'Load more';
            });
        },
        loadMore: function (event) {
            var end = base + 'artists/' + artists.toLoad + '/' +
                ++artists.counter;

            artists.loadingText = 'Loading...'

            $.getJSON(end, function (json) {
                json.artists.forEach(function(item) {
                    artists.artists.push(item);
                });

                artists.loadingText = 'Load more'
            });
        }
    },
    created: function () {
        $.getJSON(base + 'artists/total/0', function (json){
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
        info: [],
        visible: false
    },
    methods: {
        loadBattle: function(battleID) {
            battle.getBattle(battleID);
        },
        getBattles: function (artist, channel) {
            var end = base + 'artist/' + channel + '/' + artist;

            artistBattles.artist = artist;
            artistBattles.channel = channel;

            $.getJSON(end, function (json) {
                artistBattles.info = json.artist_info;
                artistBattles.battles = json.artist_battles;

                artists.visible = false;
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
        battle: [],
        visible: false
    },
    methods: {
        getBattle: function (battleID) {
            $.getJSON(base + 'battle/' + battleID, function (json) {
                battle.battle = json.battle[0];

                value = "<div class=\"videoWrapper\"><iframe width='100%' \
                    height='100%' \
                    src='https://www.youtube.com/embed/" + battleID + "' \
                    frameborder='0' allowFullScreen></iframe></div>";

                $("#yt").html(value);

                artists.visible = false;
                artistBattles.visible = false;
                battle.visible = true;
            });
        }
    },
    created: function () {

    }
})

function clearForHome() {
   artists.visible = true;
    artistBattles.visible = false;
    battle.visible = false
    $("#yt").html('');
    artistBattles.battles = [];
}

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
