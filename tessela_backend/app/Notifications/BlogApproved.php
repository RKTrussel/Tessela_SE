<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BlogApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $blog;

    public function __construct($blog)
    {
        $this->blog = $blog;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Your Blog Has Been Approved 🎉')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Good news! Your blog titled "' . $this->blog->title . '" has been approved and published.')
            ->line('Thanks for contributing to our community!');
    }
}
