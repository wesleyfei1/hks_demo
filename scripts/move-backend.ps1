# Move OTHER-BACKGROUND into background (safe, preserves binary files)
# Run this in PowerShell from the repository root (e:\A\大二上\HKS)

$src = Join-Path $PWD 'OTHER-BACKGROUND'
$dest = Join-Path $PWD 'background'

if (-Not (Test-Path $src)) {
    Write-Error "Source folder 'OTHER-BACKGROUND' not found: $src"
    exit 1
}

if (-Not (Test-Path $dest)) {
    # If destination doesn't exist, just rename/move the folder
    Move-Item -Path $src -Destination $dest -Force
    Write-Host "Moved $src -> $dest"
} else {
    # Destination exists: move contents into dest, overwriting if needed
    Get-ChildItem -Path $src -Force | ForEach-Object {
        $target = Join-Path $dest $_.Name
        if (Test-Path $target) {
            # if target exists and is a file, overwrite; if directory, merge
            if ($_.PSIsContainer) {
                # copy directory recursively
                robocopy $_.FullName $target /MIR | Out-Null
            } else {
                Copy-Item -Path $_.FullName -Destination $target -Force
            }
        } else {
            Move-Item -Path $_.FullName -Destination $target
        }
    }
    # After moving contents, remove the (now empty) source folder
    Remove-Item -Path $src -Recurse -Force
    Write-Host "Merged contents of $src -> $dest and removed source"
}

Write-Host "Done. Please verify background/ contains the backend project (including generated_images)."