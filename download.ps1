$urls = @{
    "proyectos.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I4OWE5OTFhN2EzNzQyNjk4ZjY1MGI0ZTQ1MDY0NTU0EgsSBxD9yOHkxRIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzM3Mzk3MjkyNjAxMDU3NjcxNQ&filename=&opi=89354086"
    "nosotros.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y2MWI0ZjRmZTBjYzQ1NTI5YWFmNTg5ZWVlMmFhY2YyEgsSBxD9yOHkxRIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzM3Mzk3MjkyNjAxMDU3NjcxNQ&filename=&opi=89354086"
    "galeria.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzUzMjgxMzQ4MDM3YzQxNmRiN2VmYWI5OWM4NGQ3MzUzEgsSBxD9yOHkxRIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzM3Mzk3MjkyNjAxMDU3NjcxNQ&filename=&opi=89354086"
    "contacto.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVmMjdhYjU4Zjg4NjQ0ZjNhMmQ2NzVmYTFlMTZkZWZhEgsSBxD9yOHkxRIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzM3Mzk3MjkyNjAxMDU3NjcxNQ&filename=&opi=89354086"
    "servicios.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzExOGNiZDlmMTk4MzRjZjJiMjVkNGNlNGEyZTQ1MTVkEgsSBxD9yOHkxRIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzM3Mzk3MjkyNjAxMDU3NjcxNQ&filename=&opi=89354086"
    "index.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VmYTc2NTA3OTM2MzQ5ZmRiZDRmMmIxZGMzNjk1ZGE1EgsSBxD9yOHkxRIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzM3Mzk3MjkyNjAxMDU3NjcxNQ&filename=&opi=89354086"
}

foreach ($key in $urls.Keys) {
    Invoke-WebRequest -Uri $urls[$key] -OutFile $key
}
