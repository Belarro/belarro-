# PropCheck - Property Inspection & Handover System
## Complete Product Design Document

---

## 1. Product Name & Positioning

**Product Name: PropCheck**

**Tagline:** "Professional Property Inspections, Anywhere"

**Alternative Names Considered:**
- InspectPro
- HandoverHub
- PropertyShield
- CheckPoint Property
- PropInspect

**Why PropCheck:**
- Short, memorable, professional
- Clearly communicates purpose (Property + Check)
- Easy to pronounce in multiple languages
- Domain likely available (.com, .io)
- Works well as verb ("Let's PropCheck this unit")

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        PropCheck Cloud                       │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   API Gateway  │  │  Auth Service│  │  Storage (S3)   │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Core Services  │  │   Database   │  │  Queue System   │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  PDF Engine    │  │ Sync Service │  │  Notification   │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ RESTful API + WebSocket
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│  PropCheck Web │  │PropCheck Mobile│  │   SmrtCom   │
│  Application   │  │   (iOS/Android)│  │ Integration │
└────────────────┘  └────────────────┘  └─────────────┘
        │                   │
        │                   │
        ▼                   ▼
┌─────────────────────────────────┐
│      IndexedDB/SQLite           │
│    (Offline-First Storage)      │
│  - Inspections Cache            │
│  - Photos (Base64/Blob)         │
│  - Templates Cache              │
│  - Pending Sync Queue           │
└─────────────────────────────────┘
```

### 2.2 Multi-Tenant Architecture

**Tenant Isolation Strategy:**
- Database: Row-level security with `organization_id` on all tables
- Storage: Organized by `org-{id}/` prefix in S3 buckets
- API: JWT tokens include `organization_id` claim
- Cache: Redis namespacing per organization

**Deployment Models:**
1. **SaaS (Primary):** Shared infrastructure, multi-tenant DB
2. **Enterprise:** Dedicated instance option for large clients
3. **Embedded:** API-only mode for SmrtCom integration

### 2.3 Integration Architecture

**PropCheck ↔ SmrtCom Integration:**

```
┌──────────────┐                        ┌──────────────┐
│   SmrtCom    │                        │  PropCheck   │
│              │                        │              │
│  ┌────────┐  │   1. Webhook/API      │  ┌────────┐  │
│  │Property│──┼───────────────────────▶│  │Property│  │
│  │ Master │  │   Sync Properties      │  │ Cache  │  │
│  └────────┘  │                        │  └────────┘  │
│              │                        │              │
│  ┌────────┐  │   2. OAuth 2.0        │  ┌────────┐  │
│  │  Auth  │◀─┼───────────────────────┤  │  Auth  │  │
│  └────────┘  │   Single Sign-On      │  └────────┘  │
│              │                        │              │
│  ┌────────┐  │   3. Webhook          │  ┌────────┐  │
│  │Tickets │◀─┼───────────────────────┤  │Inspect.│  │
│  │        │  │   Issue Created       │  │        │  │
│  └────────┘  │                        │  └────────┘  │
│              │                        │              │
│  ┌────────┐  │   4. API Query        │  ┌────────┐  │
│  │Reports │◀─┼───────────────────────┤  │Reports │  │
│  │        │  │   Pull Inspections    │  │        │  │
│  └────────┘  │                        │  └────────┘  │
└──────────────┘                        └──────────────┘
```

**Integration Points:**
1. **Property Sync:** Pull property data from SmrtCom
2. **SSO:** OAuth 2.0/SAML for unified authentication
3. **Ticket Creation:** Push issues to SmrtCom ticketing system
4. **Report Access:** SmrtCom can query/embed inspection reports
5. **Tenant Data:** Pull tenant information when available

---

## 3. Technology Stack Recommendation

### 3.1 Backend Stack

**Primary Technology:** Node.js + TypeScript
- **Why:** Fast development, great ecosystem, excellent for real-time features
- **Framework:** NestJS (enterprise-grade, modular, built-in DI)

**Database:**
- **Primary:** PostgreSQL 15+ (JSONB for flexible schemas)
- **Cache:** Redis (session management, sync queue)
- **Search:** ElasticSearch (for report/property search)

**Storage:**
- **Images:** AWS S3 / Azure Blob Storage
- **CDN:** CloudFront for global image delivery

**Queue System:**
- **Bull/BullMQ** (Redis-based job queue)
- **Use cases:** PDF generation, email sending, sync processing

**PDF Generation:**
- **Puppeteer** or **PDFKit**
- Template-based rendering with HTML/CSS

### 3.2 Frontend Stack

**Mobile Application:**
- **Technology:** React Native (single codebase, iOS + Android)
- **Why:** Cost-effective, large talent pool, excellent offline capabilities
- **Alternative:** Flutter (if animation performance is critical)

**Offline Storage:**
- **React Native:** WatermelonDB (fast, sync-friendly) + React Native FS (file system)
- **iOS Fallback:** CoreData
- **Android Fallback:** Room Database

**State Management:**
- **Redux Toolkit** (predictable state, time-travel debugging)
- **Redux Persist** (auto-persist state to disk)

**Camera/Media:**
- **react-native-image-picker** (camera + gallery)
- **react-native-image-resizer** (optimize before upload)

**Signature:**
- **react-native-signature-canvas**

**Web Application:**
- **Framework:** Next.js 14+ (React with SSR)
- **UI Library:** Tailwind CSS + shadcn/ui
- **Offline:** Workbox (service workers) + IndexedDB

### 3.3 DevOps & Infrastructure

**Hosting:**
- **Backend:** AWS ECS/Fargate or Google Cloud Run
- **Database:** AWS RDS PostgreSQL (Multi-AZ)
- **Frontend:** Vercel (web) + CodePush (mobile updates)

**CI/CD:**
- GitHub Actions
- Automated testing, builds, deployments

**Monitoring:**
- **APM:** New Relic or DataDog
- **Logging:** CloudWatch or ELK Stack
- **Error Tracking:** Sentry

**Security:**
- **Auth:** Auth0 or custom JWT with refresh tokens
- **Encryption:** TLS 1.3 in transit, AES-256 at rest
- **Compliance:** GDPR-ready (data export, deletion)

---

## 4. Complete Feature List

### 4.1 Core Inspection Module

**Property Management:**
- Create/edit properties with custom fields
- Property types (preset + custom)
- Unit/floor numbering system
- Property status tracking
- Bulk import from CSV/API
- QR code generation per property
- Property photo gallery
- Equipment/appliance registry per property

**Inspection Workflow:**
- Multiple inspection types (move-in, move-out, periodic, maintenance)
- Room/section templates by property type
- Custom section creation on-the-fly
- Add/remove/reorder sections during inspection
- Duplicate previous inspection as template
- Inspection scheduling and calendar
- Multi-inspector support (team inspections)
- Weather conditions logging (for exterior inspections)

**Issue Documentation:**
- Photo capture with annotations (arrows, circles, text)
- Multi-photo per issue (before/after, multiple angles)
- Gallery upload (batch select)
- Issue categories (preset + custom)
- Severity levels (Critical, High, Medium, Low, Info)
- Issue templates library (common issues with descriptions)
- Voice-to-text for descriptions
- Measurement tool (estimate dimensions from photo)
- Location pinning within property plan
- Video recording support (short clips)

**Digital Sign-off:**
- On-screen review of all findings
- Tenant signature capture
- Inspector signature
- Witness signature (optional)
- Signature timestamp and GPS
- Decline-to-sign workflow with reason
- Email confirmation to all parties
- SMS notification option

### 4.2 Reporting & Documentation

**Report Generation:**
- PDF export with company branding
- Customizable report templates
- Multi-language support
- Photo layouts (grid, list, full-page)
- Executive summary vs. detailed report
- Automated email delivery
- Report versioning (if corrections needed)
- Watermarking option

**Report Sections:**
- Cover page with property/tenant details
- Inspector certification
- Inspection metadata (date, time, weather)
- Section-by-section findings
- Issue summary table
- Photo evidence pages
- Recommendations
- Sign-off page with signatures
- Appendix (equipment list, floor plans)

**Analytics & Insights:**
- Inspection completion metrics
- Average inspection time by property type
- Most common issues (across portfolio)
- Inspector performance metrics
- Issue resolution tracking
- Trend analysis (deterioration over time)
- Damage cost estimation
- Benchmark reports (compare properties)

### 4.3 Template & Configuration

**Room/Section Templates:**
- Pre-built templates for 10+ property types
- Template marketplace (share/download)
- Customizable checklist items per room
- Conditional fields (show kitchen fields only in kitchen)
- Template versioning
- Import/export templates as JSON
- Template preview before use

**Issue Templates:**
- Library of 100+ common issues
- Industry-standard descriptions
- Suggested photos per issue type
- Repair cost estimates (optional)
- Recommended actions
- Custom template creation
- Categorization and tagging

**Property Type Presets:**
- Residential (studio, 1BR, 2BR, 3BR+, house)
- Commercial (office, retail, industrial)
- Specialized (storage unit, parking, warehouse)
- Mixed-use configurations
- Custom type builder with guided setup

### 4.4 Offline & Sync

**Offline Capabilities:**
- Full inspection creation without internet
- Photo capture and storage (device memory)
- Local PDF preview generation
- Queue management UI (show pending sync)
- Conflict resolution interface
- Offline mode indicator
- Data size monitoring (warn if storage low)

**Sync Strategy:**
- Auto-sync when connection detected
- Manual sync trigger
- Background sync (when app closed)
- Differential sync (only changes)
- Photo upload with progress indicator
- Retry logic with exponential backoff
- Sync history log

**Conflict Handling:**
- Last-write-wins (default)
- Manual conflict resolution for critical fields
- Merge strategies for non-conflicting changes
- Audit trail of sync events

### 4.5 Ticket Integration

**Issue to Ticket:**
- One-click ticket creation
- Pre-fill ticket with inspection data
- Attach issue photos automatically
- Link ticket back to inspection
- Priority mapping (severity → priority)
- Category mapping
- Assignment rules (auto-assign based on issue type)
- Ticket status tracking in PropCheck

**Integration Options:**
- SmrtCom native integration
- Generic webhook (work with any system)
- Email-to-ticket (send formatted email)
- API push to third-party systems
- Zapier integration for 1000+ tools

### 4.6 User & Access Management

**User Roles:**
- **Super Admin:** Full system access, org management
- **Admin:** Manage users, properties, templates
- **Inspector:** Create/edit inspections, view assigned properties
- **Viewer:** Read-only access to reports
- **Tenant (Portal):** View own inspection reports, sign-off

**Permissions:**
- Granular permissions per role
- Custom role builder
- Property-level access control
- Inspection type restrictions
- API key management for integrations

**Multi-Organization:**
- Organization hierarchy (parent/child)
- Brand customization per org
- Separate billing per org
- Data isolation guarantees
- Cross-org reporting (for franchises)

### 4.7 Advanced Features

**Historical Comparison:**
- Side-by-side photo comparison (move-in vs move-out)
- Difference highlighting
- Timeline view of property condition
- Damage progression tracking
- Responsibility determination (tenant vs wear-and-tear)

**Damage Deposit Calculation:**
- Automated deduction recommendations
- Cost estimation per issue
- Jurisdiction-specific rules engine
- Deduction justification report
- Tenant dispute workflow
- Integration with accounting systems

**Equipment Tracking:**
- Barcode/QR code scanning
- Equipment registry per property
- Serial number logging
- Warranty tracking
- Maintenance history
- Replacement recommendations

**Voice Features:**
- Voice-to-text for issue descriptions
- Voice commands (hands-free operation)
- Audio notes (record while inspecting)
- Multi-language voice input

**AI Enhancements (Future):**
- Auto-detect issues from photos
- Issue categorization suggestions
- Repair cost estimation from photo
- Duplicate issue detection
- Quality score for inspections

**Compliance & Legal:**
- Jurisdiction-specific checklists
- Legal disclaimer templates
- GDPR compliance tools (data export/deletion)
- Audit trail for all changes
- E-signature legal validation
- Data retention policies

### 4.8 Communication Features

**Notifications:**
- Email notifications (inspection complete, signature needed)
- SMS alerts (optional)
- In-app notifications
- Push notifications (mobile)
- Webhook notifications (for integrations)

**Tenant Portal:**
- Secure login to view inspection history
- Download reports as PDF
- Dispute submission workflow
- Message center with property manager
- Appointment scheduling for inspections

**Collaboration:**
- Comments on issues
- @mentions for team members
- Internal notes (not visible to tenant)
- Shared inspection (multiple inspectors)
- Real-time collaboration (WebSocket)

---

## 5. Database Schema

### 5.1 Core Tables

```sql
-- ============================================================
-- ORGANIZATION & USERS
-- ============================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'free', -- free, professional, enterprise
    subscription_status VARCHAR(50) DEFAULT 'active',
    parent_organization_id UUID REFERENCES organizations(id),
    settings JSONB DEFAULT '{}', -- branding, locale, features
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- nullable for SSO users
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- super_admin, admin, inspector, viewer, tenant
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    sso_provider VARCHAR(50), -- google, microsoft, smrtcom
    sso_id VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    permissions JSONB DEFAULT '[]', -- array of permission strings
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PROPERTIES
-- ============================================================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    property_code VARCHAR(100), -- unique within org
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- apartment, shop, commercial, storage, parking, custom
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, under_renovation
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    coordinates JSONB, -- {lat, lng}
    floor VARCHAR(50),
    unit VARCHAR(50),
    square_footage DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    parking_spaces INTEGER,
    custom_fields JSONB DEFAULT '{}',
    qr_code_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, property_code)
);

