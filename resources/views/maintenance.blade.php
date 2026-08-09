<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Under Maintenance - The Deuce Club</title>
    <link href="https://fonts.googleapis.com/css2?family=42dot+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #0b100e;
            color: #dfd6c5;
            font-family: '42dot Sans', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }
        .container {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }
        h2 {
            font-size: 1.25rem;
            opacity: 0.7;
            font-weight: 400;
            margin-bottom: 2.5rem;
            letter-spacing: 0.05em;
        }
        img {
            width: 150px;
            height: auto;
            opacity: 0.9;
        }
        .login-btn {
            margin-top: 3rem;
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border: 1px solid rgba(223, 214, 197, 0.3);
            color: rgba(223, 214, 197, 0.7);
            text-decoration: none;
            border-radius: 9999px;
            font-size: 0.875rem;
            transition: all 0.3s;
        }
        .login-btn:hover {
            background-color: rgba(223, 214, 197, 0.1);
            color: #dfd6c5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>UNDER MAINTENANCE</h1>
        <h2>thedeuceclub</h2>
        
        <img src="/img/full_logo.png" alt="The Deuce Club Logo">
        
        <a href="/login" class="login-btn">Admin Login</a>
    </div>
</body>
</html>
