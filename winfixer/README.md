# WinFixer

WinFixer is a web platform designed to diagnose and resolve Windows errors step by step. The application allows users to input error codes, search for error messages, describe problems in natural language, and receive tailored solutions based on their inputs.

## Features

- **Error Diagnosis**: Users can enter error codes or messages to find relevant information and solutions.
- **Contextual Assistance**: The platform guides users through a series of diagnostic questions to narrow down the issue.
- **Step-by-Step Fixes**: Users receive detailed instructions on how to resolve identified issues, along with evidence supporting each solution.
- **Feedback Mechanism**: Users can provide feedback on the effectiveness of the suggested fixes, helping to improve the platform over time.
- **Admin Dashboard**: Administrators can manage errors, fixes, evidence, and tests through a dedicated dashboard.

## Project Structure

The project is organized into several key directories:

- **app/**: Contains the main application files, including pages, components, and API routes.
- **components/**: Contains reusable UI components used throughout the application.
- **lib/**: Contains utility functions, database interactions, and validation schemas.
- **supabase/**: Contains database migrations and seed files for initializing the database.
- **scripts/**: Contains scripts for seeding the database with initial data.
- **public/**: Contains static assets like the favicon.
- **.env.example**: Example environment variables for configuration.
- **README.md**: Documentation for the project.

## Installation

To get started with WinFixer, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd winfixer
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your environment variables by copying `.env.example` to `.env.local` and filling in the required values.

4. Run the development server:
   ```
   npm run dev
   ```

## Database Setup

To set up the database, run the migrations and seed the database with initial data:

1. Navigate to the Supabase dashboard and create a new project.
2. Run the SQL migration script located in `supabase/migrations/001_initial_schema.sql` to create the necessary tables.
3. Execute the seed script located in `supabase/seed.sql` to populate the database with initial error data.

## Usage

Once the application is running, navigate to `http://localhost:3000` in your web browser to access the WinFixer platform. Users can start diagnosing Windows errors by entering error codes or messages in the search bar.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.