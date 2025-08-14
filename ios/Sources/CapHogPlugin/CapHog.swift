import Foundation

@objc public class CapHog: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
