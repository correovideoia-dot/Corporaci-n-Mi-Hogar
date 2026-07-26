$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'href="#">Inicio', 'href="index.html">Inicio'
    $content = $content -replace 'href="#">Servicios', 'href="servicios.html">Servicios'
    $content = $content -replace 'href="#">Proyectos', 'href="proyectos.html">Proyectos'
    $content = $content -replace 'href="#">Galería', 'href="galeria.html">Galería'
    $content = $content -replace 'href="#">Nosotros', 'href="nosotros.html">Nosotros'
    $content = $content -replace 'href="#">Contacto', 'href="contacto.html">Contacto'
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
