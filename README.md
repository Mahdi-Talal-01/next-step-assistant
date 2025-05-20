<img src="./readme/title1.svg"/>

<br><br>

<!-- project overview -->
<img src="./readme/title2.svg"/>

> NextStep AI is an AI-powered career acceleration platform that helps professionals navigate their career journey. It combines job tracking, skill development, and AI-driven content creation into one unified dashboard. The platform automatically monitors job-related emails, builds learning roadmaps, analyzes skills trends, and generates professional content using AI.

<br><br>

<!-- System Design -->
<img src="./readme/title3.svg"/>

#### ER Diagram

![ER Diagram](./readme/system-design/ER%20Diagram.png)



#### System components

![Frontend Architecture](./readme/system-design/system_components.png)

#### System Flowchart

![System Flowchart](./readme/system-design/Application%20Flow%20Diagram.png)

<br><br>

<!-- Project Highlights -->
<img src="./readme/title4.svg"/>


![System Flowchart](./readme/demo/project_highlights.png)
### Key Features
- **Intelligent Job Tracking & Management**

- **Smart Email Intelligence Center**

- **Data-Driven Skills Analytics**

- **AI-Powered Career Development Hub**

- **Content Creation Assistant**
- **AI Career Strategist**
- **Seamless User Experience**



### User Screens (Web)
| Landing Page                            | Landing page2                       |
| --------------------------------------- | ------------------------------------- |
| ![Landing Page](./readme/AI-images/landing.png) | ![Landing Page](./readme/AI-images/landing-1.png) |

| Dashboard                            | Ai agent                       |
| --------------------------------------- | ------------------------------------- |
| ![Landing Page](./readme/AI-images/Dashboard.png) | ![Login Page](./readme/AI-images/Ai-agent.png) |

|               Sign Up               |              User Profile               |
| :---------------------------------------: | :----------------------------------------: |
| ![Signup](./readme/demo/signup-ezgif.com-video-to-gif-converter.gif) | ![Profile](./readme/demo/Profile-ezgif.com-speed.gif) |

|               Job Email Tracker               |              Applications Jobs               |
| :---------------------------------------: | :----------------------------------------: |
| ![Analytics](./readme/demo/Emailtracker-ezgif.com-optimize.gif) | ![Applications](./readme/demo/Applications-ezgif.com-optimize.gif) |

|               Content Assistan Linkedin Post               |              Content Assistan JobDescription               |
| :---------------------------------------: | :----------------------------------------: |
| ![Analytics](./readme/demo/LinkedinPost-ezgif.com-video-to-gif-converter.gif) | ![Management](./readme/demo/JobDescription-ezgif.com-video-to-gif-converter.gif) |

|               AI Agent                |              Skills Analatics               |
| :---------------------------------------: | :----------------------------------------: |
| ![AI Agent](./readme/demo/Aiagent-ezgif.com-optimize.gif) | ![Skills](./readme/demo/skilltracker-ezgif.com-optimize.gif) |




<br><br>

<!-- Development & Testing -->
<img src="./readme/title6.svg"/>

### Development Stack

|                                                                                                                Frontend                                                                                                                |                                                                                                                                                                  Backend                                                                                                                                                                  |                                                                                                                                                                AI Services                                                                                                                                                                |                                                                                                                    Email Integration                                                                                                                     |                                               Containerization                                               |                                                                                                            Testing                                                                                                            |                                                                 CI/CD                                                                  |                                                 Deployment                                                 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
| <img src="https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black" alt="React"/> <img src="https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat&logo=framer&logoColor=white" alt="Framer Motion"/> | <img src="https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js"/> <img src="https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white" alt="Express"/> <img src="https://img.shields.io/badge/-MySQL-4479A1?style=flat&logo=mysql&logoColor=white" alt="MySQL"/> | <img src="https://img.shields.io/badge/-OpenAI-412991?style=flat&logo=openai&logoColor=white" alt="OpenAI"/> <img src="https://img.shields.io/badge/-Custom%20ML-FF6F00?style=flat&logo=tensorflow&logoColor=white" alt="Custom ML"/> <img src="https://img.shields.io/badge/-n8n-6633cc?style=flat&logo=n8n&logoColor=white" alt="n8n"/> | <img src="https://img.shields.io/badge/-Gmail%20API-EA4335?style=flat&logo=gmail&logoColor=white" alt="Gmail API"/> <img src="https://img.shields.io/badge/-Google%20Console-4285F4?style=flat&logo=google-cloud&logoColor=white" alt="Google Console"/> | <img src="https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker"/> | <img src="https://img.shields.io/badge/-Jest-C21325?style=flat&logo=jest&logoColor=white" alt="Jest"/> <img src="https://img.shields.io/badge/-Supertest-000000?style=flat&logo=javascript&logoColor=white" alt="Supertest"/> | <img src="https://img.shields.io/badge/-GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white" alt="GitHub Actions"/> | <img src="https://img.shields.io/badge/-AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white" alt="AWS"/> |

