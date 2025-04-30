/**
 * Sample templates for different site types that can be deployed to Netlify
 */

// Blog template
export const blogTemplate = (siteName: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} - Blog</title>
    <meta name="description" content="A modern blog template deployed with Netlify Deployer">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header class="blog-header text-center">
      <div class="container">
        <h1 class="display-4">${siteName}</h1>
        <p class="lead">Welcome to your new blog</p>
        <p class="text-light">Deployed on ${new Date().toLocaleString()}</p>
      </div>
    </header>

    <main class="container my-5">
      <div class="row g-5">
        <div class="col-md-8">
          <article class="blog-post">
            <h2>Getting Started with Your Blog</h2>
            <p class="text-muted">Posted on ${new Date().toDateString()}</p>
            <p>This is a starter blog template deployed with Netlify Deployer. You can now start adding your own content.</p>
            <p>Netlify provides powerful features for your site:</p>
            <ul>
              <li>Free SSL certificates</li>
              <li>CDN for fast global delivery</li>
              <li>Continuous deployment</li>
              <li>Form handling</li>
            </ul>
          </article>
          
          <article class="blog-post mt-5">
            <h2>Next Steps</h2>
            <p>Now that your site is live, here are some things you might want to do:</p>
            <ol>
              <li>Connect a custom domain</li>
              <li>Set up Git integration for updates</li>
              <li>Customize your site design</li>
              <li>Add authentication with Netlify Identity</li>
            </ol>
          </article>
        </div>
        
        <div class="col-md-4">
          <div class="position-sticky bg-light rounded p-4" style="top: 2rem;">
            <h4>About</h4>
            <p>This blog template was automatically deployed by Netlify Deployer.</p>
            
            <h4 class="mt-4">Links</h4>
            <ul class="list-unstyled">
              <li><a href="https://app.netlify.com/sites/${siteName}" target="_blank">Netlify Dashboard</a></li>
              <li><a href="https://docs.netlify.com" target="_blank">Netlify Docs</a></li>
              <li><a href="https://github.com" target="_blank">Connect to GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer mt-auto py-3 bg-light">
      <div class="container text-center">
        <span class="text-muted">© ${new Date().getFullYear()} ${siteName} • Created with Netlify Deployer</span>
      </div>
    </footer>
  </body>
</html>
`;

// Portfolio template
export const portfolioTemplate = (siteName: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} - Portfolio</title>
    <meta name="description" content="A professional portfolio deployed with Netlify Deployer">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body class="portfolio-theme">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">${siteName}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#work">Work</a></li>
            <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
            <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <header class="hero d-flex align-items-center text-light">
      <div class="container text-center">
        <h1 class="display-3 fw-bold">Welcome to My Portfolio</h1>
        <p class="lead">Designer & Developer</p>
        <a href="#work" class="btn btn-outline-light mt-3">View My Work</a>
      </div>
    </header>

    <main class="container my-5">
      <section id="work" class="py-5">
        <h2 class="text-center mb-5">My Work</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Project One</h5>
                <p class="card-text">A sample project description would go here, explaining what the project is and what technologies were used.</p>
              </div>
              <div class="card-footer bg-transparent border-0">
                <a href="#" class="btn btn-sm btn-outline-primary">View Details</a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Project Two</h5>
                <p class="card-text">Another project description would go here, highlighting your skills and achievements.</p>
              </div>
              <div class="card-footer bg-transparent border-0">
                <a href="#" class="btn btn-sm btn-outline-primary">View Details</a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Project Three</h5>
                <p class="card-text">A third project description showcasing your diverse abilities and completed work.</p>
              </div>
              <div class="card-footer bg-transparent border-0">
                <a href="#" class="btn btn-sm btn-outline-primary">View Details</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="about" class="py-5">
        <div class="row">
          <div class="col-lg-6">
            <h2>About Me</h2>
            <p>This is where you would introduce yourself, your skills, and your professional background. Talk about your passion for design, development, or whatever your expertise is.</p>
            <p>Add information about your education, experience, and what makes you unique in your field.</p>
          </div>
          <div class="col-lg-6">
            <h3>My Skills</h3>
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>HTML/CSS</span>
                <span>90%</span>
              </div>
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 90%"></div>
              </div>
            </div>
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>JavaScript</span>
                <span>85%</span>
              </div>
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 85%"></div>
              </div>
            </div>
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>React</span>
                <span>80%</span>
              </div>
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 80%"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="contact" class="py-5">
        <h2 class="text-center mb-4">Get In Touch</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <form>
              <div class="mb-3">
                <input type="text" class="form-control" placeholder="Your Name">
              </div>
              <div class="mb-3">
                <input type="email" class="form-control" placeholder="Your Email">
              </div>
              <div class="mb-3">
                <textarea class="form-control" rows="5" placeholder="Your Message"></textarea>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer py-4 bg-dark text-light">
      <div class="container text-center">
        <p>© ${new Date().getFullYear()} ${siteName} • Created with Netlify Deployer</p>
        <p>
          <a href="https://app.netlify.com/sites/${siteName}" target="_blank" class="text-light mx-2">Netlify Dashboard</a>
          <a href="https://github.com" target="_blank" class="text-light mx-2">GitHub</a>
        </p>
      </div>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
`;

