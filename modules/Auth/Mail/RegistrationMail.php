<?php

namespace Modules\Auth\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationMail extends Mailable {
    use Queueable, SerializesModels;
    private $data;
    /**
     * Create a new message instance.
     */
    public function __construct($data) {
        $this->data = $data;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope {
        return new Envelope(subject: 'Thank you for registration',);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content {
        return new Content(view: 'mails.registration', with: ['body' => $this->data]);
    }
}
