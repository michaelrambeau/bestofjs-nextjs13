import Image from "next/image";

export const Footer = () => {
  return (
    <div className="app-container">
      <footer className="footer p-10 bg-base-200 text-base-content">
        <div>
          <Image
            src="/logo.png"
            alt="Best of JS logo"
            width="100"
            height="56"
          />
        </div>
        <div>
          <span className="footer-title">Direct links</span>
          <a className="link link-hover">Projects</a>
          <a className="link link-hover">Tags</a>
        </div>
        <div>
          <span className="footer-title">Related projects</span>
          <a className="link link-hover">Rising Stars</a>
          <a className="link link-hover">State of JS</a>
        </div>
      </footer>
    </div>
  );
};
