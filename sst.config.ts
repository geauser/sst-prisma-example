import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";

export default {
  config(_input) {
    return {
      name: "sst-prisma-example",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(ApiStack);

    app.setDefaultRemovalPolicy('destroy');
  }
} satisfies SSTConfig;
