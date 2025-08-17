# Delula Technical Design Document

## Overview

Delula is a unified AI content creation platform that generates viral videos and images using proven recipes and intelligent routing. This document provides a comprehensive technical overview of the system architecture, focusing on the Alpha site implementation.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React/TS)    │◄──►│  (Express/TS)   │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Tailwind CSS  │    │   PostgreSQL    │    │   FAL.ai        │
│   + Radix UI    │    │   + Drizzle ORM │    │   + OpenAI      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with Delula theming
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and build

#### Backend
- **Runtime**: Node.js 22.12+ (strictly enforced)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with unified auth system
- **File Storage**: AWS S3 integration
- **Queue Management**: Custom job processing system

#### External Services
- **AI Generation**: FAL.ai (Veo 3 Fast, Flux 1)
- **Vector Search**: Pinecone for recipe embeddings
- **Cloud Infrastructure**: AWS Lambda, S3, RDS

## 🔐 Authentication System

### Unified Authentication Architecture

The system uses a single authentication service that handles both guest and registered users seamlessly.

#### User Types
```typescript
enum AccountType {
  SYSTEM = 1,      // System accounts (e.g., system_backlog)
  GUEST = 2,       // Ephemeral guest accounts
  REGISTERED = 3   // Persistent registered accounts
}

enum AccessRole {
  USER = 1,        // Standard user permissions
  TEST = 2,        // Testing and development access
  ADMIN = 3        // Administrative privileges
}
```

#### Authentication Flow
1. **Guest Access**: Users visit site → session created → guest account auto-created
2. **Session Management**: HTTP-only cookies with CSRF protection
3. **Account Upgrade**: Seamless transition from guest to registered
4. **Credit Management**: Unified credit system across all account types

#### Key Components
- `UnifiedAuthService` - Core authentication logic
- `unifiedAuthMiddleware` - Global authentication middleware
- `requireAuth` - Route protection decorator
- Session storage with automatic expiration

## 🗄️ Database Design

### Core Schema

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  account_type INTEGER DEFAULT 2,           -- 2=Guest, 3=Registered
  access_role INTEGER DEFAULT 1,            -- 1=User, 2=Test, 3=Admin
  session_token VARCHAR UNIQUE,
  email VARCHAR UNIQUE,
  credits INTEGER DEFAULT 10 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP DEFAULT NOW(),
  last_credit_refresh TIMESTAMP DEFAULT NOW(),
  
  -- Registered user fields
  password_hash VARCHAR,
  oauth_provider VARCHAR(20),
  first_name VARCHAR,
  last_name VARCHAR,
  handle VARCHAR UNIQUE,
  profile_image_url VARCHAR,
  
  -- Guest-specific metadata
  is_ephemeral BOOLEAN DEFAULT FALSE,
  can_upgrade_to_registered BOOLEAN DEFAULT TRUE
);
```

#### Generations Table
```sql
CREATE TABLE generations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  recipe_id INTEGER,
  status TEXT DEFAULT 'pending',           -- pending, processing, completed, failed
  type VARCHAR(20) DEFAULT 'image',        -- image, video
  prompt TEXT NOT NULL,
  form_data JSONB,                         -- User customization options
  metadata JSONB,                          -- Generation metadata and results
  
  -- Media URLs
  image_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  s3_key TEXT,
  asset_id TEXT,
  
  -- Processing
  queue_position INTEGER,
  processing_started_at TIMESTAMP,
  fal_job_id TEXT,
  fal_job_status TEXT,
  
  -- Credits and tracking
  credits_cost INTEGER,
  credits_refunded BOOLEAN DEFAULT FALSE,
  refunded_at TIMESTAMP,
  
  -- Identifiers
  short_id VARCHAR(11) UNIQUE,             -- YouTube-style short ID
  secure_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Recipes Table
```sql
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,                    -- AI generation prompt
  instructions TEXT NOT NULL,              -- User instructions
  category TEXT NOT NULL,
  style VARCHAR(100) DEFAULT 'photorealistic',
  model VARCHAR(100) DEFAULT 'flux-1',
  credit_cost INTEGER NOT NULL,
  usage_count INTEGER DEFAULT 0,
  
  -- Video-specific fields
  video_provider VARCHAR(50),
  video_duration INTEGER DEFAULT 10,
  video_quality VARCHAR(20) DEFAULT 'hd',
  video_aspect_ratio VARCHAR(10) DEFAULT '16:9',
  
  -- Image-specific fields
  image_provider VARCHAR(50),
  image_quality VARCHAR(20) DEFAULT 'hd',
  image_size VARCHAR(20) DEFAULT 'landscape_4_3',
  num_images INTEGER DEFAULT 1,
  
  -- Tag system
  tag_highlights INTEGER[],                 -- Array of tag IDs for categorization
  generation_type VARCHAR(20),              -- video, image
  workflow_type VARCHAR(50),                -- text_to_video, text_to_image, etc.
  
  -- Workflow configuration
  workflow_components JSONB,
  recipe_steps JSONB NOT NULL,             -- Step-by-step generation process
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT FALSE,
  preview_image_url TEXT,
  audio_type INTEGER DEFAULT 0
);
```

