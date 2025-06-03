## Getting Started

First, run the development server (you'll need to have [Node.js](https://nodejs.org/) 18+ installed):

```bash
nvm use 22
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Apollo Client
- GraphQL
- Tailwind CSS
- ESLint
- codegen (GraphQL type generation)
- PostCSS
- Tanstack Query
- Particles canvas background (based on my previous work https://codepen.io/mikhail-nikiforov/pen/qEEPzNd, with some help of Grok AI)

## Testing

I implemented two integration test suites:

Run the tests with:

```bash
npm run test
```

- Vitest
- React Testing Library

## Possible Next Steps

- **Integrate Redis for Caching & Performance**  
    Use Redis to cache GraphQL queries and improve performance by running Redis in a Docker container.

- **Implement Fuzzy Search**

- **Expand Component Architecture**  
  Increase maintainability and reusability by further decomposing UI into smaller, focused React components

- **Add Filters**

- **Improved Pagination**

- **Improved FCP & LCP**
Even though lighthouse scores are good (4 hundreds), I would improve the FCP and LCP for better SEO and user experience. This can be achieved by optimizing images, lazy loading non-critical resources, and using a CDN for static assets.

- **Avoid getWikipediaImage step**
Populating launchesWithImages takes a lot of time. I would consider using CDN for images or a third-party service like Cloudinary to optimize image delivery.

- **View Transition API**  
Use the View Transition API to prevent layout flickers.
