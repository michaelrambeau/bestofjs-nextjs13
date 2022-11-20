import Image from "next/image";
import NextLink from "next/link";

import { RISING_STARS_URL, STATE_OF_JS_URL } from "../../config";

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
          <NextLink href="/projects" className="link link-hover">
            Projects
          </NextLink>
          <NextLink href="/tags" className="link link-hover">
            Tags
          </NextLink>
        </div>
        <div>
          <span className="footer-title">Related projects</span>
          <a href={RISING_STARS_URL} className="link link-hover" target="_blank" rel="noreferrer">
            Rising Stars
          </a>
          <a href={STATE_OF_JS_URL} className="link link-hover" target="_blank" rel="noreferrer">
            State of JS
          </a>
        </div>
      </footer>
    </div>
  );
};
