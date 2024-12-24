# Ethereum Wallet Balance Checker

## Project Overview
This project is a refactored version of a simple Ethereum wallet balance checker that originally used the Tatum API directly in the frontend. The main improvement is the separation of concerns and enhanced security by moving the API interactions to a backend server, protecting sensitive credentials.

## Architecture
The application is structured as a monorepo with two main packages:
- **ui**: A Preact-based UI for user interactions
- **api**: A server API that safely handles Tatum API requests

### Key Improvements
- Secured API key handling by moving all Tatum API calls to the backend
- Implemented a monorepo structure for better code organization
- Separated concerns between UI and API logic
- Added proper error handling and validation
- Automated deployment pipeline using GitHub Actions
- Serverless architecture using AWS services
- Enabled CORS protection for secure cross-origin requests

## Prerequisites
- Node.js (version 18 or higher)
- pnpm (`npm install -g pnpm`)
- A Tatum API key
- AWS CLI configured with appropriate permissions
- GitHub account for deployments

## Installation

1. Clone the repository:

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables API:
Create a `.env` file in the backend package directory:
```
TATUM_API_KEY=your_api_key_here
```

4. Set up environment variables ui:
Create a `.env` file in the backend package directory:
```
VITE_API_URL=api_url
```

## Development

To run the project in development mode:

```bash
# Starts the frontend & backend
pnpm dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Create user for deployment (AWS)

1. Go to IAM service
2. Click Users --> `Create User`
3. Fill the user name and click on `Next`
4. Click `Attach policies directly`, click on `AdministratorAccess` and click on `Next`
5. Click on `Create user`
6. View the created user.
7. Click on the tab `Security credentials` and click on `Create access key`
8. Click on the option `Command Line Interface (CLI)` and click on `Next`
9. Click on the button `Create access key`
10. Copy the keys `Access key` and `Secret access key`

## Quality Assurance

### Testing
```bash
# Run all tests
pnpm test

# Generate coverage report
pnpm test:coverage
```

### Linting and Code Style
```bash
# Run ESLint
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix

# Check types
pnpm type-check
```

## Building for Production

```bash
# Build both packages
pnpm build

# Start the production server
pnpm start
```

## Deployment

The project uses GitHub Actions for automated deployment to AWS serverless infrastructure.

### Frontend Deployment
- Automatically deploys to AWS CloudFront/S3 on pushes to main branch
- Static assets are served through CloudFront CDN

### Backend Deployment
- Deploys as AWS Lambda functions through API Gateway
- Serverless architecture for scalable API endpoints
- Automatic staging/production environment management
- CORS enabled and configured for secure frontend-backend communication

### GitHub Actions Workflows
Located in `.github/workflows/`:
- `frontend-deploy.yml`: Handles frontend build and deployment
- `backend-deploy.yml`: Manages backend serverless deployment

### Required Secrets
The following secrets need to be configured in GitHub repository settings:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Infrastructure
The application is deployed on AWS with the following architecture:
- Frontend: S3 + CloudFront
- Backend: Lambda + API Gateway
- SSL/TLS: AWS Certificate Manager
- Monitoring: CloudWatch
- Security: CORS enabled for protected API access
