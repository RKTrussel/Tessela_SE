<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BlogRejected extends Notification implements ShouldQueue
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
            ->subject('Your Blog Submission Was Rejected ❌')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('We regret to inform you that your blog titled "' . $this->blog->title . '" was rejected by our moderators.')
            ->line('You may revise and submit it again.')
            ->line('Thank you for your contribution.');
    }
}