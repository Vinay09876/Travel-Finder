# TravelFinder

**Budget-first travel discovery for Indian travelers.**

Find trips that fit your budget. Search for a destination to get an itinerary and a cost estimate, or use Budget Discovery to find places you can afford.

🔗 **Live demo:** https://travel.vinaycode.com

> Status: Beta

## Features

- **Destination search:** enter a place and generate an itinerary with a cost estimate.
- **Budget Discovery:** explore destinations that fit your budget.
- **Origin city:** estimates are shown from your starting city (for example, Mumbai).
- **Saved:** keep destinations you want to revisit.
- **How It Works:** a page explaining how the app finds and estimates trips.

## Tech stack

- [Next.js](https://nextjs.org/) with TypeScript
- [Prisma](https://www.prisma.io/) ORM
- [Supabase](https://supabase.com/) (PostgreSQL)
- Deployed on [Vercel](https://vercel.com/)

## Run locally

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Vinay09876/Travel-Finder.git
   cd Travel-Finder
   npm install
   ```

2. Create a `.env` file and set the required environment variables, including `DATABASE_URL` for your PostgreSQL database.

3. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## Author

**Vinay Ippakayala**
[Portfolio](https://ai-portfolio-psi-black.vercel.app) · [GitHub](https://github.com/Vinay09876) · [LinkedIn](https://www.linkedin.com/in/vinayippakayala)
