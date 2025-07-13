# Vphisher
Vphisher is an open-source phishing tool designed to demonstrate the vulnerabilities of social engineering attacks, specifically targeting Instagram reel links. It provides a simulated environment to understand how phishing campaigns can be orchestrated and how to protect against them.


**Disclaimer:** This tool is intended for educational and ethical hacking purposes only. Misuse of this software for illegal activities is strictly prohibited and the developers are not responsible for any such actions.


## Features

*   **Flexible Link Phishing:** Simulates phishing attacks using convincing link lures, not limited to Instagram reels. The tool can generate various types of links for social engineering scenarios.
*   **Admin Dashboard:** A comprehensive dashboard to:
    *   Create and manage phishing campaigns.
    *   Monitor victim interactions and data.
    *   View detailed statistics.
*   **Supabase Integration:** Utilizes Supabase for secure and scalable backend services, including database and authentication.

## Technologies Used

*   **Frontend:** React, TypeScript, Vite
*   **Backend/Database:** Supabase
*   **Styling:** Tailwind CSS
*   **Frameworks:** Next.js (for `Instagram-reel-link` sub-project)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Git
*   A Supabase account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Vphisher.git
    cd Vphisher
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project and in the `Instagram-reel-link` directory.
    
    For the root `.env` (main admin dashboard):
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    
    For `Instagram-reel-link/.env`:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project credentials.

3.  **Install dependencies:**

    For the main project (admin dashboard):
    ```bash
    npm install
    # or yarn install
    ```

    For the Instagram reel link sub-project:
    ```bash
    cd Instagram-reel-link
    npm install
    # or yarn install
    cd ..
    ```

### Running the Application

1.  **Start the main admin dashboard:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    The admin dashboard will typically run on `http://localhost:5173` (or another port if 5173 is in use).

    **Example Deployed Dashboard:** [https://your-deployed-dashboard-url.com](https://your-deployed-dashboard-url.com)
    *(Remember to replace this with your actual deployed URL after deployment)*

2.  **Start the Instagram reel link phishing application:**
    ```bash
    cd Instagram-reel-link
    npm run dev
    # or yarn dev
    cd ..
    ```
    The phishing application will typically run on `http://localhost:3000`.

## How to Use

1.  **Access the Admin Dashboard:** Once the main application is running, navigate to `http://localhost:5173` (or your configured port) in your web browser.
2.  **Create a Campaign:** Use the dashboard to create a new phishing campaign. You'll be able to specify details for your simulated attack.
3.  **Generate Reel Link:** The dashboard will generate a unique Instagram reel link. This is the link you would share in a simulated social engineering scenario.
4.  **Monitor Activity:** The dashboard provides real-time monitoring of clicks and interactions with your generated links, allowing you to see how the simulated phishing attempt performs.
5.  **Analyze Data:** Review the collected data to understand user behavior and identify vulnerabilities.

## Usage

*   **Admin Dashboard:** Access the dashboard to create new phishing campaigns, generate unique reel links, and monitor collected data.
*   **Phishing Application:** Share the generated Instagram reel links. When a victim clicks the link, they will be redirected to a simulated Instagram login page.

## Contributing

Contributions are welcome! If you have suggestions for improvements, bug fixes, or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - developervinaytz@gmail.com
Project Link: [https://github.com/your-username/Vphisher](https://github.com/vinaytz/Vphisher)

Ultimately, your social skills are what really count :)
# Vphisher
