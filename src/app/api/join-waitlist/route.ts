import { NextRequest, NextResponse } from 'next/server';
// Import Appwrite client and database service
import { Client, Databases, ID } from 'appwrite'; // Use 'node-appwrite' for server-side

// Initialize Appwrite client for server-side
const client = new Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // Your Appwrite Project ID
   

const databases = new Databases(client);

export async function POST(request: NextRequest) {
    try {
        const { email, location, userType, phone, updates } = await request.json(); // 'location' from frontend's 'city'

        if (!email || !location || !userType) {
            return NextResponse.json(
                { message: 'All required fields (email, city, userType) are required.' },
                { status: 400 }
            );
        }

        if (!process.env.BREVO_API_KEY) {
            console.error("BREVO_API_KEY is not set in environment variables.");
            return NextResponse.json(
                { message: "Server configuration error: BREVO_API_KEY is missing." },
                { status: 500 }
            );
        }

        // --- START APPWRITE INTEGRATION ---
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

        try {
            await databases.createDocument(
                databaseId,
                collectionId,
                ID.unique(), // Generates a unique ID for the document
                {
                    email: email,
                    city: location, // Store as 'city' in Appwrite if that's your attribute name
                    userType: userType,
                    joinedAt: new Date().toISOString(),
                    phone: phone || null, 
                    updates: updates || false,

                    // You might also want to add 'phone' and 'wantsUpdates' here
                    // if you pass them from the frontend and have attributes for them in Appwrite
                   
                }
            );
            console.log(`Successfully stored waitlist entry in Appwrite: ${email}`);
        } catch (dbError) {
            console.error('Appwrite database storage error:', dbError);
            // Decide how to handle this: fail the whole request or just log and continue with email
            // For a waitlist, it might be acceptable to still send the email even if DB fails.
            // For now, we'll let it throw to indicate a problem.
            return NextResponse.json(
                { message: `Failed to save to database: ${(dbError as Error).message}` },
                { status: 500 }
            );
        }
        // --- END APPWRITE INTEGRATION ---


        // Send email using direct HTTP request to Brevo API
        const emailData = {
            sender: {
                name: "Ride-Geng",
                email: "justinaominisan24@gmail.com" // Ensure this sender is verified in Brevo
            },
            to: [{ email: email }],
            subject: "Welcome to the Ride-Geng Waitlist! 🎉",
            htmlContent: `
                <html>
                    <head></head>
                    <body>
                        <p>Hi there!</p>
                        <p>Thank you for joining the Ride-Geng waitlist. You're officially on board to be among the first to experience the future of community transportation in <strong>${location}</strong> as a <strong>${userType}</strong>!</p>
                        <p>We're thrilled to have you. We'll notify you as soon as we launch in your area and share exclusive updates and early access perks.</p>
                        <p>Stay tuned and get ready to ride!</p>
                        <br>
                        <p>The Ride-Geng Team</p>
                        <p><a href="https://ridegeng.com">Visit our website</a></p>
                    </body>
                </html>
            `,
            textContent: `
                Hi there!

                Thank you for joining the Ride-Geng waitlist. You're officially on board to be among the first to experience the future of community transportation in ${location} as a ${userType}!

                We're thrilled to have you. We'll notify you as soon as we launch in your area and share exclusive updates and early access perks.

                Stay tuned and get ready to ride!

                The Ride-Geng Team
                Visit our website: https://ridegeng.com
            `
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY! // Use non-null assertion if you've checked it
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Brevo API error: ${response.status} - ${errorBody}`);
            // Still throw to indicate email service failure
            throw new Error(`Email service error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Email sent successfully:', result);

        return NextResponse.json(
            { message: 'Successfully joined waitlist and confirmation email sent!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('API Error:', error);
        
        let errorMessage = 'An unexpected error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { message: `Failed to join waitlist: ${errorMessage}` },
            { status: 500 }
        );
    }
}