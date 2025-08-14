// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CaphogSdk",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CaphogSdk",
            targets: ["CapHogPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "CapHogPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CapHogPlugin"),
        .testTarget(
            name: "CapHogPluginTests",
            dependencies: ["CapHogPlugin"],
            path: "ios/Tests/CapHogPluginTests")
    ]
)