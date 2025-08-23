import Foundation


@objc public class CapHog: NSObject {
    private var projectId: String? = nil

    @objc public func initialize(projectId: String, completion: @escaping (Error?) -> Void) {
        self.projectId = projectId
        completion(nil)
    }

    @objc public func logEvent(eventName: String, payload: [String: Any]?, completion: @escaping (Error?) -> Void) {
        guard let projectId = self.projectId else {
            completion(NSError(domain: "CapHog", code: 2, userInfo: [NSLocalizedDescriptionKey: "CapHog not initialized. Call initialize() with projectId first."]))
            return
        }
        let url = URL(string: "https://caphog.com/api/v1/event-entries")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var systemInfo = utsname()
        uname(&systemInfo)
        let modelIdentifier = withUnsafePointer(to: &systemInfo.machine) {
            $0.withMemoryRebound(to: CChar.self, capacity: 1) {
                String(validatingUTF8: $0) ?? "unknown"
            }
        }
        let device: [String: Any] = [
            "operatingSystem": "ios",
            "operatingSystemVersion": UIDevice.current.systemVersion,
            "phoneModel": modelIdentifier
        ]

        let infoDict = Bundle.main.infoDictionary
        let versionName = infoDict?["CFBundleShortVersionString"] as? String
        let versionCode = infoDict?["CFBundleVersion"] as? String
        let packageName = Bundle.main.bundleIdentifier
        let app: [String: Any?] = [
            "versionCode": versionCode,
            "versionName": versionName,
            "packageName": packageName
        ]
        let body: [String: Any] = [
            "eventName": eventName,
            "projectId": projectId,
            "timestamp": Int(Date().timeIntervalSince1970 * 1000),
            "platform": "ios",
            "device": device,
            "app": app,
            "customPayload": payload as Any
        ]
        do {
            #if DEBUG
            let jsonData = try JSONSerialization.data(withJSONObject: body, options: [.prettyPrinted])
            #else
            let jsonData = try JSONSerialization.data(withJSONObject: body, options: [])
            #endif
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                print("[CapHog] Sending event JSON: \n\(jsonString)")
            }
            request.httpBody = jsonData
        } catch {
            completion(error)
            return
        }
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(error)
                return
            }
            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                let err = NSError(domain: "CapHog", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: "HTTP error! status: \(httpResponse.statusCode)"])
                completion(err)
                return
            }
            completion(nil)
        }
        task.resume()
    }
}


