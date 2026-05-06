use imintales::nfc::ufr::UfrReader; // Adjust 'app' to your package name
use imintales::nfc::NfcReader;

fn main() {
    let reader = UfrReader::new().expect("Failed to load library");

    println!("Opening reader...");
    reader.open().expect("Failed to open reader");

    println!("Reading tag...");
    match reader.read_ndef_text() {
        Ok(text) => println!("Read text: {}", text),
        Err(e) => println!("Error reading: {:?}", e),
    }

    reader.close().ok();
}