#### Tags Table
```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(20) DEFAULT 'gray',
  is_active BOOLEAN DEFAULT TRUE,
  is_hidden BOOLEAN DEFAULT FALSE,          -- Internal organization flag
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient hidden tag filtering
CREATE INDEX idx_tags_is_hidden ON tags (is_hidden);
```

### Tag System Architecture

The tag system provides flexible categorization through a dual-layer approach:

#### **Public Tags** (`is_hidden = false`)
- **Purpose**: User-facing descriptive tags displayed on recipe cards
- **Examples**: `surreal`, `comedy`, `danger`, `asmr`, `animal`, `athletic`
- **Usage**: Help users discover and understand recipe content
- **Display**: Visible in recipe cards, search results, and filtering interfaces

#### **Hidden Tags** (`is_hidden = true`)
- **Purpose**: Internal organization, workflow classification, and system management
- **Naming Convention**: Use prefixes to organize by purpose
- **Categories**: `category:video`, `category:image`, `category:tool`, `category:coming_soon`
- **Workflows**: `workflow:text_to_video`, `workflow:text_to_image`, `workflow:image_to_video`
- **Ratings**: `rating:family_friendly`, `rating:teen_plus`

#### **Tag Relationships**
```typescript
// Recipe with mixed tag types
const recipe = {
  id: 17,
  name: "Lava Food ASMR",
  tagHighlights: [1, 2, 3, 4, 5, 6], // Array of tag IDs
  // Public: [1, 2, 3, 4] (surreal, comedy, danger, asmr)
  // Hidden: [5, 6] (category:video, workflow:text_to_video)
};

// Frontend filtering - only show public tags
const publicTags = recipe.tagHighlights
  .map(id => tagMap[id])
  .filter(tag => !tag.isHidden);
```

#### **Category Organization**
The system supports flexible homepage organization through hidden category tags:

```typescript
// Homepage sections based on category tags
const homepageSections = {
  'Videos': recipes.filter(r => r.tagHighlights.includes(categoryVideoTagId)),
  'Images': recipes.filter(r => r.tagHighlights.includes(categoryImageTagId)),
  'Tools': recipes.filter(r => r.tagHighlights.includes(categoryToolTagId)),
  'Coming Soon': recipes.filter(r => r.tagHighlights.includes(categoryComingSoonTagId))
};
```

### Key Relationships

- **Users → Generations**: One-to-many (users can have multiple generations)
- **Recipes → Generations**: One-to-many (recipes can be used multiple times)
- **Users → Credit Transactions**: One-to-many (audit trail for credit usage)
- **Recipes → Recipe Usage**: One-to-one (usage statistics per recipe)
- **Recipes → Tags**: Many-to-many through `tagHighlights` array

### Type Tables (Documentation Only)

The system uses relationship documentation tables for type mapping:

#### `type_user` Table
```sql
CREATE TABLE type_user (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL
);

-- Seed data
INSERT INTO type_user VALUES 
  (1, 'System'),
  (2, 'Guest'), 
  (3, 'Registered');
```

#### `type_role` Table
```sql
CREATE TABLE type_role (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL
);

-- Seed data
INSERT INTO type_role VALUES 
  (1, 'User'),
  (2, 'Test'),
  (3, 'Admin');
```

**Important**: These tables are for documentation only and do not have foreign key constraints. The integers are used directly in the `users` table.

## 🔄 Content Generation Flow

### Generation Pipeline

```mermaid
graph TD
    A[User Request] --> B[Recipe Selection]
    B --> C[Form Data Collection]
    C --> D[Credit Check]
    D --> E[Queue Placement]
    E --> F[AI Processing]
    F --> G[Result Generation]
    G --> H[Storage & Delivery]
```

### Queue Management

#### Job States
1. **Pending**: Job created, waiting in queue
2. **Processing**: Currently being processed by AI service
3. **Completed**: Successfully generated, ready for delivery
4. **Failed**: Generation failed, may be retried

#### Queue Priorities
- **Guest users**: Standard priority
- **Registered users**: Standard priority
- **System jobs**: High priority (backlog generation)
- **Failed retries**: Lower priority

