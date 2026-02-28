/**
 * @dev 404 error page component for unmatched routes.
 * Pre-rendered as static HTML for SEO and performance.
 */
import './styles.css'

export default function Page404() {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="logo-404">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <text
              x="100"
              y="130"
              fontFamily="JetBrains Mono, monospace"
              fontSize="120"
              fontWeight="700"
              textAnchor="middle"
              fill="#FD015A"
            >
              QQ
            </text>
          </svg>
        </div>

        <div className="error-code">404</div>

        <h1>Page Not Found</h1>

        <p>
          The page you're looking for doesn't exist or has been moved.
          <br />
          Let's get you back to analyzing crypto assets.
        </p>

        <a href="/" className="btn-home">
          Return to Home
        </a>
      </div>
    </div>
  )
}
