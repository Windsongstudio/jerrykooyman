export async function onRequest(context) {
  const { request, env } = context;
  const response = await env.ASSETS.fetch(request);

  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const headerHTML = await (await env.ASSETS.fetch(new URL("/header.html", request.url))).text();
  const footerHTML = await (await env.ASSETS.fetch(new URL("/footer.html", request.url))).text();

  class Inject {
    constructor(html) { this.html = html; }
    element(el) { el.setInnerContent(this.html, { html: true }); }
  }

  return new HTMLRewriter()
    .on("#site-header", new Inject(headerHTML))
    .on("#site-footer", new Inject(footerHTML))
    .transform(response);
}