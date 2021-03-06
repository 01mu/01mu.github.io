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
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " billion"
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " million"
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + " thousand"
    : Math.abs(Number(labelValue));
}

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
