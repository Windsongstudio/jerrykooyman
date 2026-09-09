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
                  <li><a href="/index.html">Home</a></li>
                  <li><a href="/portfolio.html">Portfolio</a></li>
                  <li><a href="/digitaliseren-dias-negatieven.html">Digitaliseren</a></li>
                  <li><a href="/contact.html">Contact</a></li>
              </ul>
          </nav>
      </div>
    `;
  }
}

customElements.define('site-header', SiteHeader);
