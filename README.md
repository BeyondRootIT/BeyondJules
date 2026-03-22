# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Deployment via GitHub Pages

This project is configured to automatically build and deploy to GitHub Pages using GitHub Actions.

If you encounter an `HttpError: Not Found` or `Failed to create deployment (status: 404)` during the deploy phase of the workflow, it means your repository is not yet configured to allow GitHub Actions to deploy to Pages.

**To fix this, you must change the GitHub Pages build source in your repository settings:**

1. Navigate to your repository on GitHub.
2. Click on the **Settings** tab.
3. In the left sidebar, scroll down and click on **Pages**.
4. Under the "Build and deployment" section, find the **Source** dropdown menu.
5. Change the source from "Deploy from a branch" to **"GitHub Actions"**.
6. Once this is set, re-run your failed workflow or push a new commit, and the deployment will succeed.