CREATE TABLE property_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE property_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- appliance, hvac, plumbing, electrical
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    barcode VARCHAR(100),
    installation_date DATE,
    warranty_expiry DATE,
    last_maintenance_date DATE,
    notes TEXT,
    photos JSONB DEFAULT '[]', -- array of photo URLs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TENANTS
-- ============================================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company_name VARCHAR(255), -- for commercial tenants
    id_type VARCHAR(50), -- passport, drivers_license, national_id
    id_number VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    lease_start_date DATE NOT NULL,
    lease_end_date DATE,
    rent_amount DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'active', -- active, expired, terminated
    lease_document_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TEMPLATES
-- ============================================================

CREATE TABLE inspection_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(100), -- which property type this is for
    inspection_type VARCHAR(100), -- move_in, move_out, periodic, maintenance
    is_public BOOLEAN DEFAULT false, -- available in marketplace
    is_default BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    sections JSONB NOT NULL, -- array of section objects
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE issue_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- structural, electrical, plumbing, cosmetic, appliance
    severity VARCHAR(50), -- critical, high, medium, low, info
    suggested_photos INTEGER DEFAULT 1,
    estimated_cost DECIMAL(10,2),
    recommended_action TEXT,
    is_public BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INSPECTIONS
-- ============================================================

CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES leases(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    inspection_type VARCHAR(100) NOT NULL, -- move_in, move_out, periodic, maintenance
    status VARCHAR(50) DEFAULT 'draft', -- draft, in_progress, completed, signed, cancelled
    template_id UUID REFERENCES inspection_templates(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    inspector_id UUID REFERENCES users(id),
    inspector_name VARCHAR(255), -- cached for reports
    tenant_name VARCHAR(255), -- cached for reports
    company_name VARCHAR(255), -- for commercial
    weather_conditions VARCHAR(100), -- sunny, rainy, cloudy, etc
    temperature_celsius DECIMAL(4,1),
    sections JSONB NOT NULL DEFAULT '[]', -- array of section objects
    summary TEXT,
    recommendations TEXT,
    total_issues_count INTEGER DEFAULT 0,
    critical_issues_count INTEGER DEFAULT 0,
    is_synced BOOLEAN DEFAULT false, -- offline sync flag
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inspection_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    section_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    severity VARCHAR(50) NOT NULL, -- critical, high, medium, low, info
    location VARCHAR(255), -- specific location within section
    estimated_cost DECIMAL(10,2),
    responsibility VARCHAR(50), -- tenant, landlord, unknown
    status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, wont_fix
    template_id UUID REFERENCES issue_templates(id) ON DELETE SET NULL,
    position INTEGER, -- order within section
    measurements JSONB, -- {width, height, depth, unit}
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inspection_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES inspection_issues(id) ON DELETE CASCADE,
    section_name VARCHAR(255),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    local_path TEXT, -- for offline storage
    file_size INTEGER, -- bytes
    annotations JSONB, -- drawing data {shapes: [...]}
    caption VARCHAR(500),
    is_synced BOOLEAN DEFAULT false,
    position INTEGER,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inspection_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    signer_type VARCHAR(50) NOT NULL, -- inspector, tenant, witness
    signer_name VARCHAR(255) NOT NULL,
    signer_email VARCHAR(255),
    signature_data TEXT NOT NULL, -- base64 SVG or image
    ip_address VARCHAR(50),
    user_agent TEXT,
    gps_coordinates JSONB, -- {lat, lng, accuracy}
    signed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inspection_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    version INTEGER DEFAULT 1,
    report_type VARCHAR(50) DEFAULT 'detailed', -- summary, detailed
    pdf_url TEXT,
    file_size INTEGER,
    page_count INTEGER,
    language VARCHAR(10) DEFAULT 'en',
    generated_by UUID REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TICKETS & INTEGRATION
-- ============================================================

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    inspection_id UUID REFERENCES inspections(id) ON DELETE SET NULL,
    issue_id UUID REFERENCES inspection_issues(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    external_ticket_id VARCHAR(255), -- ID from SmrtCom or other system
    external_system VARCHAR(100), -- smrtcom, jira, servicenow
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50),
    status VARCHAR(50) DEFAULT 'open',
    assigned_to UUID REFERENCES users(id),
    external_url TEXT,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE integration_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    integration_type VARCHAR(100) NOT NULL, -- smrtcom, zapier, webhook, email
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    config JSONB NOT NULL, -- auth credentials, endpoints, mappings
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SYNC & AUDIT
-- ============================================================

CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255),
    entity_type VARCHAR(100) NOT NULL, -- inspection, photo, issue
    entity_id UUID NOT NULL,
    operation VARCHAR(50) NOT NULL, -- create, update, delete
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL, -- create, update, delete, view, export
    changes JSONB, -- before/after for updates
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- inspection_complete, signature_needed, ticket_created
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_parent ON organizations(parent_organization_id);

-- Users
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Properties
CREATE INDEX idx_properties_organization ON properties(organization_id);
CREATE INDEX idx_properties_code ON properties(property_code);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);

