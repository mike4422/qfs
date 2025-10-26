import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",         // local dev (Vite)
  "https://qfsworldwide.net",      // live domain
  "https://www.qfsworldwide.net",  // with www
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow REST tools (like curl, Postman) which send no origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests globally (avoids 204 warnings)
app.options("*", cors());