### Testing & Validation

#### Unit Testing  
![Unit Testing](./readme/testings/unit%20testing%20(2).png)

#### Integration Testing  
![Integration Testing](./readme/testings/Integration%20testing.png)

#### E2E Testing  
![E2E Testing](./readme/testings/2e2%20testing%20(1).png)
<br><br>

<!-- AI -->
<img src="./readme/title7.svg"/>

### AI Features

- **Intelligent Content Generation**

  - Professional job descriptions with industry-specific requirements
  - Engaging LinkedIn posts optimized for professional networking
  - Thoughtful email responses with appropriate tone and context
  - Well-structured blog posts with SEO optimization

- **AI-Powered Career Assistant**

  - Real-time conversation with AI career advisor
  - Personalized career path recommendations
  - Skill gap analysis and learning recommendations
  - Resume optimization with industry-specific keywords

- **Smart Email Processing**

  - AI-powered email classification and categorization
  - Automated extraction of key information from emails
  - Intelligent response suggestions based on email context
  - Priority inbox management for career opportunities

- **Advanced Analytics**
  - Market trend analysis using AI models
  - Salary prediction based on skills and experience
  - Job demand forecasting for different industries
  - Skills gap analysis with personalized recommendations

### AI System Architecture

#### System Prompts

```javascript
// Job Description Prompt
"You are an expert recruiter. Create a professional job description with responsibilities and qualifications.";

// Email Reply Prompt
"You are a professional email expert. Write a clear, concise reply to the provided email.";
```

#### User Prompts

```javascript
// Job Description User Prompt
{
  jobTitle: "Senior Software Engineer",
  industry: "Technology"
}

// Email Reply User Prompt
{
  originalEmail: "Thank you for your application...",
  tone: "professional"
}
```

#### Response Validation

- Ensures the AI response is well-structured and meets minimum content requirements.
- Checks for required sections and appropriate length.

---

### AI Agent using N8N

![N8N Workflow](./readme/AI-images/N8N-workflow.png)

**System Prompt for AI Agent:**

> You are a professional AI career assistant on the Next Step platform. You support users in advancing their careers by providing tailored guidance based on their questions and goals.
>
> You receive structured summary data (user profile, roadmaps, skills, and job applications) via a hook before each message. This data is for context only . do not repeat or reference it unless the user's message clearly requires it.
> Your responsibilities include:
>
> - Understanding and responding directly to user questions or goals.
> - When appropriate, using the user's profile, skills, roadmaps, or job applications to provide personalized suggestions.
> - Recommending next steps, resources, or optimizations related to career planning, skill development, and job search.
> - Staying focused on the user's intent without overexplaining or restating known context.
>
> Keep your tone helpful, precise, and professional. Prioritize clarity and actionability.

<br><br>

<!-- Deployment -->
<img src="./readme/title8.svg"/>

### Deployment Architecture

<img src="./readme/deployment/deployment-workflow.png" alt="Deployment Architecture" width="800"/>

Our deployment pipeline leverages GitHub Actions for CI/CD, Docker for containerization, and AWS EC2 & S3 for hosting:

- **CI/CD:** On every push to the `MT-staging` branch, GitHub Actions builds and pushes the backend Docker image to Docker Hub, builds the frontend, and deploys static assets to S3.
- **Backend:** The backend (Node.js, Express, Prisma) runs in a Docker container on an AWS EC2 instance, orchestrated via `docker-compose`.
- **Database:** MySQL runs as a separate container, with persistent storage.
- **Frontend:** The React frontend is built and deployed to AWS S3 for scalable, static hosting.
- **Secrets & Configuration:** All sensitive data and environment variables are injected securely via GitHub Secrets during the CI/CD process.

This architecture ensures automated, reliable, and scalable deployments for both backend and frontend services.
#### Postman API Documentation

- You can check the full API documentation using this [link](https://documenter.getpostman.com/view/33828343/2sB2qZE2ty).