# C.L.A.P.S. MD Website

Next.js site for Children's Lung Asthma & Pulmonary Specialists.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Sitemap and robots

Next.js metadata routes generate:

- `https://clapsmd.org/sitemap.xml` from `src/app/sitemap.js`
- `https://clapsmd.org/robots.txt` from `src/app/robots.js`

## Blog posts (dynamic routes)

Blog routes are powered by markdown files in `blog-materials` and generated into
`src/lib/blogPosts.js`.

Add or edit markdown entries like this:

```js
export const blogPosts = [
  {
    slug: "asthma-action-plan",
    title: "Creating an Asthma Action Plan",
    description: "A quick guide to keeping symptoms under control.",
    publishedAt: "2026-01-18",
    updatedAt: "2026-01-18",
    content: "Long-form content goes here.",
  },
];
```

Then regenerate blog data:

```bash
npm run sync-blogs
```

Each post appears at `/blog/[slug]` and is included in `sitemap.xml`. The build
step runs `npm run sync-blogs` automatically via `prebuild`.

## For Collaborators

### Contribution Workflow

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/foladimeji/clapsmd-website-new-2026.git
    cd clapsmd-website-new-2026
    npm install
    ```
2.  **Development**:
    Always run the development server to test your changes locally:
    ```bash
    npm run dev
    ```
3.  **Blog Updates**:
    If you edit anything in `blog-materials/`, you **must** run the sync script before committing:
    ```bash
    npm run sync-blogs
    ```
4.  **Commit & Push**:
    ```bash
    git add .
    git commit -m "Brief description of changes"
    git push origin main
    ```

### Handling Errors

*   **Local Errors**: If `npm run dev` or `npm run build` fails on your machine, please fix those errors before pushing.
*   **Vercel Build Errors**: After pushing to GitHub, watch for a green checkmark or a red "X" next to your commit on the GitHub repository page.
    *   If you see a **Red "X"**, the build has failed.
    *   Since collaborators do not have direct access to the Vercel dashboard, you will not be able to see the full build logs.
    *   **Action**: If a build fails, please contact the repository owner immediately to retrieve the error logs from Vercel.
