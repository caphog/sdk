import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapHogPlugin)
public class CapHogPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CapHogPlugin"
    public let jsName = "CapHog"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "logEvent", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = CapHog()

    @objc func initialize(_ call: CAPPluginCall) {
        guard let projectId = call.getString("projectId") else {
            call.reject("projectId is required")
            return
        }
        implementation.initialize(projectId: projectId) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }

    @objc func logEvent(_ call: CAPPluginCall) {
        guard let eventName = call.getString("eventName") else {
            call.reject("eventName is missing")
            return
        }
        let payload = call.getObject("payload")
        implementation.logEvent(eventName: eventName, payload: payload) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
}
