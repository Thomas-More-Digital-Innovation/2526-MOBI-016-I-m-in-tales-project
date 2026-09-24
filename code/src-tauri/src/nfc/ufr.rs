use crate::nfc::{NfcError, NfcReader};
use libloading::{Library, Symbol};
use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use std::path::PathBuf;
use std::sync::Arc;

use tauri::{AppHandle, Manager};

pub struct UfrReader {
    lib: Arc<Library>,
}

impl Drop for UfrReader {
    fn drop(&mut self) {
        let _ = self.close();
    }
}

impl UfrReader {
    pub fn new() -> Result<Self, NfcError> {
        Self::with_app_handle_opt(None)
    }

    pub fn with_app_handle(app_handle: &AppHandle) -> Result<Self, NfcError> {
        Self::with_app_handle_opt(Some(app_handle))
    }

    fn with_app_handle_opt(app_handle: Option<&AppHandle>) -> Result<Self, NfcError> {
        let lib_path = Self::get_lib_path(app_handle)?;
        let lib = unsafe { Library::new(&lib_path) }
            .map_err(|e| NfcError::Unknown(format!("Failed to load library at {:?}: {}", lib_path, e)))?;

        Ok(Self { lib: Arc::new(lib) })
    }

    fn candidate_names() -> &'static [&'static str] {
        #[cfg(target_os = "windows")]
        {
            #[cfg(target_arch = "x86_64")]
            return &[
                "ufr-lib/windows/x86_64/uFCoder-x86_64.dll",
                "uFCoder-x86_64.dll",
            ];
            #[cfg(target_arch = "aarch64")]
            return &[
                "ufr-lib/windows/aarch64/uFCoder-aarch64.dll",
                "uFCoder-aarch64.dll",
            ];
            #[cfg(target_arch = "x86")]
            return &[
                "ufr-lib/windows/x86/uFCoder-x86.dll",
                "uFCoder-x86.dll",
            ];
        }

        #[cfg(target_os = "linux")]
        {
            #[cfg(target_arch = "x86_64")]
            return &[
                "ufr-lib/linux/x86_64/libuFCoder-x86_64.so",
                "libuFCoder-x86_64.so",
                "libuFCoder.so",
            ];
            #[cfg(target_arch = "aarch64")]
            return &[
                "ufr-lib/linux/aarch64/libuFCoder-aarch64.so",
                "libuFCoder-aarch64.so",
                "libuFCoder.so",
            ];
            #[cfg(target_arch = "arm")]
            return &[
                "ufr-lib/linux/arm-hf/libuFCoder-armhf.so",
                "libuFCoder-armhf.so",
                "libuFCoder.so",
            ];
            #[cfg(not(any(target_arch = "x86_64", target_arch = "aarch64", target_arch = "arm")))]
            return &[
                "ufr-lib/linux/x86_64/libuFCoder-x86_64.so",
                "libuFCoder-x86_64.so",
                "libuFCoder.so",
            ];
        }

        #[cfg(target_os = "macos")]
        {
            return &[
                "ufr-lib/macos/universal/libuFCoder-macos.dylib",
                "ufr-lib/macos/x86_64/libuFCoder-x86_64.dylib",
                "libuFCoder-macos.dylib",
                "libuFCoder-x86_64.dylib",
                "libuFCoder.dylib",
            ];
        }

        #[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
        return &[];
    }

    fn get_lib_path(app_handle: Option<&AppHandle>) -> Result<PathBuf, NfcError> {
        let names = Self::candidate_names();

        if let Some(handle) = app_handle {
            for &name in names {
                if let Ok(resolved) = handle.path().resolve(name, tauri::path::BaseDirectory::Resource) {
                    if resolved.exists() {
                        return Ok(resolved);
                    }
                }
            }

            if let Ok(res_dir) = handle.path().resource_dir() {
                for &name in names {
                    let direct = res_dir.join(name);
                    if direct.exists() {
                        return Ok(direct);
                    }
                    let sub = res_dir.join("resources").join(name);
                    if sub.exists() {
                        return Ok(sub);
                    }
                }
            }
        }

        let mut bases: Vec<PathBuf> = Vec::new();

        if let Ok(exe_path) = std::env::current_exe() {
            if let Some(exe_dir) = exe_path.parent() {
                bases.push(exe_dir.to_path_buf());
                bases.push(exe_dir.join("resources"));
                #[cfg(target_os = "macos")]
                bases.push(exe_dir.join("../Resources"));
                #[cfg(target_os = "linux")]
                {
                    bases.push(exe_dir.join("../lib"));
                    bases.push(exe_dir.join("../share"));
                }
            }
        }

        if let Ok(cwd) = std::env::current_dir() {
            bases.push(cwd.clone());
            bases.push(cwd.join("resources"));
            bases.push(cwd.join("code"));
            let mut current = cwd.parent();
            while let Some(parent) = current {
                bases.push(parent.to_path_buf());
                bases.push(parent.join("code"));
                current = parent.parent();
            }
        }

        for base in &bases {
            for &name in names {
                let candidate = base.join(name);
                if candidate.exists() {
                    return Ok(candidate);
                }
            }
        }

        for &name in names {
            let bare = PathBuf::from(name);
            if unsafe { Library::new(&bare) }.is_ok() {
                return Ok(bare);
            }
        }

        Err(NfcError::Unknown(format!(
            "uFR NFC library not found. Searched candidates {:?} in {:?}",
            names, bases
        )))
    }
}

