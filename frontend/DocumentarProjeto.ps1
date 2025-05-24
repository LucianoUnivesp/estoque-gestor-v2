<# : Batch script
@echo off
setlocal
PowerShell -ExecutionPolicy Bypass -Command "Invoke-Expression $([String]::Join([Environment]::NewLine, (Get-Content '%~f0')))"
pause
goto :EOF
#>

# PowerShell script starts here
# Define directories to exclude
$excludedDirectories = @(
    "node_modules",
    ".next",
    "build",
    "dist",
    "bin",
    "obj",
    ".git",
    ".vs",
    ".vscode",
    "packages",
    "vendor",
    "coverage"
)

# Define output file paths
$outputFileNormal = ".\project_documentation.txt"
$outputFileMinified = ".\project_documentation_minified.txt"

# Create or clear the output files
"# Project Documentation" | Out-File -FilePath $outputFileNormal
"# Generated on $(Get-Date)" | Out-File -FilePath $outputFileNormal -Append
"" | Out-File -FilePath $outputFileNormal -Append

"#Project Documentation - Minified Version (Generated on $(Get-Date))" | Out-File -FilePath $outputFileMinified

# Get all files recursively, excluding specified directories
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $file = $_
    $excluded = $false
    foreach ($dir in $excludedDirectories) {
        if ($file.FullName -like "*\$dir\*") {
            $excluded = $true
            break
        }
    }
    -not $excluded
}

# Process each file
foreach ($file in $files) {
    # Skip the output files themselves to avoid infinite growth
    if ($file.FullName -eq (Resolve-Path $outputFileNormal).Path -or 
        $file.FullName -eq (Resolve-Path $outputFileMinified).Path) {
        continue
    }
    
    $relativeFilePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
    
    # --- Normal version processing ---
    "------------------------------------------------------------------------------" | Out-File -FilePath $outputFileNormal -Append
    "# File: $relativeFilePath" | Out-File -FilePath $outputFileNormal -Append
    "------------------------------------------------------------------------------" | Out-File -FilePath $outputFileNormal -Append
    "" | Out-File -FilePath $outputFileNormal -Append
    
    # --- Minified version processing ---
    "`n###FILE:$relativeFilePath" | Out-File -FilePath $outputFileMinified -Append
    
    # Try to read the file content
    try {
        # Read file content
        $content = Get-Content -Path $file.FullName -Raw
        
        # Write to normal version with full formatting
        $content | Out-File -FilePath $outputFileNormal -Append
        "" | Out-File -FilePath $outputFileNormal -Append
        
        # Write to minified version without extra spaces/newlines
        # Here we're removing extra blank lines and condensing multiple spaces
        $minifiedContent = $content -replace '(?m)^\s*$\n', '' -replace '\s{2,}', ' '
        $minifiedContent | Out-File -FilePath $outputFileMinified -Append
    }
    catch {
        $errorMessage = "Error reading file: $_"
        $errorMessage | Out-File -FilePath $outputFileNormal -Append
        "" | Out-File -FilePath $outputFileNormal -Append
        $errorMessage | Out-File -FilePath $outputFileMinified -Append
    }
}

Write-Host "Documentation has been generated in two formats:"
Write-Host "Normal version: $outputFileNormal"
Write-Host "Minified version: $outputFileMinified"
