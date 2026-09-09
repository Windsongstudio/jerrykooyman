class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header-container">
          <div id="logo">
              <div id="jerrykooyman" class="textshadow"><a href="https://www.jerrykooyman.nl">JERRY KOOYMAN</a></div>
              <div id="photography" class="textshadow">PHOTOGRAPHY</div>
          </div>   
          <nav>
              <ul>
                  <li><a href="index">Home</a></li>
                  <li><a href="portfolio">Portfolio</a></li>
                  <li><a href="digitaliseren-dias-negatieven">Digitaliseren</a></li>
                  <li><a href="contact">Contact</a></li>
              </ul>
          </nav>
      </div>
    `;
  }
}
customElements.define('site-header', SiteHeader);
