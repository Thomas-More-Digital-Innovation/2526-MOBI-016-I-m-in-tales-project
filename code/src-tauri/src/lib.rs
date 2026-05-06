pub mod nfc;

use std::sync::Mutex;
use crate::nfc::NfcReader;
use crate::nfc::ufr::UfrReader;

pub struct NfcManager {
    pub reader: Mutex<Option<Box<dyn NfcReader>>>,
}

#[tauri::command]
fn nfc_open(state: tauri::State<'_, NfcManager>) -> Result<(), String> {
    let mut reader_guard = state.reader.lock().map_err(|e| e.to_string())?;
    
    if reader_guard.is_none() {
        let reader = UfrReader::new().map_err(|e| e.to_string())?;
        *reader_guard = Some(Box::new(reader));
    }

    let reader = reader_guard.as_ref().unwrap();
    reader.open().map_err(|e| e.to_string())
}

#[tauri::command]
fn nfc_close(state: tauri::State<'_, NfcManager>) -> Result<(), String> {
    let reader_guard = state.reader.lock().map_err(|e| e.to_string())?;
    if let Some(reader) = reader_guard.as_ref() {
        reader.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn nfc_read(state: tauri::State<'_, NfcManager>) -> Result<String, String> {
    let reader_guard = state.reader.lock().map_err(|e| e.to_string())?;
    let reader = reader_guard.as_ref().ok_or("Reader not initialized")?;
    reader.read_ndef_text().map_err(|e| e.to_string())
}

#[tauri::command]
fn nfc_write(state: tauri::State<'_, NfcManager>, text: String) -> Result<(), String> {
    let reader_guard = state.reader.lock().map_err(|e| e.to_string())?;
    let reader = reader_guard.as_ref().ok_or("Reader not initialized")?;
    reader.write_ndef_text(&text).map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .manage(NfcManager {
            reader: Mutex::new(None),
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            nfc_open,
            nfc_close,
            nfc_read,
            nfc_write
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
