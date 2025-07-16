# RideShare Waitlist - Next.js Project

This is a Next.js application converted from HTML, CSS, and JavaScript to TypeScript and Tailwind CSS. The application features a beautiful waitlist signup form for a ride-sharing service with Appwrite backend integration.

## Features

- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive design that works on desktop and mobile
- **Beautiful UI**: Gradient backgrounds, smooth animations, and modern styling
- **Form Validation**: Client-side form validation with TypeScript
- **Backend Integration**: Connected to Appwrite for data storage
- **Interactive Elements**: Hover effects, animations, and smooth transitions

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone or download the project files
2. Navigate to the project directory:
   ```bash
   cd rideshare-waitlist
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

```
rideshare-waitlist/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and custom animations
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main page component with waitlist form
│   └── lib/
│       └── appwrite.ts          # Appwrite client configuration
├── public/                      # Static assets
├── package.json                 # Project dependencies and scripts
└── README.md                    # This file
```

## Key Components

### Main Page (`src/app/page.tsx`)
- Contains the complete waitlist form
- Handles form state management with React hooks
- Integrates with Appwrite for data submission
- Includes success message display
- Features responsive design with Tailwind CSS

### Appwrite Configuration (`src/lib/appwrite.ts`)
- Configures Appwrite client
- Exports database instance for form submissions

### Global Styles (`src/app/globals.css`)
- Tailwind CSS imports
- Custom animations (shimmer, float, slideIn)
- Typography and color scheme

## Form Fields

The waitlist form includes:
- **Email Address** (required)
- **Phone Number** (optional)
- **City** (required)
- **User Type** (required): Rider, Driver, or Both
- **Updates Checkbox**: Opt-in for launch updates

## Styling Features

- **Gradient Backgrounds**: Beautiful purple-to-pink gradients
- **Glassmorphism**: Semi-transparent containers with backdrop blur
- **Animations**: Floating logo, shimmer effects, and smooth transitions
- **Hover Effects**: Interactive buttons and form elements
- **Responsive Grid**: Adaptive layout for different screen sizes

## Appwrite Integration

The application connects to Appwrite with the following configuration:
- **Endpoint**: `https://fra.cloud.appwrite.io/v1`
- **Project ID**: `67fd15500033a79bba77`
- **Database ID**: `67fd20cb0004451b13d0`
- **Collection ID**: `685c2a8800240327e980`

## Customization

### Updating Appwrite Configuration
Edit `src/lib/appwrite.ts` to change:
- Endpoint URL
- Project ID
- Database and Collection IDs

### Styling Modifications
- Modify `src/app/globals.css` for global styles
- Update Tailwind classes in `src/app/page.tsx` for component styling
- Add new animations in the CSS file

### Form Fields
Add or modify form fields in the `formData` state and corresponding JSX in `src/app/page.tsx`.

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Appwrite**: Backend-as-a-Service for data storage
- **React Hooks**: State management and side effects

## Browser Support

This application supports all modern browsers including:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **Server-Side Rendering**: Fast initial page loads
- **Optimized Images**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for better performance
- **CSS Optimization**: Tailwind CSS purging for smaller bundle sizes

## Deployment

This Next.js application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting provider**

For Vercel deployment:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## License

This project is open source and available under the MIT License.

