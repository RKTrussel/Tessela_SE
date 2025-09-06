<?php
return [
    // which mode to run: mock | stripe | paymongo etc.
    'mode' => env('PAYMENTS_MODE', 'mock'),
];