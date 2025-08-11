@echo off
echo Starting Scalops Microservices...
echo.

echo Starting Auth Service (Port 5000)...
start "Auth Service" cmd /k "cd server\auth-service && npm start"

echo Starting User Service (Port 5001)...
start "User Service" cmd /k "cd server\user-service && npm start"

echo Starting AWS Service (Port 5002)...
start "AWS Service" cmd /k "cd server\aws-service && npm start"

echo.
echo All services are starting...
echo.
echo Auth Service: http://localhost:5000
echo User Service: http://localhost:5001
echo AWS Service: http://localhost:5002
echo Client: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
