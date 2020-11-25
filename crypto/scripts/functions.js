function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
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


function numWord(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
    : Math.abs(Number(labelValue));
}


function setLink(link) {
    Object.keys(links).forEach( function(key) {
        if(key != link) {
            links[link] = 'nav-link';
        } else {
            links[link] = 'nav-link active';
        }
    });
}

function getNavbar(dest) {
    var nav = {'portfolio': 'navpad nav-link', 'performers': 'navpad nav-link',
        'coins': 'navpad nav-link', 'heatmap': 'navpad nav-link',
        'mentions': 'navpad nav-link dropdown-toggle'};

    if(dest != 'mentions') {
        nav[dest] = 'navpad nav-link active';
    } else {
        nav[dest] = 'navpad nav-link dropdown-toggle active';
    }

    return nav;
}

function nf(text, val) {
    return text + numWord(parseFloat(val).toFixed(2));
}

var navInfo  = [];

function navbarInfo(nv) {
    if(navInfo.length == 0) {
        var i = {};

        $.getJSON('https://smallfolio.bitnamiapp.com/crypto/info', function (json) {
            json.forEach(function(element) {
                i[element.input_key] = element.input_value;
            });

            //i.total_coins = head.cf('Coins: ', i.total_coins);
            //i.total_markets = head.cf('Markets: ', i.total_markets);
            i.tmc = nf('Market Cap: $', i.total_market_cap);
            i.tv = nf('24 Hour Volume: $', i.total_volume_24h);

            //head.info.push({'value': i.total_coins});
            //head.info.push({'value': i.total_markets});
            //nv.push({'value': i.tmc});
            //nv.push({'value': i.tv});

            nv[0] = i.tmc;
            nv[1] = i.tv;
            navInfo = nv;
        });
    } else {
        nv[0] = navInfo[0];
        nv[1] = navInfo[1];
    }
}
