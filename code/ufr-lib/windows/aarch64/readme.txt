Install MSYS2 for x86_64 from: https://www.msys2.org/
to obtain ARM64 toolchain. (necessary to compile from x86_64 PC for ARM64)

-> Open `msys2.exe`, (path should be: “C:\msys64\msys2.exe”)
-> Update the package manager (pacman): `pacman -Syu`
-> Install the ARM64 toolchain: `pacman -S mingw-w64-aarch64-toolchain`
-> This installs:
    mingw-w64-aarch64-gcc (GCC compiler for ARM64)
    mingw-w64-aarch64-binutils (linker, assembler, etc.)
    mingw-w64-aarch64-headers (Windows API headers)
    mingw-w64-aarch64-crt (C runtime for ARM64)
-> Verify installation, from MSYS2 shell: “aarch64-w64-mingw32-gcc --version”

Linking:
- Simply name the linker search patch to library and header file directories, e.g
` aarch64-w64-mingw32-gcc -O3 -D__USE_MINGW_ANSI_STDIO -Iufr-lib/include -Lufr-lib/windows/aarch64 -luFCoder-aarch64 *.c -o ufr.exe