-- Inspections
CREATE INDEX idx_inspections_organization ON inspections(organization_id);
CREATE INDEX idx_inspections_property ON inspections(property_id);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX idx_inspections_scheduled ON inspections(scheduled_date);
CREATE INDEX idx_inspections_sync ON inspections(is_synced) WHERE is_synced = false;

-- Issues
CREATE INDEX idx_issues_inspection ON inspection_issues(inspection_id);
CREATE INDEX idx_issues_severity ON inspection_issues(severity);
CREATE INDEX idx_issues_category ON inspection_issues(category);

-- Photos
CREATE INDEX idx_photos_inspection ON inspection_photos(inspection_id);
CREATE INDEX idx_photos_issue ON inspection_photos(issue_id);
CREATE INDEX idx_photos_sync ON inspection_photos(is_synced) WHERE is_synced = false;

-- Sync Queue
CREATE INDEX idx_sync_queue_status ON sync_queue(status) WHERE status = 'pending';
CREATE INDEX idx_sync_queue_device ON sync_queue(device_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(is_read) WHERE is_read = false;
```

### 5.2 Schema Notes

**JSONB Usage:**
- `sections` in inspections: Flexible schema for room/section data
- `settings`: Per-org and per-user configuration
- `custom_fields`: Extensibility without schema changes
- `annotations`: Drawing data for photo markup
- `config` in integrations: Different integration types need different configs

**Soft Deletes:**
- Not implemented by default (use `deleted_at` column if required)
- Archive pattern: Move to archive tables for long-term storage

**Partitioning Strategy (for scale):**
- Partition `inspections` by organization_id + created_at (monthly)
- Partition `audit_logs` by created_at (monthly)
- Partition `sync_queue` by status + created_at

---

## 6. UI/UX Flow - Screen by Screen

### 6.1 Mobile App - Main Inspection Flow

#### **Screen 1: Dashboard/Home**

```
┌─────────────────────────────────────┐
│  ☰  PropCheck        🔔  👤         │
├─────────────────────────────────────┤
│                                     │
│  📋 My Inspections                  │
│  ┌────────────────────────────────┐│
│  │ Today • 3 scheduled            ││
│  │                                ││
│  │ 🏢 Apt 204 - Move-in           ││
│  │    2:00 PM • Cedar Plaza       ││
│  │    [Continue Draft]            ││
│  │                                ││
│  │ 🏪 Shop 15 - Periodic          ││
│  │    4:30 PM • Market Street     ││
│  │    [Start Inspection]          ││
│  └────────────────────────────────┘│
│                                     │
│  Tomorrow • 2 scheduled             │
│                                     │
│  ⚡ Quick Actions                   │
│  ┌─────────┐ ┌─────────┐ ┌───────┐│
│  │   📷    │ │   📊    │ │  ⚙️   ││
│  │ Start   │ │ Reports │ │ Setup ││
│  │  New    │ │         │ │       ││
│  └─────────┘ └─────────┘ └───────┘│
│                                     │
│  📊 Quick Stats                     │
│  ├─ 12 completed this month        │
│  ├─ 3 pending signatures           │
│  └─ 8 tickets created              │
│                                     │
│  🔄 Sync Status: ✅ All synced     │
│     Last sync: 2 min ago           │
└─────────────────────────────────────┘
        [Home] [Properties] [More]
```

**Features:**
- Color-coded inspection cards (green=on time, yellow=soon, red=overdue)
- Pull-to-refresh
- Offline indicator banner if no connection
- Pending sync counter badge

---

#### **Screen 2: Start New Inspection**

```
┌─────────────────────────────────────┐
│  ←  New Inspection              ✕  │
├─────────────────────────────────────┤
│                                     │
│  Property *                         │
│  ┌────────────────────────────────┐│
│  │ 🔍 Search or scan QR           ││
│  └────────────────────────────────┘│
│                                     │
│  Recent Properties:                 │
│  • Apt 204 - Cedar Plaza            │
│  • Shop 15 - Market Street          │
│  • Storage 42 - Westside            │
│                                     │
│  Inspection Type *                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐│
│  │Move  │ │Move  │ │Period│ │Main││
│  │ In   │ │ Out  │ │ ic   │ │ten ││
│  └──────┘ └──────┘ └──────┘ └────┘│
│    [✓]                              │
│                                     │
│  Tenant Information                 │
│  ┌────────────────────────────────┐│
│  │ 👤 Search existing tenant      ││
│  └────────────────────────────────┘│
│  or create new:                     │
│  Name: [___________________]        │
│  Email: [___________________]       │
│  Phone: [___________________]       │
│                                     │
│  Company (optional)                 │
│  [___________________________]      │
│                                     │
│  Use Template                       │
│  ┌────────────────────────────────┐│
│  │ Standard Apartment - Move In   ││
│  └────────────────────────────────┘│
│                                     │
│  Schedule (optional)                │
│  📅 Date: Today  🕐 Time: Now      │
│                                     │
│         [Start Inspection]          │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- QR code scanner (scan property QR for instant selection)
- Autocomplete for tenants (pull from lease data)
- Template selection auto-loads room structure
- Smart defaults (e.g., suggest move-in for vacant properties)

---

#### **Screen 3: Inspection Overview**

```
┌─────────────────────────────────────┐
│  ←  Apt 204 Move-In          ⋮ •••│
├─────────────────────────────────────┤
│  🏢 Cedar Plaza, Unit 204           │
│  👤 John Smith • 📧 Notify          │
│  📅 Feb 7, 2026 • 2:00 PM           │
├─────────────────────────────────────┤
│                                     │
│  Progress: 3/8 sections complete    │
│  ▓▓▓░░░░░░░░░░░░░░                 │
│                                     │
│  Sections                           │
│                                     │
│  ✅ Entrance                        │
│     3 items checked • No issues     │
│                                     │
│  ✅ Living Room                     │
│     8 items checked • 1 issue       │
│     🔴 Carpet stain near window     │
│                                     │
│  ✅ Kitchen                         │
│     12 items checked • 2 issues     │
│     🟡 Cabinet door loose           │
│     🟠 Fridge seal worn             │
│                                     │
│  ⬜ Bedroom 1                       │
│     Tap to inspect →                │
│                                     │
│  ⬜ Bedroom 2                       │
│     Tap to inspect →                │
│                                     │
│  ⬜ Bathroom                        │
│     Tap to inspect →                │
│                                     │
│  ⬜ Balcony                         │
│     Tap to inspect →                │
│                                     │
│  ⬜ General/Other                   │
│     Tap to inspect →                │
│                                     │
│  [+ Add Custom Section]             │
│                                     │
│  Summary: 3 issues found            │
│  🔴 Critical: 1  🟠 High: 1  🟡 Med: 1│
│                                     │
│         [Save Draft]                │
│      [Continue to Sign-off]         │
└─────────────────────────────────────┘
```

**Features:**
- Visual progress bar
- Section status icons (✅ complete, ⬜ pending, ⚠️ has issues)
- Issue count badges with color coding
- Drag to reorder sections
- Swipe section for quick actions (skip, duplicate)
- Auto-save every 30 seconds

---

#### **Screen 4: Section Inspection (Room Detail)**

```
┌─────────────────────────────────────┐
│  ←  Kitchen                  ⋮ •••│
├─────────────────────────────────────┤
│  🎤 Voice note  📷 Room photo       │
├─────────────────────────────────────┤
│                                     │
│  Checklist Items                    │
│                                     │
│  ☑️ Walls clean and undamaged       │
│  ☑️ Flooring in good condition      │
│  ☑️ Windows open/close properly     │
│  ☑️ Lighting functional             │
│  ☑️ Outlets working                 │
│  ☐ Cabinets and doors               │
│  ☐ Countertops                      │
│  ☐ Sink and faucet                  │
│  ☐ Stove/oven                       │
│  ☐ Refrigerator                     │
│  ☐ Dishwasher                       │
│  ☐ Ventilation/exhaust              │
│                                     │
│  📸 Section Photos (3)              │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │ 📷 │ │ 📷 │ │ 📷 │              │
│  └────┘ └────┘ └────┘              │
│                                     │
│  🚨 Issues Found (2)                │
│                                     │
│  ┌────────────────────────────────┐│
│  │ 🟡 Cabinet door loose          ││
│  │    📷 1 photo                  ││
│  │    Tap to edit →               ││
│  └────────────────────────────────┘│
│                                     │
│  ┌────────────────────────────────┐│
│  │ 🟠 Fridge seal worn            ││
│  │    📷 2 photos • 🎫 Ticket     ││
│  │    Tap to edit →               ││
│  └────────────────────────────────┘│
│                                     │
│         [+ Add Issue]               │
│                                     │
│  Notes (optional)                   │
│  ┌────────────────────────────────┐│
│  │ Overall kitchen in good shape  ││
│  │ but needs minor repairs        ││
│  └────────────────────────────────┘│
│                                     │
│    [Mark Section Complete]          │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Quick checkboxes for standard items
- Voice-to-text button for notes
- Camera button to capture room overview
- Issue cards show severity color, photo count, ticket status
- Long-press checkbox to add note to specific item
- Template items can be added/removed

---

#### **Screen 5: Add/Edit Issue**

```
┌─────────────────────────────────────┐
│  ←  New Issue                   ✓  │
├─────────────────────────────────────┤
│                                     │
│  Section: Kitchen                   │
│                                     │
│  Issue Title *                      │
│  ┌────────────────────────────────┐│
│  │ Cabinet door loose             ││
│  └────────────────────────────────┘│
│  🔍 Browse common issues            │
│                                     │
│  Category                           │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Struct│ │Cosme │ │Appli │        │
│  │ural  │ │ tic  │ │ance  │        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Electr│ │Plumb │ │Other │        │
│  │ ical │ │ ing  │ │      │        │
│  └──────┘ └──────┘ └──────┘        │
│               [✓]                   │
│                                     │
│  Severity *                         │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  🔴  │ │  🟠  │ │  🟡  │        │
│  │Critic│ │ High │ │Medium│        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐                 │
│  │  🔵  │ │  ⚪  │                 │
│  │ Low  │ │ Info │                 │
│  └──────┘ └──────┘                 │
│                                     │
│  Photos *                           │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │📷  │ │ 📷 │ │ +  │              │
│  │ 📝 │ │    │ │Add │              │
│  └────┘ └────┘ └────┘              │
│  Tap photo to annotate              │
│                                     │
│  Description                        │
│  ┌────────────────────────────────┐│
│  │ Upper cabinet door above sink  ││
│  │ has loose hinge. Door sags     ││
│  │ when opened.                   ││
│  │                            🎤  ││
│  └────────────────────────────────┘│
│                                     │
│  Location (optional)                │
│  [Upper cabinet above sink___]      │
│                                     │
│  Estimated Cost                     │
│  $ [50.00___________]               │
│                                     │
│  Responsibility                     │
│  ⚪ Tenant  ⚪ Landlord  ⚪ TBD      │
│                                     │
│  ☐ Create ticket for this issue     │
│                                     │
│         [Save Issue]                │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Issue template browser (quick select common issues)
- Inline photo annotation editor
- Voice-to-text for description
- Smart cost suggestions based on category
- One-tap ticket creation toggle
- Photo counter badge

---

#### **Screen 6: Photo Annotation**

```
┌─────────────────────────────────────┐
│  ←  Annotate                    ✓  │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │        [PHOTO OF CABINET]       ││
│  │                                 ││
│  │         ┌──── Arrow pointing    ││
│  │         │     to hinge          ││
│  │         ▼                       ││
│  │      ┌─────┐                    ││
│  │      │Loose│ ← Text callout     ││
│  │      │hinge│                    ││
│  │      └─────┘                    ││
│  │                                 ││
│  │    ⭕ ← Circle highlight        ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  Tools:                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌───┐│
│  │ ➡️ │ │ ⭕ │ │ ✏️ │ │ Aa │ │ 🗑││
│  │Arrow│ Circle Draw Text Undo    ││
│  └────┘ └────┘ └────┘ └────┘ └───┘│
│                                     │
│  Color: 🔴 🟠 🟡 🟢 🔵 ⚫ ⚪       │
│                                     │
│  Thickness: ─── ─── ───             │
│             Thin  Med  Thick        │
│                                     │
│         [Clear All] [Done]          │
└─────────────────────────────────────┘
```

**Features:**
- Pinch to zoom
- Undo/redo stack
- Color picker for annotations
- Pre-built shapes (arrow, circle, rectangle, freehand)
- Text callouts with auto-sizing
- Save as new copy (preserve original)

---

#### **Screen 7: Sign-off Process**

```
┌─────────────────────────────────────┐
│  ←  Review & Sign-off               │
├─────────────────────────────────────┤
│                                     │
│  Inspection Summary                 │
│  ┌────────────────────────────────┐│
│  │ 🏢 Apt 204 - Move-In           ││
│  │ 📅 Feb 7, 2026 at 2:00 PM      ││
│  │ 👤 John Smith                  ││
│  │ 🔍 Inspector: Sarah Johnson    ││
│  └────────────────────────────────┘│
│                                     │
│  Findings                           │
│  ✅ 8 sections inspected            │
│  🚨 3 issues found                  │
│     • 1 Critical                    │
│     • 1 High                        │
│     • 1 Medium                      │
│                                     │
│  Scroll to review all findings ▼    │
│  ┌────────────────────────────────┐│
│  │ Living Room                    ││
│  │ 🔴 Carpet stain near window    ││
│  │    📷 View photo               ││
│  │────────────────────────────────││
│  │ Kitchen                        ││
│  │ 🟡 Cabinet door loose          ││
│  │    📷 View photo               ││
│  │ 🟠 Fridge seal worn            ││
│  │    📷 View photos (2)          ││
│  └────────────────────────────────┘│
│                                     │
│  I confirm that I have reviewed     │
│  this inspection report and:        │
│                                     │
│  ☑️ All findings are accurate       │
│  ☑️ I understand my rights          │
│  ☑️ I agree to the stated issues    │
│                                     │
│  OR                                 │
│  ☐ I dispute findings (add note)    │
│                                     │
│  Tenant Signature *                 │
│  ┌────────────────────────────────┐│
│  │                                ││
│  │    [Signature area]            ││
│  │                                ││
│  └────────────────────────────────┘│
│  [Clear] John Smith, Feb 7, 2:45 PM │
│                                     │
│  Inspector Signature *              │
│  ┌────────────────────────────────┐│
│  │   [Already signed]             ││
│  │   Sarah Johnson, Feb 7, 2:45 PM││
│  └────────────────────────────────┘│
│                                     │
│  ☑️ Email report to tenant          │
│  ☑️ Email report to office          │
│                                     │
│      [Complete Inspection]          │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Expandable issue list (tap to view details/photos)
- Dispute workflow (if tenant disagrees, add note + photos)
- Signature capture with timestamp
- Auto-populate signer names
- GPS coordinates captured with signature
- Email options with preview
- PDF generation triggered on completion

---

#### **Screen 8: Completion Confirmation**

```
┌─────────────────────────────────────┐
│                                     │
│              ✅                     │
│                                     │
│      Inspection Complete!           │
│                                     │
│  The inspection has been signed     │
│  and saved successfully.            │
│                                     │
│  📧 Report emailed to:              │
│     • john.smith@email.com          │
│     • office@cedarplaza.com         │
│                                     │
│  📄 PDF Report Generated            │
│     3.2 MB • 8 pages                │
│                                     │
│  🎫 3 Tickets Created               │
│     #1024, #1025, #1026             │
│                                     │
│  Next Steps:                        │
│  ┌────────────────────────────────┐│
│  │ [View Full Report]             ││
│  └────────────────────────────────┘│
│  ┌────────────────────────────────┐│
│  │ [Share Report]                 ││
│  └────────────────────────────────┘│
│  ┌────────────────────────────────┐│
│  │ [View Tickets]                 ││
│  └────────────────────────────────┘│
│  ┌────────────────────────────────┐│
│  │ [Start New Inspection]         ││
│  └────────────────────────────────┘│
│                                     │
│         [Back to Dashboard]         │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Success animation
- Action summary (emails sent, tickets created)
- Quick actions for next steps
- Share report (email, SMS, print, cloud storage)
- Auto-navigate to dashboard after 10 seconds

---

### 6.2 Web Application - Admin/Management View

#### **Dashboard Overview**

```
┌─────────────────────────────────────────────────────────────┐
│  PropCheck    🔍 Search...        🔔(3)  Settings  👤 Admin│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Analytics Dashboard                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  Inspections │ │  Properties  │ │   Issues     │       │
│  │     127      │ │      85      │ │     234      │       │
│  │   +12% ↑     │ │   Active     │ │   Open       │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │  Inspections Over Time                          │       │
│  │  [Line chart showing trends]                    │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  Recent Inspections                          [View All →]  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Date      Property      Type      Inspector   Status │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Feb 7    Apt 204       Move-In    Sarah      ✅Signed│  │
│  │ Feb 7    Shop 15       Periodic   Mike       🟡Draft │  │
│  │ Feb 6    Storage 42    Move-Out   Sarah      ✅Signed│  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Top Issues This Month                       [Details →]   │
│  1. 🔴 Water damage (8 instances)                          │
│  2. 🟠 Cabinet repairs needed (6 instances)                │
│  3. 🟡 Paint touch-ups (12 instances)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
│ Dashboard │ Inspections │ Properties │ Reports │ Settings │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Inspection Report Template

### 7.1 PDF Report Structure

```
╔═══════════════════════════════════════════════════════════╗
║                    PROPERTY INSPECTION REPORT             ║
║                                                           ║
║  [Company Logo]                      Report #: INS-001024 ║
║  PropCheck                           Date: February 7, 2026║
╚═══════════════════════════════════════════════════════════╝

─────────────────────────────────────────────────────────────
PROPERTY INFORMATION
─────────────────────────────────────────────────────────────
Property:           Cedar Plaza, Unit 204
Address:            123 Main Street, Apt 204
                    Seattle, WA 98101
Property Type:      Residential Apartment
Square Footage:     850 sq ft
Bedrooms:           2
Bathrooms:          1

─────────────────────────────────────────────────────────────
INSPECTION DETAILS
─────────────────────────────────────────────────────────────
Inspection Type:    Move-In Handover
Date & Time:        February 7, 2026 at 2:00 PM
Duration:           45 minutes
Weather:            Sunny, 68°F
Inspector:          Sarah Johnson
                    License #: INS-12345
                    Email: sarah.johnson@propmanage.com
                    Phone: (555) 123-4567

─────────────────────────────────────────────────────────────
TENANT INFORMATION
─────────────────────────────────────────────────────────────
Tenant:             John Smith
Email:              john.smith@email.com
Phone:              (555) 987-6543
Lease Start:        February 8, 2026
Lease End:          February 7, 2027

─────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
─────────────────────────────────────────────────────────────
Sections Inspected:     8
Items Checked:          47
Issues Found:           3
Critical Issues:        1
Recommended Actions:    Repair carpet, fix cabinet, replace seal

Overall Condition:      FAIR
Move-In Ready:          YES (with minor repairs noted)

─────────────────────────────────────────────────────────────
ISSUES SUMMARY
─────────────────────────────────────────────────────────────
Severity Breakdown:
  🔴 Critical:    1
  🟠 High:        1
  🟡 Medium:      1
  🔵 Low:         0
  ⚪ Info:        0

Estimated Repair Cost:  $425.00

─────────────────────────────────────────────────────────────
DETAILED FINDINGS BY SECTION
─────────────────────────────────────────────────────────────

1. ENTRANCE
   Status: ✅ PASS
   Items Checked: 3
   Issues: None

   ☑️ Door locks and handles functional
   ☑️ Walls and ceiling in good condition
   ☑️ Flooring undamaged

   Photos: [Overview photo of entrance]

─────────────────────────────────────────────────────────────

2. LIVING ROOM
   Status: ⚠️ ISSUES FOUND
   Items Checked: 8
   Issues: 1

   ☑️ Walls clean and undamaged
   ☑️ Ceiling in good condition
   ☑️ Windows open/close properly
   ☑️ Window screens intact
   ☑️ Baseboards intact
   ☑️ Lighting functional
   ☑️ Outlets working
   ☑️ Heating/cooling vents clear

   🔴 ISSUE #1: Carpet Stain Near Window
   Category:       Cosmetic
   Severity:       CRITICAL
   Location:       Near bay window, southeast corner
   Description:    Large red stain on beige carpet,
                   approximately 12" diameter. Appears to be
                   wine or similar beverage. Stain is set and
                   not easily removable.

   Responsibility: Landlord (pre-existing)
   Est. Cost:      $250.00
   Recommended:    Professional carpet cleaning or carpet
                   replacement in living room

   Photos:         [Wide shot showing location]
                   [Close-up of stain with measurement]

─────────────────────────────────────────────────────────────

3. KITCHEN
   Status: ⚠️ ISSUES FOUND
   Items Checked: 12
   Issues: 2

   ☑️ Walls clean and undamaged
   ☑️ Flooring in good condition
   ☑️ Windows open/close properly
   ☑️ Lighting functional
   ☑️ Outlets working
   ☑️ Countertops undamaged
   ☑️ Sink and faucet working
   ☑️ Stove/oven functional
   ☑️ Dishwasher functional
   ☑️ Ventilation/exhaust working

   🟡 ISSUE #2: Cabinet Door Loose
   Category:       Cosmetic
   Severity:       MEDIUM
   Location:       Upper cabinet above sink
   Description:    Cabinet door has loose hinge. Door sags
                   slightly when opened. Hinge screws need
                   tightening or replacement.

   Responsibility: Landlord (wear and tear)
   Est. Cost:      $50.00
   Recommended:    Tighten or replace hinge hardware
   Ticket:         #1025 created

   Photos:         [Cabinet door sagging]
                   [Close-up of loose hinge]

   🟠 ISSUE #3: Refrigerator Seal Worn
   Category:       Appliance
   Severity:       HIGH
   Location:       Refrigerator door, bottom section
   Description:    Door seal (gasket) on refrigerator shows
                   signs of wear and cracking in bottom-left
                   corner. May affect efficiency and allow
                   cold air to escape.

   Responsibility: Landlord (maintenance)
   Est. Cost:      $125.00
   Recommended:    Replace refrigerator door seal
   Ticket:         #1026 created

   Photos:         [Full refrigerator]
                   [Close-up of worn seal]

─────────────────────────────────────────────────────────────

4. BEDROOM 1 (Primary)
   Status: ✅ PASS
   Items Checked: 7
   Issues: None

   [Checklist details...]

─────────────────────────────────────────────────────────────

5. BEDROOM 2
   Status: ✅ PASS
   Items Checked: 6
   Issues: None

   [Checklist details...]

─────────────────────────────────────────────────────────────

6. BATHROOM
   Status: ✅ PASS
   Items Checked: 9
   Issues: None

   [Checklist details...]

─────────────────────────────────────────────────────────────

7. BALCONY
   Status: ✅ PASS
   Items Checked: 4
   Issues: None

   [Checklist details...]

─────────────────────────────────────────────────────────────

8. GENERAL/OTHER
   Status: ✅ PASS
   Items Checked: 2
   Issues: None

   ☑️ Smoke detectors functional
   ☑️ No pest evidence observed

─────────────────────────────────────────────────────────────
RECOMMENDATIONS
─────────────────────────────────────────────────────────────
1. Address carpet stain before tenant move-in (critical)
2. Repair or replace kitchen cabinet hinge (medium priority)
3. Replace refrigerator door seal (high priority for energy
   efficiency)
4. Consider general carpet cleaning for entire unit

─────────────────────────────────────────────────────────────
TICKETS CREATED
─────────────────────────────────────────────────────────────
Ticket #1024:  Carpet Stain Removal - Living Room
               Priority: High | Assigned to: Maintenance Team

Ticket #1025:  Kitchen Cabinet Hinge Repair
               Priority: Medium | Assigned to: Maintenance Team

Ticket #1026:  Refrigerator Seal Replacement
               Priority: High | Assigned to: Maintenance Team

─────────────────────────────────────────────────────────────
SIGNATURES
─────────────────────────────────────────────────────────────

Inspector Signature:
[Digital signature image]
Name: Sarah Johnson
Date: February 7, 2026 at 2:45 PM
Location: 47.6062°N, 122.3321°W

I certify that this inspection was conducted professionally
and all findings are accurate to the best of my knowledge.


Tenant Signature:
[Digital signature image]
Name: John Smith
Date: February 7, 2026 at 2:47 PM

I acknowledge that I have reviewed this report and agree with
the findings. I understand that the noted issues are
pre-existing and I will not be held responsible for them.

─────────────────────────────────────────────────────────────
APPENDIX
─────────────────────────────────────────────────────────────

Equipment Registry:
• Refrigerator - Samsung, Model RF28, SN: ABC123456
• Stove/Oven - GE, Model JGB700, SN: DEF789012
• Dishwasher - Bosch, Model SHE3AR, SN: GHI345678
• Washer/Dryer - LG, Model WM3900, SN: JKL901234

Legal Disclaimer:
This inspection report is provided for informational purposes
only and does not constitute a warranty or guarantee of
property condition. The inspector has made reasonable efforts
to identify visible issues at the time of inspection.

Report Generation:
Generated by PropCheck v2.1.0
Report ID: RPT-INS-001024
Generated: February 7, 2026 at 2:50 PM
PDF Version: 1.0

─────────────────────────────────────────────────────────────
Page 8 of 8                           PropCheck | Page 8
─────────────────────────────────────────────────────────────
```

### 7.2 Report Customization Options

**Branding:**
- Custom logo upload
- Color scheme (primary, secondary colors)
- Custom footer text
- Watermark option (draft, confidential, etc.)

**Sections Toggle:**
- Include/exclude executive summary
- Include/exclude photos
- Include/exclude equipment registry
- Include/exclude repair cost estimates
- Include/exclude legal disclaimer

**Photo Layouts:**
- Grid layout (2x2, 3x3)
- Full-page photos (one per page)
- Inline with issue descriptions
- Appendix only

**Languages:**
- English, Spanish, French, German (expandable)
- Auto-translate descriptions
- Multilingual templates

---

## 8. Offline Sync Strategy

### 8.1 Offline-First Architecture

**Core Principle:** App must function fully without internet connection

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Device                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           Application Layer                       │ │
│  │  (React Native Components)                        │ │
│  └───────────────────────────────────────────────────┘ │
│                       │                                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │          State Management (Redux)                 │ │
│  │  - Active Inspection State                        │ │
│  │  - UI State                                       │ │
│  │  - Network Status                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                       │                                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │      Offline Middleware (Custom)                  │ │
│  │  - Detect network status                          │ │
│  │  - Queue operations when offline                  │ │
│  │  - Trigger sync when online                       │ │
│  └───────────────────────────────────────────────────┘ │
│                       │                                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │        Local Database (WatermelonDB)              │ │
│  │  Tables:                                          │ │
│  │  - inspections (full data)                        │ │
│  │  - issues (linked to inspections)                 │ │
│  │  - photos_metadata (paths, sync status)           │ │
│  │  - sync_queue (pending operations)                │ │
│  │  - properties_cache (reference data)              │ │
│  │  - templates_cache (pre-downloaded)               │ │
│  └───────────────────────────────────────────────────┘ │
│                       │                                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │        File System (React Native FS)              │ │
│  │  /inspections/{inspection_id}/                    │ │
│  │    photos/                                        │ │
│  │      {photo_id}.jpg (original)                    │ │
│  │      {photo_id}_thumb.jpg (thumbnail)             │ │
│  │      {photo_id}_annotated.jpg (marked up)         │ │
│  │    audio/                                         │ │
│  │      {audio_id}.m4a                               │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Sync when online
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   PropCheck Cloud                       │
│  - Receive queued operations                            │
│  - Process in order                                     │
│  - Return conflicts if any                              │
│  - Send back server IDs for local records               │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Sync Process Flow

**Step 1: Initial App Launch (Online)**
```
1. User opens app
2. Check authentication (cached token or login)
3. Background sync:
   - Pull property list (cache for 24 hours)
   - Pull templates (cache indefinitely, version check)
   - Pull user's draft inspections
   - Pull pending sync queue from server
4. Mark app as "ready for offline use"
```

**Step 2: Creating Inspection Offline**
```
1. User starts new inspection
2. Generate local UUID for inspection
3. Save to local DB with flag: synced = false
4. Add photos to local file system
5. Save photo metadata to local DB
6. Queue sync operation:
   {
     operation: "CREATE_INSPECTION",
     entity_id: "local-uuid-123",
     payload: {inspection data},
     photos: ["local-path-1", "local-path-2"],
     timestamp: "2026-02-07T14:30:00Z",
     retry_count: 0
   }
7. Show "Saved locally, will sync when online" message
```

**Step 3: Network Detection**
```
1. NetInfo listener detects connection
2. Trigger sync service
3. Show "Syncing..." indicator in UI
4. Process sync queue (see Step 4)
```

**Step 4: Sync Queue Processing**
```
For each queued operation (oldest first):
  1. Check if entity already synced (skip if yes)
  2. Upload photos first:
     - Compress image (max 2MB)
     - Upload to S3 via signed URL
     - Get permanent URL back
  3. Send inspection/issue data to API:
     - Replace local UUIDs with server IDs
     - Include photo URLs from step 2
  4. On success:
     - Update local DB with server ID
     - Mark synced = true
     - Remove from sync queue
  5. On failure:
     - Increment retry_count
     - If retry_count > 5, mark as "needs attention"
     - Use exponential backoff (retry in 1m, 2m, 4m, 8m...)
  6. On conflict (rare):
     - Fetch server version
     - Show conflict resolution UI
     - Let user choose: keep local, use server, or merge
```

**Step 5: Continuous Sync (Background)**
```
1. WebSocket connection maintained when online
2. Server pushes updates (new properties, template changes)
3. Local cache updated automatically
4. If user on affected screen, show "Data updated" prompt
```

### 8.3 Conflict Resolution

**Conflict Scenarios:**

1. **Same inspection edited on web and mobile (rare):**
   - Show diff view
   - Highlight conflicting fields
   - Let user choose field-by-field
   - Create merge version

2. **Photo uploaded twice (duplicate detection):**
   - Hash-based duplicate detection (MD5)
   - Skip upload if hash matches server
   - Link local record to existing server photo

3. **Deleted on server, edited locally:**
   - Prompt: "This was deleted elsewhere. Restore or discard?"
   - If restore, re-upload as new version

### 8.4 Data Storage Limits

**Mobile Device Storage Management:**
- Max 500 MB for photos before warning
- Auto-cleanup:
  - Delete synced inspections older than 30 days
  - Keep only thumbnails for old photos
  - Purge sync queue older than 7 days (failed syncs)
- User settings:
  - "Keep offline": Pin inspections to never delete
  - "Auto-cleanup": Enable/disable automatic purging

**Bandwidth Optimization:**
- Upload only on WiFi (user setting)
- Compress photos before upload (adjustable quality)
- Batch uploads (max 10 photos per request)
- Resume interrupted uploads (chunked upload)

---

## 9. API Design

### 9.1 API Principles

**REST-ful Design:**
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Resource-based URLs
- JSON request/response
- Consistent error format
- Versioning: `/api/v1/...`

**Authentication:**
- OAuth 2.0 for user authentication
- API keys for system integrations (SmrtCom)
- JWT tokens with refresh mechanism
- Rate limiting per organization tier

### 9.2 Core Endpoints

#### **Authentication**

```
POST /api/v1/auth/login
Request:
{
  "email": "user@example.com",
  "password": "********"
}
Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "dGhpc2lz...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "name": "Sarah Johnson",
    "role": "inspector",
    "organization": {
      "id": "uuid",
      "name": "Cedar Property Management"
    }
  }
}

POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/sso/smrtcom (OAuth flow)
```

#### **Properties**

```
GET /api/v1/properties
Query params:
  - page (default: 1)
  - limit (default: 50, max: 200)
  - type (filter by property type)
  - status (filter by active/inactive)
  - search (full-text search)

Response:
{
  "data": [
    {
      "id": "uuid",
      "property_code": "APT-204",
      "name": "Cedar Plaza, Unit 204",
      "type": "apartment",
      "address": {...},
      "qr_code_url": "https://...",
      "current_lease": {
        "tenant": {...},
        "start_date": "2026-02-08",
        "end_date": "2027-02-07"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 127,
    "total_pages": 3
  }
}

GET /api/v1/properties/{id}
POST /api/v1/properties (create)
PUT /api/v1/properties/{id} (full update)
PATCH /api/v1/properties/{id} (partial update)
DELETE /api/v1/properties/{id}
```

#### **Inspections**

```
GET /api/v1/inspections
Query params:
  - property_id
  - inspector_id
  - status (draft, in_progress, completed, signed)
  - inspection_type
  - from_date, to_date
  - include_issues (boolean, default: false)
  - include_photos (boolean, default: false)

Response:
{
  "data": [
    {
      "id": "uuid",
      "property": {...},
      "inspection_type": "move_in",
      "status": "signed",
      "scheduled_date": "2026-02-07T14:00:00Z",
      "completed_at": "2026-02-07T14:45:00Z",
      "inspector": {...},
      "tenant": {...},
      "summary": {
        "sections_count": 8,
        "issues_count": 3,
        "critical_issues_count": 1
      },
      "report_url": "https://..."
    }
  ]
}

GET /api/v1/inspections/{id}
Response:
{
  "id": "uuid",
  "property": {...},
  "inspection_type": "move_in",
  "status": "signed",
  "scheduled_date": "2026-02-07T14:00:00Z",
  "started_at": "2026-02-07T14:05:00Z",
  "completed_at": "2026-02-07T14:45:00Z",
  "inspector": {...},
  "tenant": {...},
  "weather_conditions": "sunny",
  "temperature_celsius": 20,
  "sections": [
    {
      "name": "Living Room",
      "items_checked": 8,
      "issues_count": 1,
      "status": "issues_found",
      "notes": "..."
    }
  ],
  "issues": [
    {
      "id": "uuid",
      "section_name": "Living Room",
      "title": "Carpet stain near window",
      "description": "...",
      "category": "cosmetic",
      "severity": "critical",
      "estimated_cost": 250.00,
      "responsibility": "landlord",
      "photos": [
        {
          "id": "uuid",
          "url": "https://...",
          "thumbnail_url": "https://...",
          "annotations": {...}
        }
      ]
    }
  ],
  "signatures": [
    {
      "signer_type": "inspector",
      "signer_name": "Sarah Johnson",
      "signature_data": "data:image/svg...",
      "signed_at": "2026-02-07T14:45:00Z",
      "gps_coordinates": {"lat": 47.6062, "lng": -122.3321}
    }
  ],
  "report": {
    "pdf_url": "https://...",
    "generated_at": "2026-02-07T14:50:00Z"
  }
}

POST /api/v1/inspections
Request:
{
  "property_id": "uuid",
  "inspection_type": "move_in",
  "scheduled_date": "2026-02-07T14:00:00Z",
  "tenant_id": "uuid",
  "template_id": "uuid" (optional)
}
Response: (created inspection object)

PATCH /api/v1/inspections/{id}
Request:
{
  "status": "in_progress",
  "sections": [...],
  "summary": "..."
}

POST /api/v1/inspections/{id}/complete
POST /api/v1/inspections/{id}/sign
Request:
{
  "signer_type": "tenant",
  "signer_name": "John Smith",
  "signer_email": "john@example.com",
  "signature_data": "data:image/svg...",
  "gps_coordinates": {"lat": 47.6062, "lng": -122.3321}
}
```

#### **Issues**

```
GET /api/v1/inspections/{inspection_id}/issues
POST /api/v1/inspections/{inspection_id}/issues
Request:
{
  "section_name": "Kitchen",
  "title": "Cabinet door loose",
  "description": "...",
  "category": "cosmetic",
  "severity": "medium",
  "location": "Upper cabinet above sink",
  "estimated_cost": 50.00,
  "responsibility": "landlord"
}

PATCH /api/v1/issues/{id}
DELETE /api/v1/issues/{id}
```

#### **Photos**

```
POST /api/v1/inspections/{inspection_id}/photos
Request (multipart/form-data):
  - file: <binary>
  - issue_id: "uuid" (optional)
  - section_name: "Kitchen"
  - caption: "Cabinet hinge close-up"
  - annotations: {...} (JSON string)

Response:
{
  "id": "uuid",
  "url": "https://cdn.propcheck.com/photos/...",
  "thumbnail_url": "https://cdn.propcheck.com/photos/thumb-...",
  "file_size": 1234567,
  "created_at": "2026-02-07T14:30:00Z"
}

GET /api/v1/photos/{id}
DELETE /api/v1/photos/{id}

POST /api/v1/photos/upload-url
Request:
{
  "file_name": "photo.jpg",
  "file_size": 1234567,
  "content_type": "image/jpeg"
}
Response:
{
  "upload_url": "https://s3.amazonaws.com/...",
  "photo_id": "uuid",
  "expires_in": 300
}
```

#### **Reports**

```
GET /api/v1/inspections/{id}/report
Query params:
  - format (pdf, json, html)
  - language (en, es, fr, de)
  - include_photos (boolean)

Response (PDF):
  - Content-Type: application/pdf
  - Content-Disposition: attachment; filename="inspection-report.pdf"

POST /api/v1/inspections/{id}/report/regenerate
POST /api/v1/inspections/{id}/report/send
Request:
{
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Property Inspection Report - Apt 204",
  "message": "Please find attached..."
}
```

#### **Tickets**

```
POST /api/v1/issues/{id}/ticket
Request:
{
  "external_system": "smrtcom", (optional, uses default integration)
  "priority": "high",
  "assign_to": "uuid" (optional),
  "additional_notes": "..."
}
Response:
{
  "ticket_id": "uuid",
  "external_ticket_id": "SMRT-1024",
  "external_url": "https://smrtcom.com/tickets/1024"
}

GET /api/v1/tickets
GET /api/v1/tickets/{id}
```

#### **Templates**

```
GET /api/v1/templates/inspection
Query params:
  - property_type
  - inspection_type
  - is_public (boolean)

GET /api/v1/templates/inspection/{id}
POST /api/v1/templates/inspection (create custom)
PUT /api/v1/templates/inspection/{id}
DELETE /api/v1/templates/inspection/{id}

GET /api/v1/templates/issue (issue templates)
POST /api/v1/templates/issue
```

#### **Sync**

```
POST /api/v1/sync/batch
Request:
{
  "operations": [
    {
      "operation": "CREATE_INSPECTION",
      "client_id": "local-uuid-123",
      "payload": {...}
    },
    {
      "operation": "CREATE_ISSUE",
      "client_id": "local-uuid-456",
      "inspection_client_id": "local-uuid-123",
      "payload": {...}
    }
  ]
}
Response:
{
  "results": [
    {
      "client_id": "local-uuid-123",
      "status": "success",
      "server_id": "real-uuid-789",
      "created_at": "2026-02-07T14:50:00Z"
    },
    {
      "client_id": "local-uuid-456",
      "status": "success",
      "server_id": "real-uuid-101",
      "created_at": "2026-02-07T14:50:01Z"
    }
  ]
}

GET /api/v1/sync/status
Response:
{
  "pending_operations": 0,
  "last_sync_at": "2026-02-07T14:50:00Z",
  "sync_errors": []
}
```

#### **Webhooks (for integrations)**

```
POST /api/v1/webhooks
Request:
{
  "url": "https://smrtcom.com/api/webhooks/propcheck",
  "events": ["inspection.completed", "ticket.created"],
  "secret": "webhook-secret-key"
}

GET /api/v1/webhooks
DELETE /api/v1/webhooks/{id}

POST /api/v1/webhooks/{id}/test (send test event)
```

### 9.3 SmrtCom Integration Endpoints

**For SmrtCom to call PropCheck:**

```
# Get all inspections for a property
GET /api/v1/properties/{property_id}/inspections

# Get specific inspection details
GET /api/v1/inspections/{id}

# Create ticket from SmrtCom (if ticket created manually)
POST /api/v1/tickets/link
Request:
{
  "issue_id": "uuid",
  "external_ticket_id": "SMRT-1024",
  "external_url": "https://..."
}

# Receive property updates from SmrtCom
POST /api/v1/integrations/smrtcom/properties/sync
Request:
{
  "properties": [
    {
      "external_id": "smrtcom-prop-123",
      "name": "Apt 204",
      "address": {...},
      ...
    }
  ]
}
```

**PropCheck webhooks to SmrtCom:**

```
POST {smrtcom_webhook_url}
Headers:
  X-PropCheck-Signature: sha256-hmac-signature
  X-PropCheck-Event: inspection.completed

Body:
{
  "event": "inspection.completed",
  "timestamp": "2026-02-07T14:50:00Z",
  "data": {
    "inspection_id": "uuid",
    "property": {...},
    "tenant": {...},
    "issues_count": 3,
    "report_url": "https://...",
    "tickets_created": [
      {
        "issue_title": "...",
        "severity": "critical"
      }
    ]
  }
}
```

---

## 10. Additional Features (Beyond Requirements)

### 10.1 Smart Features

**1. Historical Comparison**
- **Feature:** Side-by-side comparison of move-in vs move-out inspections
- **UI:** Split-screen view with matched photos
- **Logic:** AI-based photo matching (same room/angle detection)
- **Output:** Damage report showing what changed
- **Use case:** Prove tenant responsibility, calculate deposit deductions

**2. Damage Deposit Calculator**
- **Feature:** Auto-calculate recommended deductions
- **Inputs:** Issue severity, repair costs, jurisdiction rules
- **Logic:** Rules engine for different states/countries
  - California: Normal wear-and-tear not chargeable
  - NYC: Specific rules for paint (2 years = landlord pays)
- **Output:** Itemized deduction report with legal justification
- **Integration:** Export to accounting system

**3. Template Marketplace**
- **Feature:** Share/download inspection templates
- **Community:** Public templates from other users
- **Ratings:** Star ratings and reviews
- **Categories:** By property type, region, industry
- **Monetization:** Premium templates from professionals

**4. Voice-to-Text Everywhere**
- **Feature:** Dictate issue descriptions, notes, summaries
- **Tech:** Native speech recognition (iOS/Android)
- **Languages:** Multi-language support
- **Offline:** On-device recognition (no internet needed)

**5. Equipment Tracking with Barcode/QR**
- **Feature:** Scan appliance barcodes to auto-populate details
- **Database:** Pre-loaded appliance database (models, specs)
- **Tracking:** Equipment maintenance history
- **Alerts:** Warranty expiry notifications
- **Reports:** Equipment age/condition across portfolio

### 10.2 AI-Powered Features (Future)

**1. Auto-Issue Detection**
- **Feature:** AI analyzes photos and suggests issues
- **Tech:** Computer vision (TensorFlow, AWS Rekognition)
- **Examples:**
  - Detect cracks in walls
  - Identify water stains/mold
  - Spot damaged flooring
  - Count electrical outlets
- **UX:** Inspector reviews and confirms/rejects suggestions

**2. Smart Photo Organization**
- **Feature:** Auto-categorize photos by room
- **Tech:** Image classification (kitchen, bathroom, etc.)
- **Logic:** Group similar photos, suggest room assignment
- **Benefit:** Faster inspection workflow

**3. Repair Cost Estimation**
- **Feature:** Estimate repair costs from photos
- **Tech:** ML model trained on historical data
- **Input:** Issue photo + location
- **Output:** Cost range with confidence level
- **Data:** Improve over time with actual repair costs

**4. Duplicate Issue Detection**
- **Feature:** Warn if similar issue already documented
- **Tech:** Text similarity + photo comparison
- **Benefit:** Prevent duplicate entries
- **UX:** "This looks similar to issue #2 in Kitchen. Merge?"

**5. Quality Score**
- **Feature:** Rate inspection completeness/quality
- **Metrics:**
  - All checklist items addressed
  - Photos for all issues
  - Detailed descriptions
  - Reasonable severity assignments
- **Output:** Inspector performance dashboard
- **Benefit:** Training and quality control

### 10.3 Collaboration Features

**1. Team Inspections**
- **Feature:** Multiple inspectors on same inspection
- **Real-time:** Live updates via WebSocket
- **Assignments:** Split sections between inspectors
- **Use case:** Large commercial properties

**2. Internal Comments**
- **Feature:** @mention team members on issues
- **Visibility:** Not visible to tenant
- **Notifications:** Push/email when mentioned
- **Use case:** "@ Mike - is this critical?"

**3. Dispute Workflow**
- **Feature:** Tenant can dispute findings
- **Process:**
  1. Tenant flags issue as disputed
  2. Adds counter-photos and explanation
  3. Property manager reviews
  4. Resolution recorded (accepted, rejected, modified)
- **Legal:** Full audit trail for disputes

### 10.4 Analytics & Reporting

**1. Portfolio Insights**
- **Feature:** Dashboard for property managers
- **Metrics:**
  - Average inspection time by property type
  - Most common issues (across all properties)
  - Inspector performance (inspections/day, quality score)
  - Issue resolution time
  - Damage cost trends
- **Visualizations:** Charts, heat maps, trend lines

**2. Predictive Maintenance**
- **Feature:** Predict when repairs needed
- **Logic:** Trend analysis from periodic inspections
- **Example:** "Kitchen faucet drip severity increasing → replace in 3 months"
- **Benefit:** Proactive maintenance, cost savings

**3. Benchmarking**
- **Feature:** Compare properties to similar units
- **Metrics:**
  - Issues per inspection vs. average
  - Maintenance costs vs. portfolio average
  - Tenant damage rates
- **Benefit:** Identify problem properties/tenants

**4. Custom Reports**
- **Feature:** Build custom reports with filters
- **Builder:** Drag-and-drop report designer
- **Export:** PDF, Excel, CSV
- **Schedule:** Auto-generate and email monthly
- **Use case:** Board presentations, investor reports

### 10.5 Tenant Experience

**1. Tenant Portal**
- **Feature:** Secure login to view inspection history
- **Access:** All inspections for current/past leases
- **Actions:**
  - Download PDF reports
  - View photos
  - Submit dispute
  - Track ticket status
- **Notifications:** Email when new inspection available

**2. Pre-Inspection Checklist**
- **Feature:** Send tenant checklist before move-out
- **Content:** "Clean fridge", "Patch nail holes", etc.
- **Benefit:** Reduce preventable damage charges

**3. Appointment Scheduling**
- **Feature:** Tenant books inspection appointment
- **Integration:** Calendar sync (Google, Outlook)
- **Reminders:** Email + SMS reminders
- **Rescheduling:** Self-service rescheduling

### 10.6 Compliance & Legal

**1. Jurisdiction-Specific Checklists**
- **Feature:** Legal requirements by location
- **Examples:**
  - California: Carbon monoxide detector required
  - NYC: Window guards if child under 10
  - Florida: Hurricane shutters
- **Logic:** Auto-add required items based on property address

**2. E-Signature Legal Validation**
- **Feature:** Compliance with E-SIGN Act, eIDAS
- **Includes:**
  - Signer identity verification
  - Timestamp with time zone
  - IP address logging
  - Device fingerprint
  - Audit trail
- **Output:** Legal declaration page in PDF

**3. Data Retention Policies**
- **Feature:** Auto-delete data after X years
- **Config:** Per-organization settings
- **Legal:** GDPR "right to be forgotten"
- **Archive:** Move to cold storage before deletion

**4. Audit Trail**
- **Feature:** Immutable log of all actions
- **Logged:**
  - All edits to inspections
  - User logins/logouts
  - Report access
  - Data exports
- **Access:** Admin view only
- **Retention:** 7 years (configurable)

### 10.7 Mobile App Enhancements

**1. Offline Maps**
- **Feature:** Show property location on map (offline)
- **Tech:** Pre-downloaded map tiles
- **Benefit:** Navigate to property in areas with no signal

**2. Camera Enhancements**
- **Feature:** HDR mode, flash control, grid overlay
- **Annotations:** In-camera markup before saving
- **Batch:** Rapid-fire mode (take 10 photos quickly)

**3. Dark Mode**
- **Feature:** Full dark theme
- **Auto:** Based on time of day or device setting
- **Benefit:** Easier on eyes during evening inspections

**4. Shortcuts & Gestures**
- **Feature:** Quick actions
- **Examples:**
  - Swipe right to mark section complete
  - Long-press issue to create ticket
  - Shake to undo last action
  - 3D touch for quick preview

### 10.8 Integration Ecosystem

**1. Zapier Integration**
- **Feature:** Connect to 5000+ apps
- **Triggers:**
  - New inspection created
  - Inspection completed
  - Issue found (by severity)
- **Actions:**
  - Create calendar event
  - Send Slack message
  - Update spreadsheet

**2. Accounting Integration**
- **Feature:** Sync deposit deductions
- **Platforms:** QuickBooks, Xero, FreshBooks
- **Flow:** Inspection → Deduction report → Invoice

**3. Calendar Sync**
- **Feature:** Two-way sync with Google/Outlook
- **Events:** Scheduled inspections
- **Updates:** Real-time status changes

**4. Cloud Storage**
- **Feature:** Auto-backup photos to Dropbox/Google Drive
- **Setting:** Per-organization preference
- **Folder:** Organized by property/date

---

## 11. Implementation Roadmap

### Phase 1: MVP (3-4 months)
- Core inspection workflow (create, document, sign-off)
- Mobile app (iOS + Android)
- Basic offline support
- Photo capture and annotation
- PDF report generation
- User/property/inspection management
- Simple template system

### Phase 2: Integration (2 months)
- API development
- SmrtCom integration (OAuth, webhooks, ticket creation)
- Web admin portal
- Advanced templates (marketplace)
- Email notifications

### Phase 3: Advanced Features (2-3 months)
- Historical comparison
- Damage deposit calculator
- Equipment tracking with barcode
- Voice-to-text
- Tenant portal
- Advanced analytics

### Phase 4: AI & Optimization (ongoing)
- Auto-issue detection
- Smart photo organization
- Repair cost estimation
- Performance optimization
- Scale testing

---

## 12. Pricing Model Suggestion

### Tiers

**Free Tier:**
- 5 inspections/month
- 1 user
- Basic templates
- 30-day data retention
- PropCheck branding on reports

**Professional ($49/month or $490/year):**
- Unlimited inspections
- Up to 5 users
- Custom templates
- 2-year data retention
- Remove branding
- Email support
- Basic integrations

**Business ($149/month or $1490/year):**
- Everything in Professional
- Up to 20 users
- Historical comparison
- Damage deposit calculator
- Advanced analytics
- API access
- Priority support
- SmrtCom integration

**Enterprise (Custom pricing):**
- Everything in Business
- Unlimited users
- Dedicated instance option
- Custom integrations
- SSO (SAML, LDAP)
- SLA guarantee
- Dedicated account manager
- White-label option

**Add-ons:**
- Extra users: $10/user/month
- Additional storage: $5/100GB/month
- AI features (when available): $29/month

---

## 13. Success Metrics (KPIs)

**Product Usage:**
- Monthly Active Users (MAU)
- Inspections created per month
- Average inspection completion time
- Mobile vs. web usage ratio
- Offline usage percentage

**Business Metrics:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (LTV)
- Churn rate
- Net Promoter Score (NPS)

**Technical Metrics:**
- API uptime (target: 99.9%)
- Average response time (target: <200ms)
- Sync success rate (target: >99%)
- Photo upload success rate
- Crash-free sessions (target: >99.5%)

**User Satisfaction:**
- Time to complete inspection (target: <30 min)
- Report generation time (target: <10 sec)
- User-reported issues per month
- Feature adoption rate
- App store rating (target: 4.5+)

---

## 14. Risk Assessment & Mitigation

### Technical Risks

**1. Offline Sync Complexity**
- **Risk:** Sync conflicts, data loss
- **Mitigation:** Extensive testing, conflict resolution UI, automatic backups

**2. Photo Storage Costs**
- **Risk:** High S3 costs with large photo volumes
- **Mitigation:** Image compression, lifecycle policies (move to Glacier after 1 year), tiered storage pricing

**3. Mobile Performance**
- **Risk:** App crashes, slow rendering on low-end devices
- **Mitigation:** Performance testing on various devices, lazy loading, pagination

### Business Risks

**1. Market Competition**
- **Risk:** Existing solutions (HappyCo, Snapinspect)
- **Mitigation:** Differentiation (offline-first, SmrtCom integration, AI features)

**2. Adoption Barrier**
- **Risk:** Property managers resist new tools
- **Mitigation:** Free trial, migration assistance, excellent onboarding

**3. Data Security**
- **Risk:** Breach of tenant data (legal liability)
- **Mitigation:** SOC 2 compliance, penetration testing, insurance

---

## 15. Conclusion

**PropCheck** is designed as a best-in-class, mobile-first property inspection system that solves real-world problems for property managers, inspectors, and tenants.

**Key Differentiators:**
- **Offline-first architecture:** Works in basements and areas with poor connectivity
- **API-first design:** Easy integration with SmrtCom and other property management systems
- **Comprehensive feature set:** Beyond basic inspections—includes templates, analytics, historical comparison, damage calculations
- **Modern tech stack:** Fast, scalable, maintainable
- **User-centric design:** Mobile-optimized UI, digital sign-off, automated reporting

**Next Steps:**
1. Client approval of design
2. Finalize tech stack and team allocation
3. Create detailed sprint plan for Phase 1 MVP
4. Begin development with weekly demos
5. Beta testing with select property managers
6. Launch and iterate based on feedback

This system is production-ready for development and positions SmrtCom to offer a valuable standalone product while enhancing their core platform.
