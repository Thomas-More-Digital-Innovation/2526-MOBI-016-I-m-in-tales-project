use crate::nfc::{NfcError, NfcReader};
use libloading::{Library, Symbol};
use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use std::path::PathBuf;
use std::sync::Arc;

pub struct UfrReader {
    lib: Arc<Library>,
}

impl UfrReader {
    pub fn new() -> Result<Self, NfcError> {
        let lib_path = Self::get_lib_path()?;
        let lib = unsafe { Library::new(lib_path) }
            .map_err(|e| NfcError::Unknown(format!("Failed to load library: {}", e)))?;

        Ok(Self { lib: Arc::new(lib) })
    }

    fn get_lib_path() -> Result<PathBuf, NfcError> {
        let mut path = std::env::current_dir().map_err(|e| NfcError::Unknown(e.to_string()))?;
        // Go up to the root of the workspace if needed, or assume we are in src-tauri
        // Based on the project structure: I-m-in-tales/code/src-tauri
        // ufr-lib is at I-m-in-tales/code/ufr-lib

        #[cfg(target_os = "linux")]
        let lib_name = "ufr-lib/linux/x86_64/libuFCoder-x86_64.so";
        #[cfg(target_os = "windows")]
        let lib_name = "ufr-lib/windows/x86_64/uFCoder-x86_64.dll";
        #[cfg(target_os = "macos")]
        let lib_name = "ufr-lib/macos/x86_64/libuFCoder-x86_64.dylib";

        // Try relative to current dir (likely code/ or code/src-tauri)
        let mut full_path = path.clone().join(lib_name);
        if !full_path.exists() {
            // Try going up one level
            path.pop();
            full_path = path.join(lib_name);
        }

        if !full_path.exists() {
            return Err(NfcError::Unknown(format!(
                "Library not found at {:?}",
                full_path
            )));
        }

        Ok(full_path)
    }

    fn status_to_result(&self, status: u32) -> Result<(), NfcError> {
        match status {
            0x00 => Ok(()),
            0x08 => Err(NfcError::NoCardPresent),
            0x52 | 0x55 => Err(NfcError::DeviceNotFound),
            0x80 | 0x81 | 0x83 => Err(NfcError::InvalidNdefFormat),
            0x86 => Err(NfcError::NotInitialized),
            _ => Err(NfcError::Unknown(format!("uFR Error: 0x{:02X}", status))),
        }
    }
}

impl NfcReader for UfrReader {
    fn open(&self) -> Result<(), NfcError> {
        unsafe {
            let func: Symbol<unsafe extern "C" fn() -> u32> = self
                .lib
                .get(b"ReaderOpen")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;
            self.status_to_result(func())
        }
    }

    fn close(&self) -> Result<(), NfcError> {
        unsafe {
            let func: Symbol<unsafe extern "C" fn() -> u32> = self
                .lib
                .get(b"ReaderClose")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;
            self.status_to_result(func())
        }
    }

    fn read_ndef_text(&self) -> Result<String, NfcError> {
        unsafe {
            let read_text: Symbol<unsafe extern "C" fn(*mut c_char) -> u32> = self
                .lib
                .get(b"ReadNdefRecord_Text")
                .map_err(|e| NfcError::Unknown(e.to_string()))?;

            let mut buffer = [0i8; 1024];
            self.status_to_result(read_text(buffer.as_mut_ptr()))?;

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
            self.status_to_result(write_text(1, c_text.as_ptr()))
        }
    }
}
