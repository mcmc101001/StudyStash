import { defineConfig } from "cypress";
require("dotenv").config();

export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    baseUrl: "http://localhost:3000",
  },
});
