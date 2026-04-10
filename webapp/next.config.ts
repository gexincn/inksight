import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const envBackend = process.env.INKSIGHT_BACKEND_API_BASE?.replace(/\/$/, "");

    // ✅ 关键：生产默认走 docker service name，而不是 127.0.0.1
    const fallbackBackend =
      process.env.NODE_ENV === "production"
        ? "http://backend:8080"
        : "http://127.0.0.1:8080";

    const backend = envBackend || fallbackBackend;

    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
