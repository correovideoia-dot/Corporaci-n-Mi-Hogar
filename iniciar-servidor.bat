@echo off
title Corporacion Mi Hogar - Servidor Web
cd /d "%~dp0"
echo ===========================================
echo  Corporacion Mi Hogar - Servidor Local
echo ===========================================
echo.
echo  Abriendo navegador en http://localhost:4173
echo  Cierra esta ventana para detener el servidor
echo.
start "" http://localhost:4173
node server.js
pause
