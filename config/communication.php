<?php

return [
    'queue' => [
        'connection' => env('COMMUNICATION_QUEUE_CONNECTION', env('QUEUE_CONNECTION', 'redis')),
        'name' => env('COMMUNICATION_QUEUE_NAME', 'communication'),
    ],

    'bulk' => [
        'chunk_size' => (int) env('COMMUNICATION_BULK_CHUNK', 500),
        'max_recipients' => (int) env('COMMUNICATION_BULK_MAX_RECIPIENTS', 10000),
    ],

    'rate_limits' => [
        'send_per_minute' => (int) env('COMMUNICATION_SEND_PER_MINUTE', 60),
    ],
];
