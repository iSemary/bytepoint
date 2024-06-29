<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Api\Entities\Header;

class HeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedHeaders();
    }

    private function seedHeaders()
    {
        $headers = [
            ['title' => 'Accept', 'description' => 'Indicates which content types the client is able to understand'],
            ['title' => 'Accept-Charset', 'description' => 'Indicates which character encodings the client understands'],
            ['title' => 'Accept-Encoding', 'description' => 'What content-encodings the client is able to understand'],
            ['title' => 'Accept-Language', 'description' => 'Preferred languages for the response'],
            ['title' => 'Authorization', 'description' => 'Contains the credentials to authenticate a user agent with a server'],
            ['title' => 'Cache-Control', 'description' => 'Directives for caching mechanisms in both requests and responses'],
            ['title' => 'Connection', 'description' => 'Control options for the current connection'],
            ['title' => 'Content-Length', 'description' => 'The length of the request body in octets (8-bit bytes)'],
            ['title' => 'Content-Type', 'description' => 'Indicates the media type of the resource'],
            ['title' => 'Cookie', 'description' => 'An HTTP cookie previously sent by the server with Set-Cookie'],
            ['title' => 'Date', 'description' => 'The date and time at which the message was originated'],
            ['title' => 'Expect', 'description' => 'Indicates expectations that need to be met by the server to handle the request'],
            ['title' => 'Forwarded', 'description' => 'Disclose original information of a client connecting to a web server through an HTTP proxy'],
            ['title' => 'From', 'description' => 'The email address of the user making the request'],
            ['title' => 'Host', 'description' => 'Specifies the host and port number of the server to which the request is being sent'],
            ['title' => 'If-Match', 'description' => 'Only perform the action if the client supplied entity matches the same entity on the server'],
            ['title' => 'If-Modified-Since', 'description' => 'Allows a 304 Not Modified to be returned if content is unchanged'],
            ['title' => 'If-None-Match', 'description' => 'Allows a 304 Not Modified to be returned if content is unchanged'],
            ['title' => 'If-Range', 'description' => 'If the entity is unchanged, send me the part(s) that I am missing; otherwise, send me the entire new entity'],
            ['title' => 'If-Unmodified-Since', 'description' => 'Only send the response if the entity has not been modified since a specific time'],
            ['title' => 'Max-Forwards', 'description' => 'Limit the number of times the message can be forwarded through proxies or gateways'],
            ['title' => 'Origin', 'description' => 'Indicates where a fetch originates from'],
            ['title' => 'Pragma', 'description' => 'Implementation-specific headers that may have various effects anywhere along the request-response chain'],
            ['title' => 'Proxy-Authorization', 'description' => 'Authorization credentials for connecting to a proxy'],
            ['title' => 'Range', 'description' => 'Request only part of an entity. Bytes are numbered from 0'],
            ['title' => 'Referer', 'description' => 'The address of the previous web page from which a link to the currently requested page was followed'],
            ['title' => 'TE', 'description' => 'Describes the transfer encodings the user agent is willing to accept'],
            ['title' => 'Upgrade', 'description' => 'Ask the server to upgrade to another protocol'],
            ['title' => 'User-Agent', 'description' => 'Contains a characteristic string that allows the network protocol peers to identify the application type, operating system, software vendor, or software version of the requesting software user agent'],
            ['title' => 'Via', 'description' => 'Informs the server of proxies through which the request was sent'],
            ['title' => 'Warning', 'description' => 'A general warning about possible problems with the entity body'],
        ];

        foreach ($headers as $header) {
            Header::updateOrCreate(
                ['title' => $header['title']],
                $header
            );
        }
    }
}
