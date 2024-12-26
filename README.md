# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3ddb1bfb-c53e-4ba8-b7bb-c1d7d7e28e9e

## Backend Setup Instructions

This project uses Supabase as the backend. To set up the backend:

1. Connect to Supabase:
   - Click on the Supabase menu in the top right of the Lovable interface
   - Follow the connection process

2. Required Database Tables:
   ```sql
   -- Sites table
   create table sites (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     address text not null,
     lat double precision not null,
     lng double precision not null,
     soil_amount numeric not null,
     soil_type text not null,
     site_type text not null,
     contact_person text not null,
     email text not null,
     company text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Transactions table
   create table transactions (
     id uuid default gen_random_uuid() primary key,
     site_id uuid references sites(id) not null,
     status text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

3. Required Environment Variables:
   - VITE_SUPABASE_URL: Your Supabase project URL
   - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key
   - VITE_GOOGLE_MAPS_API_KEY: Your Google Maps API key

4. API Endpoints to Implement:
   - GET /api/sites - List all sites with filtering
   - POST /api/sites - Create new site
   - GET /api/sites/:id - Get site details
   - POST /api/transactions - Create new transaction
   - GET /api/transactions - List transactions

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3ddb1bfb-c53e-4ba8-b7bb-c1d7d7e28e9e) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