// Landing page template
export const landingPageTemplate = (siteName: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} - Landing Page</title>
    <meta name="description" content="A high-converting landing page template deployed with Netlify Deployer">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body class="landing-theme">
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">${siteName}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
            <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
            <li class="nav-item"><a class="nav-link" href="#testimonials">Testimonials</a></li>
            <li class="nav-item"><a class="nav-link btn btn-primary text-white px-3 ms-lg-3" href="#signup">Sign Up</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <header class="hero d-flex align-items-center text-center">
      <div class="container">
        <h1 class="display-3 fw-bold mb-4">The Perfect Landing Page</h1>
        <p class="lead mb-4">Capture leads, showcase your product, and drive conversions with this professionally designed landing page.</p>
        <div class="d-flex justify-content-center gap-3">
          <a href="#signup" class="btn btn-primary btn-lg">Get Started</a>
          <a href="#features" class="btn btn-outline-dark btn-lg">Learn More</a>
        </div>
      </div>
    </header>

    <section id="features" class="py-5">
      <div class="container">
        <h2 class="text-center mb-5">Key Features</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="feature-icon bg-primary text-white mx-auto mb-3">
                <span>1</span>
              </div>
              <h3>Responsive Design</h3>
              <p>Looks great on any device, from mobile phones to desktop computers.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="feature-icon bg-primary text-white mx-auto mb-3">
                <span>2</span>
              </div>
              <h3>Easy Customization</h3>
              <p>Modify colors, content, and layout to match your brand identity.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="feature-icon bg-primary text-white mx-auto mb-3">
                <span>3</span>
              </div>
              <h3>Conversion Focused</h3>
              <p>Designed with clear call-to-actions to maximize your conversion rate.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section id="pricing" class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Pricing Plans</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-header text-center py-3">
                <h3 class="mb-0">Basic</h3>
              </div>
              <div class="card-body">
                <div class="pricing-value text-center">
                  <h4 class="display-4 fw-bold">$19</h4>
                  <span class="text-muted">per month</span>
                </div>
                <ul class="list-unstyled mt-4 mb-4">
                  <li class="py-2 border-bottom">Feature One</li>
                  <li class="py-2 border-bottom">Feature Two</li>
                  <li class="py-2 border-bottom">Feature Three</li>
                  <li class="py-2 text-muted">Feature Four</li>
                  <li class="py-2 text-muted">Feature Five</li>
                </ul>
                <div class="text-center">
                  <a href="#signup" class="btn btn-outline-primary">Choose Plan</a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-primary shadow">
              <div class="card-header text-center py-3 bg-primary text-white">
                <h3 class="mb-0">Pro</h3>
                <span class="badge bg-warning text-dark position-absolute top-0 start-50 translate-middle">Popular</span>
              </div>
              <div class="card-body">
                <div class="pricing-value text-center">
                  <h4 class="display-4 fw-bold">$49</h4>
                  <span class="text-muted">per month</span>
                </div>
                <ul class="list-unstyled mt-4 mb-4">
                  <li class="py-2 border-bottom">Feature One</li>
                  <li class="py-2 border-bottom">Feature Two</li>
                  <li class="py-2 border-bottom">Feature Three</li>
                  <li class="py-2 border-bottom">Feature Four</li>
                  <li class="py-2 text-muted">Feature Five</li>
                </ul>
                <div class="text-center">
                  <a href="#signup" class="btn btn-primary">Choose Plan</a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-header text-center py-3">
                <h3 class="mb-0">Enterprise</h3>
              </div>
              <div class="card-body">
                <div class="pricing-value text-center">
                  <h4 class="display-4 fw-bold">$99</h4>
                  <span class="text-muted">per month</span>
                </div>
                <ul class="list-unstyled mt-4 mb-4">
                  <li class="py-2 border-bottom">Feature One</li>
                  <li class="py-2 border-bottom">Feature Two</li>
                  <li class="py-2 border-bottom">Feature Three</li>
                  <li class="py-2 border-bottom">Feature Four</li>
                  <li class="py-2 border-bottom">Feature Five</li>
                </ul>
                <div class="text-center">
                  <a href="#signup" class="btn btn-outline-primary">Choose Plan</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section id="signup" class="py-5 bg-primary text-white">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7 mb-4 mb-lg-0">
            <h2>Ready to get started?</h2>
            <p class="lead">Sign up now to get access to all our features and start growing your business.</p>
          </div>
          <div class="col-lg-5">
            <div class="card">
              <div class="card-body p-4">
                <h3 class="text-dark mb-4">Sign Up</h3>
                <form>
                  <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Your Name">
                  </div>
                  <div class="mb-3">
                    <input type="email" class="form-control" placeholder="Your Email">
                  </div>
                  <div class="mb-3">
                    <select class="form-select">
                      <option selected>Choose a plan</option>
                      <option>Basic</option>
                      <option>Pro</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Get Started</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="py-4 bg-dark text-light">
      <div class="container text-center">
        <p>© ${new Date().getFullYear()} ${siteName} • Created with Netlify Deployer</p>
        <p>
          <a href="https://app.netlify.com/sites/${siteName}" target="_blank" class="text-light mx-2">Netlify Dashboard</a>
          <a href="https://docs.netlify.com" target="_blank" class="text-light mx-2">Netlify Docs</a>
        </p>
      </div>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
`;

// CSS styles for all templates
export const commonStyles = `
/* Common styles for all templates */
:root {
  --primary-color: #4f46e5;
  --secondary-color: #fb7185;
  --dark-color: #1f2937;
  --light-color: #f9fafb;
  --text-color: #374151;
  --border-color: #e5e7eb;
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Blog Template Styles */
.blog-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #8b5cf6 100%);
  color: white;
  padding: 5rem 0 3rem;
  margin-bottom: 2rem;
}

.blog-post {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

/* Portfolio Template Styles */
.portfolio-theme .navbar {
  background-color: var(--dark-color);
}

.portfolio-theme .hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  height: 100vh;
  min-height: 500px;
}

.portfolio-theme .progress-bar {
  background-color: var(--primary-color);
}

/* Landing Page Template Styles */
.landing-theme .navbar {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.landing-theme .hero {
  background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  height: 80vh;
  min-height: 500px;
}

.feature-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
}

.pricing-value {
  padding: 1.5rem 0;
}

/* Buttons styling */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #4338ca;
  border-color: #4338ca;
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
`; 