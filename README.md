# Ethereum Wallet Balance Checker

## Project Overview
This project is a refactored version of a simple Ethereum wallet balance checker that originally used the Tatum API directly in the frontend. The main improvement is the separation of concerns and enhanced security by moving the API interactions to a backend server, protecting sensitive credentials.

## Key Improvements
- Secured API key handling by moving all Tatum API calls to the backend
- Implemented a monorepo structure for better code organization
- Separated concerns between UI and API logic
- Added proper error handling and validation
- Automated deployment pipeline using GitHub Actions
- Serverless architecture using AWS services
- Enabled CORS protection for secure cross-origin requests
- Implemented **LRU Cache Rate Limiting** to control API usage per client and prevent abuse

## Architecture
The application is structured as a monorepo with two main packages:
- **ui**: A Preact-based UI for user interactions
- **api**: A server API that safely handles Tatum API requests

## Infrastructure
The application is deployed on AWS with the following architecture:
- Frontend: S3 + CloudFront
- Backend: Lambda + API Gateway
- SSL/TLS: AWS Certificate Manager
- Monitoring: CloudWatch
- Security: CORS enabled for protected API access

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
# Starts the ui & api
pnpm dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Quality Assurance

### Testing
```bash
# Run all tests
pnpm test

# Generate coverage report
pnpm test:coverage
```

## Building for Production

```bash
# Build both packages
pnpm build

# Start the production server
pnpm start
```

## Deployment

The project uses GitHub Actions for automated deployment to AWS infrastructure.

## Deployed Versions URLs
- Frontend (UI): https://d13ra9hfdwafyx.cloudfront.net/
- Backend (API): https://zgyd9j5763.execute-api.us-east-1.amazonaws.com/main/api

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

## GitHub Actions Workflows
Located in `.github/workflows/`:
- `deploy-main.yml`: Handles ui & api deployment

### Required Secrets
The following secrets need to be configured in GitHub repository settings:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Frontend Deployment
- Automatically deploys to AWS CloudFront/S3 on pushes to main branch
- Static assets are served through CloudFront CDN

### Backend Deployment
- Deploys as AWS Lambda functions through API Gateway
- Serverless architecture for scalable API endpoints
- Automatic staging/production environment management
- CORS enabled and configured for secure frontend-backend communication

## API Route Explanation

The backend provides a single API route to fetch the balance of an Ethereum wallet. It validates the input, ensures rate limiting, and securely interacts with the Tatum API.

#### Endpoint
`GET /api/balance`

#### Query Parameters
- `address` (required): Ethereum wallet address (must match the regex pattern `^0x[a-fA-F0-9]{40}$`).

#### Example Request
```bash
curl -X GET "https://api-url.amazonaws.com/api/balance?address=0x1234567890abcdef1234567890abcdef12345678"
```

#### Error Responses
| Status Code | Message                                 | Description                           |
|-------------|-----------------------------------------|---------------------------------------|
| 400         | `Missing or invalid Ethereum address.` | The address is invalid or missing.   |
| 429         | `Too many requests. Please try again later.` | Rate limit exceeded for the client. |
| 500         | `API or Internal Server Error`                | Api or unexpected error occurred.        |

---