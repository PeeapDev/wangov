<?php
session_start();

// Clear all session data
session_destroy();

// Redirect back to main page
header('Location: index.php');
exit;
?>
