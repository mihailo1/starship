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

## Questions

- **How would you design and implement authentication? Consider security, scalability and user experience.**

I would use JWT for stateless authentication. To manage user sessions, I would use two tokens: Access Token, which is short-lived and used to check requests, and Refresh Token, which lasts longer and is used to get new access tokens when the old one expires. User credentials would be stored in a safe, managed database like PostgreSQL or MongoDB. Each user would have a unique email or username, and passwords would be hashed using bcrypt. For security, I would enable HTTPS, set up CORS to control cross-origin access, and add CSRF protection. I would also support third-party login providers like Google or Apple, using tools like next-auth or a custom OAuth flow in GraphQL resolvers. To handle high traffic, I would deploy the GraphQL API behind a load balancer to spread requests across multiple servers.

- **How would you design a scalable and efficient search functionality? Consider both frontend and backend aspects, including indexing, performance optimization and potential third party services.**

I would use Elasticsearch for indexing and full-text search, as it offers better performance than raw database queries for large-scale search. Index relevant data (e.g., user profiles, content) with fields optimized for search (e.g., tokenized text, weights for relevance). Implement pagination in GraphQL (e.g., using offset or cursor based pagination) to limit result sets. Cache frequent search queries in Redis to reduce load on the search engine. Use query debouncing in resolvers to handle rapid user inputs (Frontend).

- **How would you monitor health and performance of the application/infrastructure, and what strategies would you implement for ongoing maintenance and updates?**

I would use monitoring tools like New Relic or Datadog to track application performance, error rates, and user interactions. Set up alerts for anomalies (e.g., >500ms API response time). Log GraphQL queries, errors, and authentication events for debugging. Monitor server health using Prometheus + Grafana. Track database performance for PostgreSQL/Redis. Use tools like Sentry for real-time error tracking in both frontend and backend and Real User Monitoring (RUM). Do load balancer health checks and uptime monitoring. Provide extensive testing coverage (unit, integration, E2E) to catch issues early. Deploy to services with zero-downtime deployments using blue-green or rolling updates. Use a feature flag system to roll out new features gradually and minimize risk. Conduct security audits (e.g., penetration testing) and performance reviews quarterly.