### AI Service Integration

#### FAL.ai Integration
```typescript
interface FALServiceConfig {
  apiKey: string;
  defaultModel: 'flux-1' | 'veo-3-fast';
  maxRetries: number;
  timeout: number;
}

class FALService {
  async generateImage(prompt: string, options: ImageOptions): Promise<GenerationResult>
  async generateVideo(prompt: string, options: VideoOptions): Promise<GenerationResult>
  async checkJobStatus(jobId: string): Promise<JobStatus>
}
```

#### OpenAI Integration
```typescript
interface OpenAIServiceConfig {
  apiKey: string;
  model: 'dall-e-2' | 'dall-e-3';
  maxRetries: number;
}

class OpenAIService {
  async generateImage(prompt: string, options: DalleOptions): Promise<GenerationResult>
  async generateVariations(imageUrl: string, options: VariationOptions): Promise<GenerationResult>
}
```

#### Service Health & Configuration
```typescript
// Service health check
interface ServiceHealth {
  status: 'healthy' | 'unhealthy';
  service: string;
  promptValidation: boolean;
  apiKeyConfigured: boolean;
  s3Configured: boolean;
}

// Pricing information
interface ServicePricing {
  model: string;
  baseCredits: number;
  pricing: Array<{
    size: string;
    quality: string;
    credits: number;
  }>;
}
```

## 🎨 Frontend Architecture

### Component Structure

#### Page Components
```
pages/
├── alpha-home.tsx              # Alpha site home page
├── alpha-my-makes.tsx          # User's generated content
├── alpha-asset-viewer.tsx      # Individual asset viewer
├── landing.tsx                 # Production site landing
├── dashboard.tsx               # User dashboard
├── gallery.tsx                 # Public gallery
└── admin/                      # Admin interface
    ├── admin-login.tsx
    ├── admin.tsx
    └── admin-backlog-maintenance.tsx
```

#### UI Components
```
components/
├── ui/                         # Radix UI primitives
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
├── auth-signin-modal.tsx       # Sign-in modal
├── auth-signup-modal.tsx       # Sign-up modal
├── alpha-header.tsx            # Alpha site header
└── animated-taglines.tsx       # Animated text components
```

### State Management

#### React Query Integration
```typescript
// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Custom hooks for data fetching
const useUserGenerations = (userId: string) => {
  return useQuery({
    queryKey: ['generations', userId],
    queryFn: () => fetchUserGenerations(userId),
    enabled: !!userId,
  });
};
```

#### Authentication State
```typescript
// Auth context and hook
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 📝 Recipe Form System

### Data-Driven Form Generation

The recipe system uses a data-driven approach where form interfaces are automatically generated from JSON configuration stored in the database.

#### Form Field Types

```typescript
// Radio Button Groups
{
  "id": "gender",
  "type": "radio", 
  "label": "Gender",
  "options": [
    {"label": "Female", "value": "female"},
    {"label": "Male", "value": "male"}
  ],
  "required": true,
  "defaultValue": "female"
}

// Dropdown Selects
{
  "id": "catCount",
  "type": "dropdown",
  "label": "Number of Cats",
  "options": [
    {"label": "One Cat", "value": "one"},
    {"label": "Two Cats", "value": "two"}
  ],
  "required": true,
  "defaultValue": "one"
}

// Text Inputs
{
  "id": "gameGenre",
  "type": "text",
  "label": "Game Genre",
  "placeholder": "e.g., platformer, RPG, retro pixel art...",
  "required": true,
  "defaultValue": ""
}
```

#### Form Integration
```typescript
// Recipe with form configuration
const recipe = {
  id: 17,
  name: "Lava Food ASMR",
  recipe_steps: [
    // Form field definitions
  ],
  form_data: {
    // User selections
  }
};
```

## 🎬 Video Player Component

### Enhanced Video Player Features

The enhanced video player provides comprehensive video viewing with automatic aspect ratio detection and Delula theming.

#### Core Features
- **Playback Controls**: Play/pause, stop, rewind, restart, fullscreen
- **Audio Controls**: Mute/unmute, volume slider, sound enabled by default
- **Speed Controls**: 0.5x to 2x playback rates
- **Loop Controls**: Auto-loop enabled by default
- **Responsive Design**: Automatic aspect ratio detection and mobile-friendly controls

#### Aspect Ratio Detection
```typescript
// Automatic aspect ratio detection
const getGenerationAspectRatioClass = (generation: Generation) => {
  const { width, height } = generation.metadata?.dimensions || {};
  
  if (width && height) {
    if (width === height) return 'aspect-square';
    if (width < height) return 'aspect-[9/16]'; // Portrait
    return 'aspect-video'; // Landscape
  }
  
  return 'aspect-video'; // Default fallback
};
```

#### Usage
```tsx
<VideoPlayer 
  url={generation.videoUrl}
  metadata={generation.metadata}
  aspectRatioClass={getGenerationAspectRatioClass(generation)}
  autoPlay={true}
  loop={true}
