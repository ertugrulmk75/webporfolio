// GROQ queries used by the Next.js frontend.

export const siteSettingsQuery = `*[_type=="siteSettings"][0]`;

export const homePageQuery = `{
  "settings": *[_type=="siteSettings"][0],
  "ticker": *[_type=="tickerItem"]|order(order asc),
  "services": *[_type=="service"]|order(order asc),
  "processSteps": *[_type=="processStep"]|order(order asc),
  "pricingTiers": *[_type=="pricingTier"]|order(order asc),
  "testimonials": *[_type=="testimonial"]|order(order asc),
  "beforeAfter": *[_type=="beforeAfterPair"]|order(order asc),
  "homeProjects": *[_type=="portfolioProject" && featuredOnHome==true]|order(homeOrder asc){
    ..., "category": category->{name, slug}
  }
}`;

export const portfolioPageQuery = `{
  "projects": *[_type=="portfolioProject"]|order(year desc, name asc){
    ..., "category": category->{name, slug}
  },
  "categories": *[_type=="portfolioCategory"]|order(name asc),
  "settings": *[_type=="siteSettings"][0]
}`;

export const blogListQuery = `{
  "posts": *[_type=="blogPost"]|order(publishedAt desc){
    _id, title, slug, excerpt, publishedAt, readTime, cover,
    "category": category->{name, slug},
    "author": author->{name, role, initial, avatar}
  },
  "categories": *[_type=="blogCategory"]|order(name asc),
  "settings": *[_type=="siteSettings"][0]
}`;

export const blogPostQuery = `*[_type=="blogPost" && slug.current==$slug][0]{
  ..., "category": category->{name, slug},
  "author": author->{name, role, initial, avatar}
}`;

export const blogPostSlugsQuery = `*[_type=="blogPost" && defined(slug.current)][].slug.current`;
