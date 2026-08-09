<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InAppNotification extends Notification
{
    use Queueable;

    public $title;
    public $message;
    public $type;
    public $meta;

    public function __construct($title, $message, $type, $meta = [])
    {
        $this->title = $title;
        $this->message = $message;
        $this->type = $type;
        $this->meta = $meta;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'meta' => $this->meta,
        ];
    }
}
