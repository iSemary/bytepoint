# BytePoint CloudAPI

BytePoint CloudAPI is a comprehensive solution for cloud hosting, offering a range of powerful features to streamline your development process. With custom endpoints URLs, you can tailor your API to fit your specific needs seamlessly.

-   [About](#about)
-   [Preview](#preview)
-   [Features](#features)
-   [Get Started](#get-started)
    -   [Postman Collection](#postman-collection)
    -   [Installation](#installation)
-   [Contact](#contact)

## About

BytePoint CloudAPI is a comprehensive solution for cloud hosting, offering a range of powerful features to streamline your development process. With custom endpoints URLs, you can tailor your API to fit your specific needs seamlessly.

## Postman Collection

[Open With Postman](https://www.postman.com/petitfour/workspace/bytepoint)


## Figma Snap Shots

[Open With Figma](https://www.figma.com/design/8A4uOB1LCVCABODcEsNk1f/BytePoint)


## Installation

1. **Install Composer Dependencies**

    ```sh
    composer install
    ```

2. **Copy Environment File**

    ```sh
    cp .env.example .env
    ```

3. **Run Migrations**

    ```sh
    php artisan migrate --path=database/migrations/landlord --database=landlord
    php artisan migrate --path=modules/*/Database/Migrations/landlord --database=landlord
    ```

4. **Seed the Database**

    ```sh
    php artisan db:seed
    ```

5. **Generate Passport Keys**

    ```sh
    php artisan passport:keys
    ```

7. **Link storage folder to public**

    ```
    php artisan storage:link
    ```

8. **Install react Dependencies**

    ```sh
    npm install
    ```

## Contact

For any inquiries or support, please email me at [abdelrahmansamirmostafa@gmail.com](mailto:abdelrahmansamirmostafa@gmail.com) or visit my website at [abdelrahman.online](https://www.abdelrahman.online/).