/>
```

## 🔍 Vector Search & Embeddings

### Pinecone Integration

The system uses Pinecone for vector-based recipe search and discovery.

#### Configuration
```typescript
// Vector embeddings configuration
interface VectorConfig {
  apiKey: string;
  environment: string;
  indexName: string;
  dimension: number;
}

// Disable during startup for faster development
const DISABLE_VECTOR_EMBEDDINGS = process.env.DISABLE_VECTOR_EMBEDDINGS === 'true';
```

#### Embedding Generation
```typescript
// Recipe embedding generation
const generateRecipeEmbedding = async (recipe: Recipe) => {
  const text = `${recipe.name} ${recipe.description} ${recipe.prompt}`;
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  
  return embedding.data[0].embedding;
};
```

#### Search Implementation
```typescript
// Vector similarity search
const searchRecipes = async (query: string, limit: number = 10) => {
  const queryEmbedding = await generateQueryEmbedding(query);
  
  const results = await pinecone.query({
    vector: queryEmbedding,
    topK: limit,
    includeMetadata: true,
  });
  
  return results.matches.map(match => ({
    recipeId: match.id,
    score: match.score,
    metadata: match.metadata,
  }));
};
```

## 🚀 Performance Optimizations

### Database Optimizations

#### Indexing Strategy
```sql
-- User queries
CREATE INDEX idx_users_session_token ON users(session_token);
CREATE INDEX idx_users_account_type ON users(account_type);
CREATE INDEX idx_users_access_role ON users(access_role);

-- Generation queries
CREATE INDEX idx_generations_user_pagination ON users(user_id, created_at DESC);
CREATE INDEX idx_generations_status ON generations(status, created_at DESC);
CREATE INDEX idx_generations_recipe ON generations(recipe_id, created_at DESC);

-- Recipe queries
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_workflow_type ON recipes(workflow_type);
```

#### Query Optimization
```typescript
// Efficient pagination
const getUserGenerations = async (userId: string, page: number, limit: number) => {
  const offset = page * limit;
  
  return await db
    .select()
    .from(generations)
    .where(eq(generations.userId, userId))
    .orderBy(desc(generations.createdAt))
    .limit(limit)
    .offset(offset);
};
```

### Frontend Optimizations

#### Code Splitting
```typescript
// Lazy load admin components
const AdminBacklogMaintenance = lazy(() => import('./admin-backlog-maintenance'));

