pub mod nfc;

use crate::nfc::ufr::UfrReader;
use crate::nfc::{NfcError, NfcReader};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex, MutexGuard};
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager, State};

pub struct NfcManager {
    pub reader: Mutex<Option<Box<dyn NfcReader>>>,
    pub is_polling: Arc<AtomicBool>,
}

#[derive(serde::Serialize, Clone)]
struct NfcTagEvent {
    text: String,
}

#[derive(serde::Serialize, Clone)]
struct NfcStatusEvent {
    connected: bool,
    error: Option<String>,
}

#[tauri::command]
fn nfc_open(state: State<'_, NfcManager>) -> Result<(), String> {
    let mut reader_guard = state.reader.lock().map_err(|e| e.to_string())?;

    if reader_guard.is_none() {
        let reader = UfrReader::new().map_err(|e| e.to_string())?;
        *reader_guard = Some(Box::new(reader));
    }

    let reader = reader_guard.as_ref().unwrap();
    reader.open().map_err(|e| e.to_string())
}

#[tauri::command]
fn nfc_close(state: State<'_, NfcManager>) -> Result<(), String> {
    state.is_polling.store(false, Ordering::SeqCst);
    let reader_guard = state.reader.lock().map_err(|e| e.to_string())?;
    if let Some(reader) = reader_guard.as_ref() {
        reader.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn nfc_read(state: State<'_, NfcManager>) -> Result<String, String> {
    let reader_guard = state.reader.lock().map_err(|e| e.to_string())?;
    let reader = reader_guard.as_ref().ok_or("Reader not initialized")?;
    reader.read_ndef_text().map_err(|e| e.to_string())
}

#[tauri::command]
fn nfc_write(state: State<'_, NfcManager>, text: String) -> Result<(), String> {
    let reader_guard = state.reader.lock().map_err(|e| e.to_string())?;
    let reader = reader_guard.as_ref().ok_or("Reader not initialized")?;
    reader.write_ndef_text(&text).map_err(|e| e.to_string())
}

#[tauri::command]
fn nfc_start_polling(app_handle: AppHandle, state: State<'_, NfcManager>) -> Result<(), String> {
    if state.is_polling.load(Ordering::SeqCst) {
        return Ok(());
    }

    state.is_polling.store(true, Ordering::SeqCst);
    let is_polling = state.is_polling.clone();

    std::thread::spawn(move || {
        let mut last_text = String::new();

        while is_polling.load(Ordering::SeqCst) {
            let state: State<'_, NfcManager> = app_handle.state::<NfcManager>();
            
            let mut reader_guard: MutexGuard<'_, Option<Box<dyn NfcReader>>> = match state.reader.lock() {
                Ok(guard) => guard,
                Err(_) => break,
            };

            if reader_guard.is_none() {
                match UfrReader::new() {
                    Ok(reader) => {
                        match reader.open() {
                            Ok(_) => {
                                *reader_guard = Some(Box::new(reader));
                                app_handle.emit("nfc://status", NfcStatusEvent { connected: true, error: None }).ok();
                            }
                            Err(e) => {
                                app_handle.emit("nfc://status", NfcStatusEvent { connected: false, error: Some(e.to_string()) }).ok();
                            }
                        }
                    }
                    Err(e) => {
                        app_handle.emit("nfc://status", NfcStatusEvent { connected: false, error: Some(e.to_string()) }).ok();
                    }
                }
            }

            // 2. Perform read if reader is available
            if let Some(reader) = reader_guard.as_ref() {
                match reader.read_ndef_text() {
                    Ok(text) => {
                        if text != last_text {
                            app_handle
                                .emit("nfc://tag", NfcTagEvent { text: text.clone() })
                                .ok();
                            last_text = text;
                        }
                        app_handle.emit("nfc://status", NfcStatusEvent { connected: true, error: None }).ok();
                    }
                    Err(NfcError::NoCardPresent) => {
                        if !last_text.is_empty() {
                            app_handle.emit("nfc://tag-lost", ()).ok();
                            last_text = String::new();
                        }
                        app_handle.emit("nfc://status", NfcStatusEvent { connected: true, error: None }).ok();
                    }
                    Err(NfcError::DeviceNotFound) | Err(NfcError::CommunicationError(_)) => {
                        // Device lost! Reset reader for re-init on next loop
                        *reader_guard = None;
                        app_handle.emit("nfc://status", NfcStatusEvent { connected: false, error: Some("Device disconnected".to_string()) }).ok();
                        last_text = String::new();
                    }
                    Err(e) => {
                        app_handle
                            .emit(
                                "nfc://status",
                                NfcStatusEvent {
                                    connected: true,
                                    error: Some(e.to_string()),
                                },
                            )
                            .ok();
                    }
                }
            }

            drop(reader_guard);
            std::thread::sleep(Duration::from_millis(200));
        }
    });

    Ok(())
}

#[tauri::command]
fn nfc_stop_polling(state: State<'_, NfcManager>) -> Result<(), String> {
    state.is_polling.store(false, Ordering::SeqCst);
    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .manage(NfcManager {
            reader: Mutex::new(None),
            is_polling: Arc::new(AtomicBool::new(false)),
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            nfc_open,
            nfc_close,
            nfc_read,
            nfc_write,
            nfc_start_polling,
            nfc_stop_polling
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
