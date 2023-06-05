import { defineConfig } from "cypress";

import { plugins } from "cypress-social-logins";

const googleSocialLogin = plugins.GoogleSocialLogin;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        GoogleSocialLogin: googleSocialLogin,
      });
    },
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
  },
});
