import { ActivePage, Product } from '../types/shoe';

export function updatePageSeo(activePage: ActivePage, product?: Product): void {
  if (typeof document === 'undefined') return;

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://altura-footwear.example.com';

  let title = 'ALTURA — Architectural High-Sole & Platform Sneakers';
  let description =
    'Discover luxury high-sole, platform, and chunky sneakers for men and women. Engineered for elevated street presence with sculptural midsoles and bold colorways.';
  let canonicalPath = '/';

  if (activePage.view === 'shop') {
    title = 'Shop All High-Sole & Platform Sneakers | ALTURA Footwear';
    description =
      'Browse the complete ALTURA collection of high-sole shoes, platform sneakers, chunky streetwear footwear, and limited-edition drops for men and women.';
    canonicalPath = '/#shop';
  } else if (activePage.view === 'men') {
    title = "Men's High-Sole & Chunky Platform Sneakers | ALTURA";
    description =
      "Shop ALTURA men's architectural high-sole sneakers, 60mm chunky platforms, running-inspired oversized shoes, and numbered limited editions.";
    canonicalPath = '/#men';
  } else if (activePage.view === 'women') {
    title = "Women's Platform & Sculptural High-Sole Sneakers | ALTURA";
    description =
      "Explore ALTURA women's triple-stacked platform sneakers, vibrant high-sole fashion shoes, and featherlight chunky streetwear silhouettes.";
    canonicalPath = '/#women';
  } else if (activePage.view === 'about') {
    title = 'Sole Engineering & Architectural Craftsmanship | ALTURA';
    description =
      'Learn how ALTURA engineers 50mm to 64mm triple-stacked high-sole sneakers combining Italian calfskin, supercritical foam, and carbon torsion plates.';
    canonicalPath = '/#about';
  } else if (activePage.view === 'product' && product) {
    title = `${product.name} (${product.soleHeightMm}mm ${product.category}) | ALTURA`;
    description = `${product.editorialTagline} Shop the ${product.name} with ${product.soleHeightMm}mm sole elevation and free express shipping at ALTURA.`;
    canonicalPath = `/#product/${product.slug}`;
  }

  document.title = title;

  const setMeta = (selector: string, content: string) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);

  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.setAttribute('href', `${origin}${canonicalPath}`);
  }

  // Update JSON-LD Structured Data (Organization + WebSite + BreadcrumbList + Product when applicable)
  const schemaScript = document.getElementById('schema-org-graph');
  if (schemaScript) {
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        name: 'ALTURA Footwear',
        url: origin,
        description: 'Architectural high-sole, platform, and chunky sneakers for men and women.',
      },
      {
        '@type': 'WebSite',
        name: 'ALTURA Footwear',
        url: origin,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: origin,
          },
          ...(activePage.view !== 'home'
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name:
                    activePage.view === 'product' && product
                      ? product.name
                      : activePage.view.charAt(0).toUpperCase() + activePage.view.slice(1),
                  item: `${origin}${canonicalPath}`,
                },
              ]
            : []),
        ],
      },
    ];

    if (activePage.view === 'product' && product) {
      graph.push({
        '@type': 'Product',
        name: product.name,
        description: product.description,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'ALTURA',
        },
        category: product.category,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: product.discountPrice ?? product.price,
          availability:
            product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `${origin}${canonicalPath}`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewsCount,
        },
      });
    }

    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }
}
