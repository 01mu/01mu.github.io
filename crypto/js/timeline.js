const Timeline = {
  template:
  `
  <comp :destination="navbar" :info="navInfo"></comp>
  <loadingbar :showbar="showBar"></loadingbar>
  <div class="body">
    <p>API credit:</p>
    <p>CryptoCompare</p>
    <p>CoinMarketCap</p>
    <p>NewsAPI</p>
    <p>4chan</p>
    <p>reddit</p>
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
