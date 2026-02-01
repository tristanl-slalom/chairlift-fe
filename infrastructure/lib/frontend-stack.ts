import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import BFF API URL from exports
    const bffApiUrl = cdk.Fn.importValue('ConceptoBffApiUrl');

    // S3 bucket for static website hosting
    // Note: Do NOT enable websiteIndexDocument/websiteErrorDocument here
    // as it switches CloudFront to use custom origin instead of S3 origin,
    // which breaks OAI. CloudFront handles SPA routing via error responses.
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `concepto-frontend-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false
    });

    // CloudFront Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'OriginAccessIdentity'
    );
    websiteBucket.grantRead(originAccessIdentity);

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0)
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0)
        }
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100
    });

    // Deploy website to S3
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../dist'))],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*']
    });

    // Outputs
    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront distribution URL',
      exportName: 'ConceptoFrontendUrl'
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 bucket name'
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID'
    });

    new cdk.CfnOutput(this, 'BffApiUrl', {
      value: bffApiUrl,
      description: 'BFF API URL (set as VITE_API_URL environment variable)'
    });
  }
}
