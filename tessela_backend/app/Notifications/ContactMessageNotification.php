<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('📩 New Contact Message from ' . $this->data['name'])
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('You have received a new message through the contact form.')
            ->line('**Sender Name:** ' . $this->data['name'])
            ->line('**Sender Email:** ' . $this->data['email'])
            ->line('**Message:**')
            ->line($this->data['message'])
            ->line('---')
            ->line('Sent from the About Page of your Indigenous Weaving Platform.');
    }
}