const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const MeetupEvent = require("./models/meetup.model");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Your events data
const eventsData = [
  {
    "title": "Tech Conference 2025",
    "date": "Sat Jul 12 2025",
    "timeToStart": "09:00:00 AM IST",
    "timeToEnd": "12:00:00 AM IST",
    "eventType": "Offline",
    "thumbnail": "https://external-preview.redd.it/8eySxC56lam2uKHC7OX6kYIcHFA6KudSdBk_MdpJy_s.jpg?width=1080&crop=smart&auto=webp&s=d980c034d57999db906bcac50f94f7c1a033d56d",
    "host": "Tech Org Inc.",
    "details": "Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.",
    "eventTags": ["Technology", "AI", "Blockchain"],
    "dressCode": "Business Casual",
    "ageRestrictions": "18 And Above",
    "locationCity": "San Francisco",
    "locationAddress": "123 Tech Street, SF 94105",
    "price": 199,
    "speakers": [
      {
        "name": "Tanay Pratap",
        "profileImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBY266dGD6kNU76j0e2WhAPZiyzOAuy2zdOA&s",
        "role": "Tech Educator"
      },
      {
        "name": "John Doe",
        "profileImage": "https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg",
        "role": "Blockchain Expert"
      }
    ]
  },
  {
    "title": "Digital Marketing Webinar",
    "date": "Wed Aug 6 2025",
    "timeToStart": "04:00:00 PM IST",
    "timeToEnd": "05:00:00 PM IST",
    "eventType": "Online",
    "thumbnail": "https://www.nzie.ac.nz/wp-content/uploads/2020/06/AdobeStock_211888174-scaled-1-1536x1024.jpeg",
    "host": "Marketing Pros",
    "details": "Learn the latest digital marketing strategies from industry leaders.",
    "eventTags": ["Marketing", "Social Media", "SEO"],
    "dressCode":"Smart Casual",
    "ageRestrictions":"All ages",
    "locationCity": "Virtual",
    "locationAddress": "Online Event",
    "price": 0,
    "speakers": [
      {
        "name": "Sarah Johnson",
        "profileImage": "https://pbs.twimg.com/profile_images/875498876261859329/7iV5CwVY_400x400.jpg",
        "role": "CMO at Digital Agency"
      }
    ]
  },
  {
    "title": "Startup Pitch Night",
    "date": "Fri Jul 18 2025",
    "timeToStart": "08:00:00 PM IST",
    "timeToEnd": "11:00:00 PM IST",
    "eventType": "Offline",
    "thumbnail": "https://swissnex.org/app/uploads/sites/6/2023/08/53219051742_32383d8c26_o-995x744.37405731523-c-center.jpg",
    "host": "Venture Capital Group",
    "details": "Local startups pitch their ideas to investors. Networking opportunities available.",
    "eventTags": ["Startups", "Entrepreneurship", "Investing"],
    "dressCode": "Business Attire",
    "locationCity": "New York",
    "locationAddress": "456 Startup Ave, NY 10001",
    "price": 50,
    "speakers": [
      {
        "name": "Michael Chen",
        "profileImage": "https://img.freepik.com/free-photo/portrait-smiley-woman_23-2148827181.jpg?semt=ais_hybrid&w=740",
        "role": "Venture Capitalist"
      }
    ]
  },
  {
    "title": "Yoga & Mindfulness Retreat",
    "date": "Mon Jul 21 2025",
    "timeToStart": "08:00:00 AM IST",
    "timeToEnd": "12:00:00 AM IST",
    "eventType": "Offline",
    "thumbnail": "https://img.freepik.com/premium-photo/yoga-wellness-retreat-class-morning-sunrise-beach-silhouette-five-girl-doing-asana-healthy-lifestyle-relaxing-meditation_248459-24338.jpg",
    "host": "Mindful Living",
    "details": "Morning yoga session followed by meditation and healthy breakfast.",
    "eventTags": ["Wellness", "Yoga", "Meditation"],
    "dressCode": "Comfortable Athletic Wear",
    "ageRestrictions": "16 and Above",
    "locationCity": "Austin",
    "locationAddress": "789 Peace Lane, Austin 78701",
    "price": 25,
    "speakers": [
      {
        "name": "Priya Patel",
        "profileImage": "https://img.freepik.com/free-photo/girl-with-long-hair-being-happy_23-2148244714.jpg?semt=ais_hybrid&w=740",
        "role": "Certified Yoga Instructor"
      }
    ]
  },
  {
    "title": "Blockchain for Beginners",
    "date": "Sun Nov 30 2025",
    "timeToStart": "10:00:00 PM IST",
    "timeToEnd": "12:00:00 PM IST",
    "eventType": "Online",
    "thumbnail": "https://t3.ftcdn.net/jpg/01/96/96/86/360_F_196968684_zp8obttcJzlY4tWhFHzDGOTbPkdY0Q3p.jpg",
    "host": "Crypto Academy",
    "details": "Introduction to blockchain technology and cryptocurrency fundamentals.",
    "eventTags": ["Blockchain", "Crypto", "Web3"],
    "dressCode":"Smart Casual",
    "ageRestrictions":"All ages",
    "locationCity": "Virtual",
    "locationAddress": "Online Webinar",
    "price": 0,
    "speakers": [
      {
        "name": "Alex Wong",
        "profileImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgtHcWBvV-932MBcvgRQ8yIGvV2XcNfUXlu3D5b11lW9PidQITDfrrQm4FB-nMUbyBUMw&usqp=CAU",
        "role": "Blockchain Developer"
      }
    ]
  },
  {
    "title": "Art Exhibition Opening",
    "date": "Sat Nov 15 2025",
    "timeToStart": "08:00:00 AM IST",
    "timeToEnd": "04:00:00 PM IST",
    "eventType": "Offline",
    "thumbnail": "https://www.gisich.com/images/gallery/news_gallery/gallery_091_retouched.jpg",
    "host": "Contemporary Art Gallery",
    "details": "Opening night for our new exhibition featuring emerging artists.",
    "eventTags": ["Art", "Culture", "Exhibition"],
    "dressCode": "Smart Casual",
    "ageRestrictions":"All ages",
    "locationCity": "Chicago",
    "locationAddress": "101 Art Street, Chicago 60601",
    "price": 15,
    "speakers": [
      {
        "name": "Emma Rodriguez",
        "profileImage": "https://img.freepik.com/free-photo/happy-smiling-good-looking-young-female-with-positive-smile-poses-indoor-against-blank-copy-space-expresses-happiness_273609-3818.jpg?semt=ais_hybrid&w=740",
        "role": "Gallery Curator"
      }
    ]
  },
  {
    "title": "Remote Work Summit",
    "date": "Mon Aug 25 2025",
    "timeToStart": "04:00:00 PM IST",
    "timeToEnd": "06:00:00 PM IST",
    "eventType": "Online",
    "thumbnail": "https://www.mooc.org/hubfs/basic-work-from-home-setup-jpg.jpeg",
    "host": "Future of Work Institute",
    "details": "Learn best practices for remote work and digital nomad lifestyle.",
    "eventTags": ["Remote Work", "Productivity", "Digital Nomad"],
    "locationCity": "Virtual",
    "locationAddress": "Online Conference",
    "dressCode":"Smart Casual",
    "ageRestrictions":"18 And Above",
    "price": 29,
    "speakers": [
      {
        "name": "David Kim",
        "profileImage": "https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740",
        "role": "Remote Work Consultant"
      }
    ]
  },
  {
    "title": "Sustainable Living Workshop",
    "date": "Sun Aug 10 2025",
    "timeToStart": "11:00:00 AM IST",
    "timeToEnd": "02:00:00 PM IST",
    "eventType": "Offline",
    "thumbnail": "https://sustainablegreenforum.com/wp-content/uploads/2022/05/sustainable-living.jpg",
    "host": "Green Earth Initiative",
    "details": "Hands-on workshop about reducing waste and living sustainably.",
    "eventTags": ["Sustainability", "Eco-friendly", "Zero Waste"],
    "dressCode":"Smart Casual",
    "ageRestrictions":"All ages",
    "locationCity": "Portland",
    "locationAddress": "202 Green Way, Portland 97201",
    "price": 10,
    "speakers": [
      {
        "name": "Lisa Thompson",
        "profileImage": "https://img.freepik.com/premium-photo/beautiful-smiling-woman-looking-camera-indoors-successful-young-female-posing-picture_695242-3440.jpg",
        "role": "Environmental Scientist"
      }
    ]
  },
  {
    "title": "AI in Healthcare",
    "date": "Sun Sep 14 2025",
    "timeToStart": "11:00:00 AM IST",
    "timeToEnd": "02:00:00 PM IST",
    "eventType": "Offline",
    "thumbnail": "https://itbrief.asia/uploads/story/2024/12/11/techday_26169f03bf0a929134f3.webp",
    "host": "Medical Tech Association",
    "details": "Exploring the applications of artificial intelligence in modern healthcare.",
    "eventTags": ["AI", "Healthcare", "Technology"],
    "dressCode":"Formal Wear",
    "ageRestrictions":"18 And Above",
    "locationCity": "Boston",
    "locationAddress": "303 MedTech Blvd, Boston 02108",
    "price": 49,
    "speakers": [
      {
        "name": "Dr. Robert Chen",
        "profileImage": "https://static.vecteezy.com/system/resources/thumbnails/028/287/384/small/a-mature-indian-male-doctor-on-a-white-background-ai-generated-photo.jpg",
        "role": "Medical AI Researcher"
      }
    ]
  },
  {
    "title": "Local Food Festival",
    "date": "Sun Sep 28 2025",
    "timeToStart": "08:00:00 PM IST",
    "timeToEnd": "12:00:00 PM IST",
    "eventType": "Offline",
    "thumbnail": "https://www.treebo.com/blog/wp-content/uploads/2022/11/Grub-fest.jpg",
    "host": "Urban Food Collective",
    "details": "Celebrate local food producers with tastings, workshops, and live music.",
    "eventTags": ["Food", "Local", "Festival"],
    "dressCode":"Stylish Wear",
    "ageRestrictions": "All ages",
    "locationCity": "Seattle",
    "locationAddress": "404 Foodie Lane, Seattle 98101",
    "price": 5,
    "speakers": [
      {
        "name": "Maria Garcia",
        "profileImage": "https://miro.medium.com/v2/resize:fit:1400/1*zurzWYgv6-4L123HBwzsKA.jpeg",
        "role": "Local Chef"
      }
    ]
  },
  {
    "title": "Financial Planning Seminar",
    "date": "Sun Oct 5 2025",
    "timeToStart": "06:00:00 PM IST",
    "timeToEnd": "09:00:00 PM IST",
    "eventType": "Online",
    "thumbnail": "https://1finance.co.in/magazine/wp-content/uploads/2024/04/financial-planning-text-yellow-notepad-with-financial-data-analysis-background-financial-planning-concept-1-scaled.jpg",
    "host": "Wealth Management Inc.",
    "details": "Learn strategies for retirement planning and wealth building.",
    "eventTags": ["Finance", "Investing", "Retirement"],
    "dressCode":"Smart Casual",
    "ageRestrictions":"All ages",
    "locationCity": "Virtual",
    "locationAddress": "Online Webinar",
    "price": 0,
    "speakers": [
      {
        "name": "James Wilson",
        "profileImage": "https://imgv3.fotor.com/images/ai-headshot-generator/headshot-of-a-smiling-man-wearing-the-dark-blue-business-shirt-generated-by-Fotor-AI-LinkedIn-photo-generator.jpg",
        "role": "Financial Advisor"
      }
    ]
  },
  {
    "title": "VR Gaming Tournament",
    "date": "Sun Sep 28 2025",
    "timeToStart": "12:00:00 PM IST",
    "timeToEnd": "05:00:00 PM IST",
    "eventType": "Offline",
    "thumbnail": "https://povr.com/vr/wp-content/uploads/2023/05/1ba2fd2f-ca62-4c9d-b4bd-f04852a6a753.png",
    "host": "NextGen Gaming",
    "details": "Competitive VR gaming tournament with cash prizes.",
    "eventTags": ["Gaming", "VR", "Esports"],
    "dressCode":"Smart Casual",
    "ageRestrictions": "13 and Above",
    "locationCity": "Los Angeles",
    "locationAddress": "505 Game Street, LA 90015",
    "price": 30,
    "speakers": [
      {
        "name": "Chris Taylor",
        "profileImage": "https://img.freepik.com/free-photo/handsome-sensitive-red-head-man-smiling_23-2149509800.jpg?semt=ais_hybrid&w=740",
        "role": "Professional Gamer"
      }
    ]
  }
]

// Database initialization and seeding
async function initializeApp() {
  try {
    // 1. Connect to database
    const isConnected = await initializeDatabase();
    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    // 2. Seed data
    await seedData();
    console.log("Database seeded successfully");

    // 3. Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1); // Exit with failure code
  }
}

// Seed data function
async function seedData() {
  try {
    await MeetupEvent.deleteMany({});
    console.log("Cleared existing events");

    // Using insertMany for better performance with bulk inserts
    await MeetupEvent.insertMany(eventsData);
    console.log(`Successfully seeded ${eventsData.length} events`);
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error; // Re-throw to be caught by initializeApp
  }
}

// Route handlers
async function readAllEvents() {
  try {
    return await MeetupEvent.find();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

app.get("/events", async (req, res) => {
  try {
    const events = await readAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error("Failed to get events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Initialize the application
initializeApp();