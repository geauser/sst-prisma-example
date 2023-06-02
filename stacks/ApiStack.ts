import fs from 'fs-extra';
import path from 'node:path';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { StackContext } from "sst/constructs/FunctionalStack";
import { Api } from 'sst/constructs';


function preparePrismaLayerFiles() {
  const layerPath = "./layers/prisma";
  fs.rmSync(layerPath, { force: true, recursive: true });
  fs.mkdirSync(layerPath, { recursive: true });
  const files = ["node_modules/.prisma", "node_modules/@prisma/client", "node_modules/prisma/build"];
  for (const file of files) {
    // Do not include binary files that aren't for AWS to save space
    fs.copySync(file, path.join(layerPath, "nodejs", file), {
      filter: (src) => !src.endsWith("so.node") || src.includes("rhel"),
    });
  }
}



export function ApiStack({ stack }: StackContext) {


  preparePrismaLayerFiles();
  const PrismaLayer = new lambda.LayerVersion(stack, "PrismaLayer", {
    description: 'Prisma layer',
    code: lambda.Code.fromAsset('./layers/prisma'),
  });


  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        runtime: 'nodejs18.x',
        environment: {
          DATABASE_URL: '<Database URL for Prisma>'
        },
        nodejs: {
          esbuild: {
            external: ['@prisma/client', '.prisma'],
          },
        },
        layers: [PrismaLayer],
      }
    },
    routes: {
      "GET /lambda": "packages/functions/src/lambda.handler",
    }
  });

  stack.addOutputs({
    'api url:': api.url
  });

}