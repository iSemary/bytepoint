# BytePoint: Text to API

## Table of Contents

-   [About](#about)
-   [Preview](#preview)
-   [Snapshots](#figma-snapshots)
-   [Features](#features)
-   [Get Started](#get-started)
    -   [Postman Collection](#postman-collection)
    -   [Installation](#installation)
-   [Contact](#contact)

## About

BytePoint is a powerful "Text to API" project built using Laravel and ReactJS, with a touch of Llama 3 magic. It's designed to streamline the process of creating APIs, making it possible to generate a full RESTful API in seconds.

## Preview

BytePoint offers two primary modes:

1. **Copilot Mode**: Assists in building a full RESTful API from scratch to production level. Just describe your use case in a few sentences, and the API is prepared automatically with It's dataset.

2. **Manual Mode**: Allows full control to initiate, import, or fake the dataset for your API, and customize each detail of the API components.

## Figma Snapshots

For a visual preview of the project, check out our Figma designs:
[Open With Figma](https://www.figma.com/design/8A4uOB1LCVCABODcEsNk1f/BytePoint)

<img alt="snapshot" src="https://i.ibb.co/0ryX35C/Screenshot-from-2024-08-01-13-26-40.png" />

## Features

-   Text to API conversion
-   Data Repositories
-   CRUD Operations API
-   API Mockups
-   Pre-prepared API Templates
-   Integrated Cloud Services
-   Built-in API Testing
-   Postman Collection Exports
-   Key Management for Authorization
-   Detailed Logs

### Technologies Used:

-   Backend: PHP, Laravel
-   Databases: MySQL, MongoDB
-   Cloud Services: AWS
-   Frontend: ReactJS, InertiaJS, Material UI
-   AI Integration: Llama 3.1

### Architecture and Design Patterns:

-   HMVC (Hierarchical Model-View-Controller)
-   Multi-tenancy Database
-   SOLID Principles

## Get Started

### Postman Collection

To explore the API endpoints, use our Postman collection:
[Open With Postman](https://www.postman.com/petitfour/workspace/bytepoint)

### Installation

1. Clone the repository:

    ```
    git clone https://github.com/iSemary/bytepoint.git
    ```

2. Install Composer dependencies:

    ```
    composer install
    ```

3. Copy the environment file:

    ```
    cp .env.example .env
    ```

4. Run migrations:

    ```
    php artisan migrate --path=database/migrations/landlord --database=landlord
    php artisan migrate --path=modules/*/Database/Migrations/landlord --database=landlord
    ```

5. Seed the database:

    ```
    php artisan db:seed
    ```

6. Generate Passport keys:

    ```
    php artisan passport:keys
    ```

7. Link storage folder to public:

    ```
    php artisan storage:link
    ```

8. Install React dependencies:
    ```
    npm install
    ```

## Contact

For inquiries or support, please contact:

-   Email: [abdelrahmansamirmostafa@gmail.com](mailto:abdelrahmansamirmostafa@gmail.com)
-   Website: [abdelrahman.online](https://www.abdelrahman.online/)
