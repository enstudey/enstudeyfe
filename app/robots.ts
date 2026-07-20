import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login/", "/oauth2/"],
      },
    ],
    sitemap: "https://enstudey.com/sitemap.xml",
  };
}
