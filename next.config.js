/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);

// module.exports = {
//   future: {
//     webpack5: true,
//   },
//   webpack: (config) => {
//     // load worker files as a urls with `file-loader`
//     config.module.rules.unshift({
//       test: /pdf\.worker\.(min\.)?js/,
//       use: [
//         {
//           loader: "file-loader",
//           options: {
//             name: "[contenthash].[ext]",
//             publicPath: "_next/static/worker",
//             outputPath: "static/worker",
//           },
//         },
//       ],
//     });

//     return config;
//   },
// };
