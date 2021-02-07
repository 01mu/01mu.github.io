const About = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div class="body">
    <div class="flex">
      <div class="wrapper50">
        <p class="aboutheader">API Credit</p>
        <hr>
        <p><span class="figure"><a href="https://min-api.cryptocompare.com/">CryptoCompare</a></span></p>
        <p><span class="figure"><a href="https://coinmarketcap.com/api/">CoinMarketCap</a></span></p>
        <p><span class="figure"><a href="https://newsapi.org/">NewsAPI</a></span></p>
        <p><span class="figure"><a href="https://www.reddit.com/dev/api/">reddit</a></span></p>
        <p><span class="figure"><a href="https://github.com/4chan/4chan-API">4chan</a></span></p>
      </div>
      <div class="wrapper50">
        <p class="aboutheader">Resource Credit</p>
        <hr>
        <p><span class="figure"><a href="https://material.io/resources/icons/?style=baseline">Material Design</a></span></p>
        <p><span class="figure"><a href="https://github.com/MitchDorrestijn/coinmarketcap-icons">coinmarketcap-icons</a></span></p>
        <p><span class="figure"><a href="https://github.com/chartjs/chartjs-chart-financial">chartjs-chart-financial</a></span></p>
      </div>
    </div>
    <bottom></bottom>
  </div>
  `,
  data() {
    return {
      navInfo: [],
      showBar: false,
    }
  },
  created() {
    this.navbar = getNavbar('portfolio')
    navbarInfo(this.navInfo)
  },
}
