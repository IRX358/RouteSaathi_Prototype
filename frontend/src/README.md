# RouteSaathi - BMTC Route Management System

A fully responsive, government-grade web application for BMTC coordinators and conductors built with HTML, CSS, and vanilla JavaScript.

## 🚀 Features

### For Coordinators
- **Dashboard**: Real-time overview of bus fleet, routes, and alerts
- **Bus Tracking**: Live monitoring of all active buses with GPS locations
- **AI Recommendations**: ML-based suggestions for bus reallocation
- **Communication**: Real-time messaging with conductors
- **Analytics**: Route performance and congestion forecasts

### For Conductors
- **Assignment View**: Today's bus and route information
- **Notifications**: Real-time alerts from coordinators
- **Issue Reporting**: Quick reporting of breakdowns, traffic, accidents
- **Messaging**: Direct communication with control center
- **Live Tracking**: GPS-enabled location sharing

## 📁 Project Structure

```
src/
├── index.html                      # Redirects to login
├── login.html                      # Universal authentication page
├── dashboard-coordinator.html      # Coordinator control center
├── dashboard-conductor.html        # Conductor panel
├── tracking.html                   # Bus tracking interface
├── ai-recommendations.html         # ML suggestions page
├── communication.html              # Messaging interface
├── css/
│   └── style.css                  # Complete stylesheet
├── js/
│   ├── login.js                   # Authentication logic
│   ├── coordinator.js             # Coordinator dashboard
│   ├── conductor.js               # Conductor panel
│   ├── tracking.js                # Bus tracking
│   ├── ml.js                      # AI recommendations
│   └── communication.js           # Messaging system
├── assets/                        # Images and logos
│   ├── karnataka-emblem.png       # Karnataka Government emblem
│   ├── bmtc-logo.png              # BMTC official logo
│   ├── bangalore-map.png          # Map placeholder
│   └── map-placeholder.png        # Route map placeholder
└── README.md                      # This file
```

## 🎨 Design System

### Color Palette
- **BMTC Red**: `#C8102E` - Primary action color
- **BMTC Dark Blue**: `#002147` - Headers and navigation
- **Karnataka Gold**: `#D4AF37` - Accent borders
- **Neutral Grey**: `#F2F2F2` - Background
- **Success Green**: `#28A745`
- **Danger Red**: `#DC3545`
- **Warning Orange**: `#FFC107`
- **Info Blue**: `#17A2B8`

### Typography
- **Font Family**: Inter, Roboto, System Sans-serif
- **Font Sizes**: 11px - 32px (scaled appropriately)
- **Font Weights**: 400, 600, 700

## 🔐 Demo Login Credentials

### Coordinator Login
- **Role**: Coordinator
- **Username**: `coordinator`
- **Password**: `coord123`

### Conductor Login
- **Role**: Conductor
- **Username**: `conductor`
- **Password**: `cond123`

## 📸 Required Assets

Place the following images in the `assets/` folder:

### 1. karnataka-emblem.png
- Karnataka Government emblem
- Recommended size: 120x120px (transparent background)
- Download from: Karnataka Government official website

### 2. bmtc-logo.png
- Official BMTC logo
- Recommended size: 150x70px (transparent background)
- Should show the BMTC bus icon with text

### 3. bangalore-map.png
- Bangalore city map showing major routes
- Recommended size: 1200x800px
- Can use any Bangalore map image

### 4. map-placeholder.png
- Generic route map or GPS indicator
- Recommended size: 600x400px
- Simple map graphic or bus route illustration

### Fallback
If you don't have these images, you can:
1. Create simple colored placeholders
2. Use text-based alternatives
3. Download from official BMTC/Karnataka Government websites

## 🚀 Getting Started

### 1. Setup
```bash
# Navigate to the src directory
cd C:\Users\DELL\routesaathi\frontend\src

# No build process needed - it's pure HTML/CSS/JS!
```

### 2. Add Images
Place the required logo images in the `assets/` folder as described above.

### 3. Run the Application

**Option A: Using Live Server (Recommended)**
1. Install VS Code extension "Live Server"
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Application opens at `http://localhost:5500`

**Option B: Using Python**
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

**Option C: Using Node.js**
```bash
npx http-server
# Visit http://localhost:8080
```

**Option D: Direct File Opening**
Simply double-click `login.html` (some features may be limited)

### 4. Login and Explore
1. Open the application
2. Select your role (Coordinator or Conductor)
3. Use the demo credentials listed above
4. Explore all features!

## 💾 Data Storage

The application uses **localStorage** for:
- User sessions
- Message history
- Mock data persistence

All data is stored locally in your browser. Clear browser data to reset.

## 📱 Responsive Design

The application is fully responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

## 🎯 Key Features Implementation

### 1. Authentication
- Role-based login (Coordinator/Conductor)
- Session management via localStorage
- Automatic redirect to appropriate dashboard

### 2. Real-time Communication
- Mock messaging system
- Chat interface with message history
- Broadcast functionality
- Issue reporting

### 3. Bus Tracking
- Mock GPS data for 24 buses
- Filter by route and status
- Status indicators (On-Time, Delay, Congestion)
- Conductor contact integration

### 4. AI Recommendations
- 6 mock ML suggestions
- Priority-based recommendations
- Impact analysis
- One-click application

### 5. Conductor Panel
- Assignment details
- Quick action buttons
- Issue reporting (breakdown, traffic, accident, crowding)
- Modal-based interactions

## 🔧 Customization

### Change Colors
Edit `css/style.css` - modify the `:root` variables at the top

### Add More Routes
Edit respective JS files - add to mock data arrays

### Modify UI Elements
All components use standard HTML/CSS - easy to customize

## 🐛 Troubleshooting

### Issue: Images not loading
**Solution**: Ensure image files are in `assets/` folder with correct names

### Issue: Login doesn't work
**Solution**: Check browser console for errors. Clear localStorage and try again.

### Issue: Page looks broken
**Solution**: Ensure `css/style.css` is properly linked in HTML files

### Issue: Functions not working
**Solution**: Check browser console. Ensure all JS files are in `js/` folder.

## 📄 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🌐 Deployment

### Deploy to GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and `/src` folder
4. Done! Your app is live

### Deploy to Netlify
1. Drag `src` folder to Netlify
2. Or connect GitHub repository
3. Instant deployment!

### Deploy to Vercel
```bash
vercel --prod
```

## 🚧 Future Enhancements

To make this production-ready, consider:
1. Backend API integration
2. Real GPS tracking with Leaflet/Google Maps
3. Actual ML model integration
4. WebSocket for real-time updates
5. User authentication with JWT
6. Database integration (PostgreSQL/MongoDB)
7. PWA capabilities
8. Offline mode support

## 📝 License

This is a demo project for BMTC. For production use, contact BMTC administration.

## 👥 Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are in correct locations
3. Clear browser cache and localStorage
4. Try in incognito mode

## 🎉 Congratulations!

You now have a fully functional BMTC route management system! Start with the login page and explore all features.

---

**Built for BMTC** | Government of Karnataka | 2025
