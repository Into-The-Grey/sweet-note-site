<?php
// save_message.php

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['message']) || trim($data['message']) === "") {
    http_response_code(400);
    echo "Invalid message.";
    exit;
}

$newMessage = trim($data['message']);

// Append the new message to message_history.txt
file_put_contents("message_history.txt", $newMessage . PHP_EOL, FILE_APPEND);

// Update the JSON file without overwriting existing messages
$jsonFile = "message.json";
if (file_exists($jsonFile)) {
    $jsonData = json_decode(file_get_contents($jsonFile), true);
    if (!isset($jsonData['messages']) || !is_array($jsonData['messages'])) {
        $jsonData['messages'] = [];
    }
    $jsonData['messages'][] = $newMessage;
    file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));
} else {
    // Create a new file if it doesn't exist
    $jsonData = ['messages' => [$newMessage]];
    file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));
}

echo "Message saved.";
?>