impl NfcReader for UfrReader {
    fn open(&self) -> Result<(), NfcError> {
        unsafe {
            let func: Symbol<unsafe extern "C" fn() -> u32> = self
                .lib
                .get(b"ReaderOpen")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;
            crate::nfc::handler::translate_ufr_status(func())
        }
    }

    fn close(&self) -> Result<(), NfcError> {
        unsafe {
            let func: Symbol<unsafe extern "C" fn() -> u32> = self
                .lib
                .get(b"ReaderClose")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;
            crate::nfc::handler::translate_ufr_status(func())
        }
    }

    fn read_ndef_text(&self) -> Result<String, NfcError> {
        unsafe {
            let read_text: Symbol<unsafe extern "C" fn(*mut c_char) -> u32> = self
                .lib
                .get(b"ReadNdefRecord_Text")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;

            let mut buffer = [0i8; 1024];
            crate::nfc::handler::translate_ufr_status(read_text(buffer.as_mut_ptr()))?;

            let c_str = CStr::from_ptr(buffer.as_ptr());
            Ok(c_str.to_string_lossy().into_owned())
        }
    }

    fn write_ndef_text(&self, text: &str) -> Result<(), NfcError> {
        unsafe {
            let write_text: Symbol<unsafe extern "C" fn(u8, *const c_char) -> u32> = self
                .lib
                .get(b"WriteNdefRecord_Text")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;

            let c_text = CString::new(text).map_err(|e| NfcError::Unknown(e.to_string()))?;
            // 1 for NDEF storage (internal memory)
            crate::nfc::handler::translate_ufr_status(write_text(1, c_text.as_ptr()))
        }
    }

    fn get_tag_uid(&self) -> Result<String, NfcError> {
        unsafe {
            let get_uid: Symbol<unsafe extern "C" fn(*mut u8, *mut u8, *mut u8) -> u32> = self
                .lib
                .get(b"GetCardIdEx")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;

            let mut sak = 0u8;
            let mut uid = [0u8; 10];
            let mut uid_size = 0u8;

            crate::nfc::handler::translate_ufr_status(get_uid(&mut sak, uid.as_mut_ptr(), &mut uid_size))?;

            let uid_hex = uid[..uid_size as usize]
                .iter()
                .map(|b| format!("{:02X}", b))
                .collect::<Vec<String>>()
                .join(":");
            
            Ok(uid_hex)
        }
    }
}
