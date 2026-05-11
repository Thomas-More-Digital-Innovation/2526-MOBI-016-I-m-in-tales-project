// swift-tools-version:5.6
import PackageDescription

let package = Package(
    name: "uFCoder",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "uFCoder",
            targets: ["uFCoder"]
        ),
    ],
    targets: [
        .binaryTarget(
            name: "uFCoder",
            path: "./ios_framework/uFCoder.xcframework"
        ),
    ]
)