// Route-based code splitting
const AdminRoutes = () => (
  <Suspense fallback={<AdminLoadingSpinner />}>
    <Switch>
      <Route path="/admin/backlog" component={AdminBacklogMaintenance} />
      {/* Other admin routes */}
    </Switch>
  </Suspense>
);
```

#### Image Optimization
```typescript
// Progressive image loading
const ProgressiveImage = ({ src, alt, placeholder }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!isLoaded && (
        <img 
          src={placeholder} 
          alt={alt} 
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
```

## 🔒 Security Implementation

### Authentication Security

#### Session Management
```typescript
// Secure session configuration
const sessionConfig = {
  store: new PgSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' as const,
  },
};
```

#### Route Protection
```typescript
// Authentication middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Role-based access control
export const requireRole = (requiredRole: AccessRoleId) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userAccount || req.userAccount.accessRole < requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Data Validation

#### Input Validation with Zod
```typescript
// Recipe creation schema
const createRecipeSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  prompt: z.string().min(1).max(2000),
  category: z.string().min(1).max(100),
  creditCost: z.number().int().min(1).max(100),
  workflowType: z.enum(['image', 'video', 'hybrid']),
});

// Validation middleware
export const validateRecipe = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createRecipeSchema.parse(req.body);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    next(error);
  }
};
```

## 🧪 Testing Strategy

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\    Integration Tests (Some)
 /______\   Unit Tests (Many)
```

#### Unit Tests
```typescript
// Test authentication service
describe('UnifiedAuthService', () => {
  it('should create guest user for new session', async () => {
    const sessionId = 'test-session-123';
    const userAccount = await authService.createOrRetrieveGuest(sessionId);
    
    expect(userAccount.accountType).toBe(USER_TYPES.GUEST);
    expect(userAccount.accessRole).toBe(ACCESS_ROLES.USER);
    expect(userAccount.credits).toBe(10);
  });
});
```

#### Integration Tests
```typescript
// Test authentication endpoints
describe('Auth API', () => {
  it('should upgrade guest to registered user', async () => {
    const response = await request(app)
      .post('/api/auth/upgrade')
      .send({
        email: 'test@example.com',
        oauthProvider: 'google'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.accountType).toBe(USER_TYPES.REGISTERED);
  });
});
```

### Test Data Management

#### Test Database Setup
```typescript
// Test database configuration
const testDbConfig = {
  connectionString: process.env.TEST_DATABASE_URL,
  max: 1, // Single connection for tests
};

// Test data seeding
const seedTestData = async () => {
  await db.insert(users).values({
    id: 'test-user-123',
    accountType: USER_TYPES.GUEST,
    accessRole: ACCESS_ROLES.USER,
    credits: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
```

## 📊 Monitoring & Observability

### Application Metrics

#### Key Performance Indicators
- **Response Time**: API endpoint response times
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Queue Length**: Number of pending generations

#### Custom Metrics
```typescript
// Generation success rate
const trackGenerationSuccess = (recipeId: number, success: boolean) => {
  metrics.counter('generation_attempts_total', { recipe_id: recipeId }).inc();
  if (success) {
    metrics.counter('generation_success_total', { recipe_id: recipeId }).inc();
  }
};

// Credit consumption tracking
const trackCreditUsage = (userId: string, amount: number) => {
  metrics.counter('credits_consumed_total', { user_id: userId }).inc(amount);
};
```

### Error Tracking

#### Error Classification
```typescript
// Error types for monitoring
enum ErrorType {
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown',
}
```

// Error tracking middleware
export const errorTracking = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const errorType = classifyError(error);
  
  // Log error with context
  logger.error('Request failed', {
    error: error.message,
    type: errorType,
    url: req.url,
    method: req.method,
    userId: req.userAccount?.id,
  });
  
  // Track error metrics
  metrics.counter('errors_total', { type: errorType }).inc();
  
  next(error);
};
```

## 🚀 Deployment & DevOps

### Environment Configuration

#### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/delula

# Authentication
SESSION_SECRET=your-secure-session-secret

# External Services
FAL_API_KEY=your-fal-api-key
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=delula-assets

# Site Configuration
VITE_SITE_DEPLOYMENT_TYPE=alpha
NODE_ENV=production

# Vector Embeddings
DISABLE_VECTOR_EMBEDDINGS=false
```

#### Build Configuration
```typescript
// Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  define: {
    'process.env.VITE_SITE_DEPLOYMENT_TYPE': JSON.stringify(process.env.VITE_SITE_DEPLOYMENT_TYPE),
  },
});
```

### Deployment Pipeline

#### CI/CD Configuration
```yaml
# GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22.12'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to production
        run: npm run deploy:prod
```

## 🔮 Future Roadmap

### Planned Features

#### Authentication Enhancements
- **Multi-factor authentication** for registered users
- **Social login integration** (Google, Facebook, GitHub)
- **Enterprise SSO support** for business accounts
- **Advanced role-based access control**

#### Content Generation
- **Batch generation** for multiple recipes
- **Template system** for common use cases
- **Collaborative editing** for team projects
- **Advanced workflow builder**

#### Performance Improvements
- **Redis caching** for frequently accessed data
- **CDN integration** for global asset delivery
- **Background job processing** with worker queues
- **Real-time collaboration** with WebSockets

### Technical Debt

#### Code Quality
- **100% TypeScript coverage** (currently achieved)
- **Comprehensive test coverage** (target: 90%+)
- **Performance monitoring** and alerting
- **Security audit** and vulnerability scanning

#### Infrastructure
- **Containerization** with Docker
- **Kubernetes orchestration** for scaling
- **Service mesh** for microservices communication
- **Observability stack** (Prometheus, Grafana, Jaeger)

---

## Summary

The Delula platform is built with a **modern, scalable architecture** that prioritizes type safety, performance, and maintainability. The unified authentication system, integer-based type system, and comprehensive testing strategy provide a solid foundation for future growth and feature development.

**Key Strengths:**
- ✅ **Type-safe** with full TypeScript integration
- ✅ **Scalable** with efficient database design
- ✅ **Secure** with comprehensive authentication and validation
- ✅ **Maintainable** with clear separation of concerns
- ✅ **Testable** with comprehensive testing infrastructure
- ✅ **Integrated** with comprehensive external service support
- ✅ **Optimized** with vector search and enhanced video playback
