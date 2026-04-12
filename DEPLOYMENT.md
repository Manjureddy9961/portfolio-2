# Deployment Instructions

This portfolio is built with vanilla HTML, CSS, and JS. It is entirely static, meaning it is incredibly fast and can be deployed for free on platforms like **Netlify**, **Vercel**, or **GitHub Pages**.

## Pre-deployment Checklist

1. **Update `scripts/config.js`**: 
   Ensure all your contact information, social URLs, and descriptions are correct.
   
2. **Add Assets**:
   Create an `assets/` folder in the root directory (if not already present).
   Add your profile image here and name it `profile.jpg`.
   Add your resume PDF and name it `resume.pdf`.
   Add any project images (e.g., `project1.jpg`, `project2.jpg`, `project3.jpg`).

3. **Configure Contact Form (Formspree)**:
   This site uses Formspree for the backend contact form logic since it's a static site.
   - Go to [Formspree.io](https://formspree.io/) and create an account.
   - Create a new form.
   - Formspree will give you an endpoint URL like `https://formspree.io/f/XXXXXX`.
   - Open `index.html` and replace `YOUR_FORMSPREE_ID` in the `<form action="...">` tag with your Formspree ID.

## Option 1: Deploying on Netlify (Recommended)

Netlify is the easiest platform for HTML/CSS/JS applications.

1. **Create an account** on [Netlify](https://www.netlify.com/).
2. You can deploy it in two ways:
   - **Drag and Drop**: 
     - Go to your Netlify dashboard (Sites page).
     - Drag the entire folder containing your `index.html` and drop it to the dashboard where it says "Drag and drop your site output folder here".
   - **Using Git/GitHub** (Better for future updates):
     - Initialize a git repository in your project folder, commit all files, and push to GitHub.
     - In Netlify, click **"Add new site" > "Import an existing project"**.
     - Connect to GitHub, select your repository, and click **Deploy Site**.

## Option 2: Deploying on Vercel

Vercel is another excellent hosting solution.

1. **Create an account** on [Vercel](https://vercel.com/).
2. You can deploy via GitHub integration:
   - Push your portfolio code to a GitHub repository.
   - In Vercel, click **Add New Project**.
   - Import your GitHub repository.
   - The Framework Preset should correctly auto-detect this as a static site.
   - Click **Deploy**.

## Post-Deployment
- Go to your hosting platform's domain settings to attach a custom domain if you have one.
- Share your new portfolio with the world!
