@echo off
title Deploy NetCast AI to Vercel
color 0B
echo.
echo  ========================================================
echo     NetCast AI - Deploying to the Internet via Vercel
echo  ========================================================
echo.
echo  NOTE: If this asks you to log in, just follow the prompts
echo  and log in with the account you just created.
echo.

cd /d C:\NetCast-AI\netcast-ai

echo  Starting Vercel Deployment...
npx vercel --prod

echo.
echo  Process complete! Check the URL above to see your live website.
pause
